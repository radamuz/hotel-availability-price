var llistatHotels;
var resultatsSeleccionats;
var infoPintar;

//Funció per obtenir el parametre que hem enviat pel mètode GET.(strJSon).
function obtenirParametreJSON() {
    //Recupera els parametres de la URL
    var queryString = window.location.search;
    //Ho convertim a un objecte que ens ajudarà a cercar els diferents parametres dins la URL
    var urlParams = new URLSearchParams(queryString);

    //Obtenim el paràmetre strJson de la llista.
    var strJsonEncodedURL = urlParams.get("parJson")
    //Decodificam els paramtres, que si mirau com està codificat l'anterior string veureu que no es pot llegir.
    var strJson = decodeURIComponent(strJsonEncodedURL)

    //Tornam el valor
    return JSON.parse(strJson);
}

//Funció per carregar Json
function loadJSON(callback) {
    let xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.responseType = 'json';
    //Molt alerta! si la url es un fitxer local no ens funcionarà sense canviar els permisos del navegador. Per aquest motiu ho he pujat a un fitxer de gitHub.
    xobj.open('GET', 'https://raw.githubusercontent.com/radamuz/LLMJSON/master/hotelesHabitaciones.json', true);

    xobj.onreadystatechange = function () {
        if (xobj.readyState == 4 && xobj.status == "200") {
            callback(xobj.response);
        }
    };
    xobj.send(null);
}

$(document).ready(function () {
    var habSeleccionades = obtenirParametreJSON();
    loadJSON(function (response) {
        // Parse JSON string into object
        llistatHotels = response; //JSON.parse(response);
        resultatsSeleccionats = obtenirParametreJSON();
        /*
        var habitacioSeleccionada = new Object();
        habitacioSeleccionada.hotelId = hotelId;
        habitacioSeleccionada.habId = habId;
        habitacioSeleccionada.tempAlta = tempAlta;
        habitacioSeleccionada.preuProv = preuProv;
        habitacioSeleccionada.numHabSeleccionades = numHabSeleccionades;
        */
        var infoExtesaResultatsSeleccionats = new Array();
        for (resultSelect of resultatsSeleccionats) {
            infoExtesaResultatsSeleccionats.push(getInfoExtesaResultat(resultSelect));
        }
        //Ja tenim tota la informació dins l'array. Ara pintarem aqueta informació.
        pintatResultats(infoExtesaResultatsSeleccionats);
    });
});

//A partir de les ids que ens arriba per parametre. Obtindrem la informació extesa de cada entitat. Hotel, Habitacio i Preu.
//Ho insetarem dins un objecte per tenir més accessible aquesta informació.
function getInfoExtesaResultat(resultat) {
    var infoResultat = new Object;
    /*
    L'objecte tendrà aquest format. El mateix que disponibilitat. Però amb quantitat de resultats seleccionats.
    infoResultat.hotel
    infoResultat.hab
    infoResultat.preu
    infoResultat.quantitat
    */
    //Cercarem la informació seleccionada. Per cada hotel, per cada habitacio, per cada preu. Com el recorregut que feiem a disponibilitat.
    for (objHotel of llistatHotels) {
        if (objHotel.id == resultat.hotelId) {
            infoResultat.hotel = objHotel;
            for (objHab of objHotel.habitacions) {
                if (objHab.id == resultat.habId) {
                    infoResultat.hab = objHab;
                    for (objPreu of objHab.preu) {
                        if ((objPreu.prov == resultat.preuProv) && (objPreu.tempAlta == resultat.tempAlta)) {
                            infoResultat.preu = objPreu;
                            infoResultat.quantitat = resultat.numHabSeleccionades;
                            infoResultat.noches = resultat.noches;
                        }
                    }
                } //if hab
            } //for hab
        } //if
    } //for hot
    return infoResultat;
}

