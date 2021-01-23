 //Llita dels hotels carregats del Json
 var llistatHotels;
 //Llita dels hotels resultat de la cerca
 var llistatHotelsSeleccionats;
 //Llita dels hotels resultat de la cerca i filtres
 var llistatHotelsSeleccionatsFiltrats;
 //llista d'habitacions seleccionades.Que necessitarem per calcular el preu total
 var llistaHabitacionsSeleccionades;

 //Funció per carregar Json
 function loadJSON(callback) {
     let xobj = new XMLHttpRequest();
     xobj.overrideMimeType("application/json");
     //Molt alerta! si la url es un fitxer local no ens funcionarà sense canviar els permisos del navegador. Per aquest motiu ho he pujat a un fitxer de gitHub.
     xobj.open('GET', 'https://raw.githubusercontent.com/radamuz/LLMJSON/master/hotelesHabitaciones.json', true);
     xobj.onreadystatechange = function () {
         if (xobj.readyState == 4 && xobj.status == "200") {
             callback(xobj.responseText);
         }
     };
     xobj.send(null);
 }

 //Functio per defecte per carregar el Json.
 function init() {
     loadJSON(function (response) {
         // Parse JSON string into object
         llistatHotels = JSON.parse(response);
     });
 }

 //Borram tots els resultats d'una cerca anterior. V
 function borrarResultatsAnteriors() {
     document.getElementById("resultats").innerHTML = "";
 }

 //Desmarcam tots els filtres del lateral. V
 function desmarcarTotsElsFiltresDelLateral() {
     //Seleccionam tots els filtre per la classe. V
     var filtres = document.getElementsByClassName("filtre");
     for(filtre of filtres) {
         filtre.checked = false;
     }
 }

 //Per mostrar el div de més info.
 function mostrarElement(elementActual) {
     /*
      <div>
         <a href="mostrarElement()">Més informació</a>
         <div class="mesInfo">Mostrariem més informació</div>
      </div>
     */
     //Cercarem l'element sense id. Cercarem per classe de l'element pare
     var llistaElements = elementActual.parentElement.getElementsByClassName("mesInfo");
     //la llista d'elements ha de ser 1.
     llistaElements[0].style.display = "block";
 }

 //Quan cliquen al botó de carcam. Executam aquesta funció.
 function realitzarcerca() {
     //Si ja hem fet alguna cerca, ocultam els resultats anteriors.
     borrarResultatsAnteriors();
     //Camps de la cerca
     var temporadaAlta = false;
     var numIndividual = 0;
     var numDoble = 0;
     temporadaAlta = (getValorRadio("temporada") == "alta");
     numIndividual = document.getElementById("individual").value;
     numDoble = document.getElementById("doble").value;

     //Quan feim una nova cerca, desmarcam tots els filtres seleccionats del lateral.
     desmarcarTotsElsFiltresDelLateral();

     llistatHotelsSeleccionats = new Array();
     //Per cada hotel que tenim a la llista
     for (objHotel of llistatHotels) {
         for (objHab of objHotel.habitacions) {
     //Comprovarem el filtre de llists. Si concorden els llits de l'habitació cercarem pels altres filtres.
             if ((objHab.llitIndiv == numIndividual) && (objHab.llitDoble == numDoble)) {
                 var preuMesBaix = null;
                 for (objPreu of objHab.preu) {
                 //Comparam pel valor de temporada alta. Si també coincideix. Mostrarem el resultat.
                     if (objPreu.tempAlta == temporadaAlta) {
                         if (preuMesBaix == null) {
                             preuMesBaix = objPreu
                         } else {
                             if (objPreu.valorTotal < preuMesBaix.valorTotal) {
                                 preuMesBaix = objPreu;
                             }
                         }
                     }
                 }
                 if (preuMesBaix != null) {
                     var objCerca = new Object();
                     objCerca.hotel = objHotel;
                     objCerca.hab = objHab;
                     objCerca.preu = preuMesBaix;
                     //Guardarem dins una llista les dades bàsiques per identificar l'hotel, habitació i preu.
                     llistatHotelsSeleccionats.push(objCerca);                            
                     pintarInformacioHotelHabPreu(objCerca);
                 }
             }
         }
     }
 }
 
 function aplicarFiltres() {
     /*
      var objCerca = new Object();
     objCerca.hotel = objHotel;
     objCerca.hab = objHab;
     objCerca.preu = objPreu;
     */
     //Si la cerca no te resultats, no fa falta filtrar res.
     if (llistatHotelsSeleccionats != null && llistatHotelsSeleccionats.length > 0) {
         //Revisarem la llista de checksbox que tenim

         llistatHotelsSeleccionatsFiltrats = llistatHotelsSeleccionats;
         var llistaAuxiliar;
         for (oFiltre of document.getElementsByClassName("filtre")) {
         //Revisarem els que estan marcats.
             if (oFiltre.checked) {
                 switch (oFiltre.id) {
                     case "filterGym":
                         //Com a l'exemple no tenc gym he fet un filtre damunt el nom. Per treure l'hotel Prova 3. Això només és per mostrar-vos un exemple.
                         if (llistatHotelsSeleccionatsFiltrats.length > 0) {
                             llistaAuxiliar = new Array();
                             for (hotelSeleccionat of llistatHotelsSeleccionatsFiltrats) {
                                 if (hotelSeleccionat.hotel.servicios.gym == true) {
                                     llistaAuxiliar.push(hotelSeleccionat);
                                 }
                             }
                             llistatHotelsSeleccionatsFiltrats = llistaAuxiliar;
                         }

                         break;
                     case "filterRestaurant":
                         if (llistatHotelsSeleccionatsFiltrats.length > 0) {
                              llistaAuxiliar = new Array();
                              for (hotelSeleccionat of llistatHotelsSeleccionatsFiltrats) {
                                  if (hotelSeleccionat.hotel.servicios.restaurante == true) {
                                      llistaAuxiliar.push(hotelSeleccionat);
                                  }
                              }
                              llistatHotelsSeleccionatsFiltrats = llistaAuxiliar;
                          }
                         break;
                         case "filterSpa":
                         if (llistatHotelsSeleccionatsFiltrats.length > 0) {
                              llistaAuxiliar = new Array();
                              for (hotelSeleccionat of llistatHotelsSeleccionatsFiltrats) {
                                  if (hotelSeleccionat.hotel.servicios.spa == true) {
                                      llistaAuxiliar.push(hotelSeleccionat);
                                  }
                              }
                              llistatHotelsSeleccionatsFiltrats = llistaAuxiliar;
                          }
                         break;
                         case "filterWifi":
                         if (llistatHotelsSeleccionatsFiltrats.length > 0) {
                              llistaAuxiliar = new Array();
                              for (hotelSeleccionat of llistatHotelsSeleccionatsFiltrats) {
                                  if (hotelSeleccionat.hotel.servicios.wifi == true) {
                                      llistaAuxiliar.push(hotelSeleccionat);
                                  }
                              }
                              llistatHotelsSeleccionatsFiltrats = llistaAuxiliar;
                          }
                         break;
                         case "filterBerenar":
                         if (llistatHotelsSeleccionatsFiltrats.length > 0) {
                              llistaAuxiliar = new Array();
                              for (hotelSeleccionat of llistatHotelsSeleccionatsFiltrats) {
                                  if (hotelSeleccionat.hotel.comidas.desayuno == true) {
                                      llistaAuxiliar.push(hotelSeleccionat);
                                  }
                              }
                              llistatHotelsSeleccionatsFiltrats = llistaAuxiliar;
                          }
                         break;
                         case "filterDinar":
                         if (llistatHotelsSeleccionatsFiltrats.length > 0) {
                              llistaAuxiliar = new Array();
                              for (hotelSeleccionat of llistatHotelsSeleccionatsFiltrats) {
                                  if (hotelSeleccionat.hotel.comidas.comida == true) {
                                      llistaAuxiliar.push(hotelSeleccionat);
                                  }
                              }
                              llistatHotelsSeleccionatsFiltrats = llistaAuxiliar;
                          }
                         break;
                         case "filterSopar":
                         if (llistatHotelsSeleccionatsFiltrats.length > 0) {
                              llistaAuxiliar = new Array();
                              for (hotelSeleccionat of llistatHotelsSeleccionatsFiltrats) {
                                  if (hotelSeleccionat.hotel.comidas.cena == true) {
                                      llistaAuxiliar.push(hotelSeleccionat);
                                  }
                              }
                              llistatHotelsSeleccionatsFiltrats = llistaAuxiliar;
                          }
                         break;
                         case "filterCat":
                         if (llistatHotelsSeleccionatsFiltrats.length > 0) {
                              llistaAuxiliar = new Array();
                              for (hotelSeleccionat of llistatHotelsSeleccionatsFiltrats) {
                                  if (hotelSeleccionat.hotel.idiomas.catalan == true) {
                                      llistaAuxiliar.push(hotelSeleccionat);
                                  }
                              }
                              llistatHotelsSeleccionatsFiltrats = llistaAuxiliar;
                          }
                         break;
                         case "filterCas":
                         if (llistatHotelsSeleccionatsFiltrats.length > 0) {
                              llistaAuxiliar = new Array();
                              for (hotelSeleccionat of llistatHotelsSeleccionatsFiltrats) {
                                  if (hotelSeleccionat.hotel.idiomas.castellano == true) {
                                      llistaAuxiliar.push(hotelSeleccionat);
                                  }
                              }
                              llistatHotelsSeleccionatsFiltrats = llistaAuxiliar;
                          }
                         break;
                         case "filterEus":
                         if (llistatHotelsSeleccionatsFiltrats.length > 0) {
                              llistaAuxiliar = new Array();
                              for (hotelSeleccionat of llistatHotelsSeleccionatsFiltrats) {
                                  if (hotelSeleccionat.hotel.idiomas.euskera == true) {
                                      llistaAuxiliar.push(hotelSeleccionat);
                                  }
                              }
                              llistatHotelsSeleccionatsFiltrats = llistaAuxiliar;
                          }
                         break;
                         case "filterIng":
                         if (llistatHotelsSeleccionatsFiltrats.length > 0) {
                              llistaAuxiliar = new Array();
                              for (hotelSeleccionat of llistatHotelsSeleccionatsFiltrats) {
                                  if (hotelSeleccionat.hotel.idiomas.ingles == true) {
                                      llistaAuxiliar.push(hotelSeleccionat);
                                  }
                              }
                              llistatHotelsSeleccionatsFiltrats = llistaAuxiliar;
                          }
                         break;
                     case "servei":
                         /*if (llistatHotelsSeleccionatsFiltrats.length > 0) {
                             llistaAuxiliar = new Array();
                             for (hotelSeleccionat of llistatHotelsSeleccionatsFiltrats) {
                                 for (servei of hotelSeleccionat.hotel.serveis) {
                                     if (servei.valorDelServei == true) {
                                         llistaAuxiliar.push(hotelSeleccionat);
                                     }
                                 }
                             }
                             llistatHotelsSeleccionatsFiltrats = llistaAuxiliar;
                         }*/
                         break;
                     default:

                 }
             }
         }

         borrarResultatsAnteriors();
         for (objCerca of llistatHotelsSeleccionatsFiltrats) {
             pintarInformacioHotelHabPreu(objCerca);
         }

     }
 }

 //Pintar la informació al Html.
 //Del hotel no hem de consultar les habitacions, ja que la seleccionada la tenim com a parametre.
 //De la habitacio  no hem de consultar els  preus, ja que el seleccionat el tenim com parametre.
 function pintarInformacioHotelHabPreu(objInformacioElement) {
     /*
     var objCerca = new Object();
     objCerca.hotel = objHotel;
     objCerca.hab = objHab;
     objCerca.preu = objPreu;
     */
     var StrHtml = "<div class=\"resultado\">";
     StrHtml += "<img class=\"imgMiniHab\" src=\"" + objInformacioElement.hab.imatge + "\" />";
     StrHtml += "<h3 style=\"float: left;\">" + objInformacioElement.hotel.nom + "</h3>";
     StrHtml += "<h3 style=\"float:left;margin-left: 20px;\">" + objInformacioElement.hotel.estrelles + " estrellas</h3>";
     StrHtml += "<h3 style=\"float:left;margin-left: 20px;\">Habitación " + objInformacioElement.hab.nom + "</h3>";
     StrHtml += "<div class=\"precios\">";
     StrHtml += "<p>Precio: " + objInformacioElement.preu.valorNet.toFixed(2) + " " + objInformacioElement.preu.moneda + "</p>";
     StrHtml += "<p>Impuestos: " + objInformacioElement.preu.impost + " %</p>";
     StrHtml += "<p>Precio Total: " + objInformacioElement.preu.valorTotal.toFixed(2) + objInformacioElement.preu.moneda + "</p>";
     StrHtml += "<div class=\"precios\">";
     StrHtml += "<input type=\"number\" id=\"" + objInformacioElement.hotel.id + "_" + objInformacioElement.hab.id + "_" + objInformacioElement.preu.tempAlta + "_" + objInformacioElement.preu.prov + "\" placeholder=\"Cantidad\" min=\"0\" max=\"10\" />";
     StrHtml += "<div>";
     StrHtml += "<button type=\"button\" id=\"Seleccionar\" onclick=\"seleccionarHabitacio(" + objInformacioElement.hotel.id + "," + objInformacioElement.hab.id + "," + objInformacioElement.preu.tempAlta + ",'" + objInformacioElement.preu.prov + "'," + objInformacioElement.preu.valorTotal.toFixed(2) + ");\">Seleccionar</button>";
     StrHtml += "</div>";
     StrHtml += "</div>";
     StrHtml += "</div>";
     StrHtml += "<br/>";
     StrHtml += "<p style=\"margin-top: 10px;\">" + objInformacioElement.hotel.descripcion + "</p>";

     document.getElementById("resultats").innerHTML += StrHtml;
 }

 function seleccionarHabitacio(hotelId, habId, tempAlta, preuProv, preuValor, noches) {

     //Si la llista no esta inicialitzada la inicialitzam;
     if (llistaHabitacionsSeleccionades == null) {
         llistaHabitacionsSeleccionades = new Array();
     }

     var valorActual = parseFloat(document.getElementById("preuValor").innerText);
     var numHabActual = parseInt(document.getElementById("numHabitacions").innerText);

     var numHabSeleccionades = parseInt(document.getElementById(hotelId + "_" + habId + "_" + tempAlta + "_" + preuProv).value);

     // Obtenemos el número de noches y lo metemos en la variable noches
     var noches = parseInt(document.getElementById("noches").value);

     if (numHabSeleccionades > 0) {
         document.getElementById("numHabitacions").innerText = numHabActual + numHabSeleccionades;
         var valorOP = valorActual + (preuValor * numHabSeleccionades * noches);
         document.getElementById("preuValor").innerText = valorOP.toFixed(2);

         var habitacioSeleccionada = new Object();
         habitacioSeleccionada.hotelId = hotelId;
         habitacioSeleccionada.habId = habId;
         habitacioSeleccionada.tempAlta = tempAlta;
         habitacioSeleccionada.preuProv = preuProv;
         habitacioSeleccionada.noches = noches;
         habitacioSeleccionada.numHabSeleccionades = numHabSeleccionades;
         llistaHabitacionsSeleccionades.push(habitacioSeleccionada);
         

     } else {
         alert("Selecciona alguna habitación");
     }
 }

 /**************
 Funció genèrica per recuperar valors d'un radiobutton.
 nomRadio es el name del radio <input type="radio" name="aquest nom" id="id" />
 *********/
 function getValorRadio(nomRadio) {
     //obtenim la llista de inputs que tenen el mateix nom
     var radios = document.getElementsByName(nomRadio);
     //recorrem els inputs amb el mateix nom per recuperar el valor del seleccionat.
     for (radio of radios) {
     //si el radio està activat
         if (radio.checked) {
             //retornam el seu valor
             return radio.value;
         }
     }
     //En cas de no haver cap activat retornam "";
     return "";
 }

 function continuar() {
     if (llistaHabitacionsSeleccionades == null || llistaHabitacionsSeleccionades.length == 0) {
         alert("No hay ninguna habitación seleccionada");
     } else {
         var jsonString = JSON.stringify(llistaHabitacionsSeleccionades);
         document.getElementById("parJson").value = jsonString;
         document.getElementById("dispo").submit();
     }
 }