//Pintar la informació per pantalla.
function pintatResultats(llistaInfoPintar) {
    /* Tenim aquesta informació dins el parametre que rebem.
    llistaInfoPintar.hotel
    llistaInfoPintar.hab
    llistaInfoPintar.preu
    llistaInfoPintar.quantitat
    */
    var strHtml = "";
    var nochesHtml = "";

    var preuTotal = 0;
    for (infoPintar of llistaInfoPintar) {

        strHtml += "<li class=\"list-group-item d-flex justify-content-between lh-condensed\">";
        strHtml += "<div>";
        strHtml += "<h6 class=\"my-0\">" + infoPintar.hotel.nom + "</h6>";
        strHtml += "<small class=\"text-muted\">Estrellas: " + infoPintar.hotel.estrelles + "</small>";
        strHtml += "<br />";
        strHtml += "<small class=\"text-muted\">Habitación: " + infoPintar.hab.nom + "</small>";
        strHtml += "<br />";
        strHtml += "<small class=\"text-muted\">Camas individuales: " + infoPintar.hab.llitIndiv + "</small>";
        strHtml += "<br />";
        strHtml += "<small class=\"text-muted\">Camas dobles: " + infoPintar.hab.llitDoble + "</small>";
        strHtml += "<br />";
        strHtml += "<small class=\"text-muted\">Precio neto: " + infoPintar.preu.valorNet.toFixed(2) + infoPintar.preu.moneda + "</small>";
        strHtml += "<br />";
        strHtml += "<small class=\"text-muted\">Impuesto: " + infoPintar.preu.impost + "%</small>";
        strHtml += "<br />";
        strHtml += "<small class=\"text-muted\">Cantidad: " + infoPintar.quantitat + "</small>";
        strHtml += "<br />";
        strHtml += "<small class=\"text-muted\">Noches: " + infoPintar.noches + "</small>";
        strHtml += "</div>";
        strHtml += "<span class=\"text-muted\">" + infoPintar.preu.valorTotal.toFixed(2) + infoPintar.preu.moneda + "</span>";
        strHtml += "</li>";

        preuTotal += infoPintar.preu.valorTotal * infoPintar.quantitat * infoPintar.noches;
        $("#inputHiddenPreuTotal").html(preuTotal);
        //strHtml +=  Array(16).join('wat' - 1) + ' Batman!';
        //Jquery. Com el innerHtml però d'una altra forma.
        $("#informacio").html(strHtml);
    };
    strHtml += "<li class=\"list-group-item d-flex justify-content-between\">";
    strHtml += "<span>Total (EUR)</span>";
    strHtml += "<strong id=\"cambioValorTotal\">" + preuTotal.toFixed(2) + infoPintar.preu.moneda + "</strong>";
    strHtml += "</li>"
    $("#informacio").html(strHtml);
}

$(function () {

    // Esperando los cambios
    $('input[type="radio"]').on('change', function () {

        // Obtener el primer checkeado
        var $target = $('input[type="radio"]:checked');
        // Esconder todos los divs con la clase .showhide
        $(".showhide").hide();
        // Mostrar div que se corresponde con el radio seleccionado.
        $($target.attr('data-section')).show();

        // Si el radiobutton de PayPal está checkeado entonces quitamos el atributo required a todos los input de pago con tarjeta de crédito, si no está checkeado entonces le ponemos el atributo required.
        if ($("#paypal").is(':checked')) {
            $('#cc-name').removeAttr('required');
            $('#cc-number').removeAttr('required');
            $('#cc-expiration').removeAttr('required');
            $('#cc-cvv').removeAttr('required');
        } else {
            $('#cc-name').attr('required', true);
            $('#cc-number').attr('required', true);
            $('#cc-expiration').attr('required', true);
            $('#cc-cvv').attr('required', true);
        }
        // desencadenar el cambio en la carga de la página
    }).trigger('change');

});



function continuar() {
    // if (llistaHabitacionsSeleccionades == null || llistaHabitacionsSeleccionades.length == 0) {
    //     alert("No hay ninguna habitación seleccionada");
    // } else {
    //     var jsonString = JSON.stringify(llistaHabitacionsSeleccionades);
    //     document.getElementById("parJson").value = jsonString;
    //     document.getElementById("dispo").submit();
    // }
}

// Precios servicios adicionales. Array. Recorrer la array.
let psat = [399.99, 699.99, 29.99, 69.99, 299.99]

function sa_print() {
    for (let number = 0; number < psat.length; number++) {
        $("#sat" + number).html(psat[number] + "€");
    }
}

// $("#inputHiddenPreuTotal").val();

function sa_change() {

  acumulado = parseFloat(document.getElementById('inputHiddenPreuTotal').textContent);

    for (let number = 0; number < psat.length; number++) {

        // Por cada uno de los servicios adicionales, si clicas en un checkbox del servicio adicional y si este está checkeado y además el precio total es mayor que el valor acumulado, entonces imprime en el #cambioValorTotal el valor acumulado más el precio del servicio adicional. En caso contrario, imprime el precio del servicio adicional más el precio total. En el caso de que el checkbox sea deseleccionado en vez de sumarse, se restará.
        $('#sa' + number).on('click', function () {
            if ($(this).is(':checked')) {
                if (acumulado > parseFloat(infoPintar.preu.valorTotal.toFixed(2))) {
                    acumulado = acumulado + parseFloat(psat[number].toFixed(2));
                    $("#cambioValorTotal").html(parseFloat(acumulado).toFixed(2) + infoPintar.preu.moneda);
                } else {
                    acumulado = parseFloat(psat[number].toFixed(2)) + parseFloat(infoPintar.preu.valorTotal.toFixed(2));
                    $("#cambioValorTotal").html(parseFloat(acumulado).toFixed(2) + infoPintar.preu.moneda);
                }
            } else {
                if (acumulado > parseFloat(infoPintar.preu.valorTotal.toFixed(2))) {
                    acumulado = acumulado - parseFloat(psat[number].toFixed(2));
                    $("#cambioValorTotal").html(parseFloat(acumulado).toFixed(2) + infoPintar.preu.moneda);
                } else {
                    acumulado = parseFloat(psat[number].toFixed(2)) - parseFloat(infoPintar.preu.valorTotal.toFixed(2));
                    $("#cambioValorTotal").html(parseFloat(acumulado).toFixed(2) + infoPintar.preu.moneda);
                }
            }
        })
    }
}
