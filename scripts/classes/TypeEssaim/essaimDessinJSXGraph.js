/*
 * Classe Essaim de Dessin JSXGraph : 
 * Permet de créer un bloc d'instructions générant un dessin utilisant JSXGraphe
 */

/*Pseudo type énuméré qui permet d'avoir des noms explicites pour la variable mode*/
var GLOB_libre = "libre";
var GLOB_point = "point";
var GLOB_ligne = "line";
var GLOB_cercle = "circle";
var GLOB_arrow = "arrow";
var GLOB_segment = "segment";
var GLOB_axe = "axis";
var GLOB_angle = "angle";

// variable permettant de sauvegarder l'état actuel du dessin*/
var saveState = {};
var selectListener = [];

EssaimJSXGraph = function (num) {

    //Appelle le constructeur parent
    Essaim.call(this, num);

    //---------- ATTRIBUTS -------------//

    this.nom = "JSXGraph" + num;   // nom de l'élément
    this.numero = num;		   // numéro de l'essaim
    this.proto = "EssaimJSXGraph"; // nature de la classe
    
    // permet de définir dans quel mode l'utilisateur se trouve 
    //(mode point, mode ligne...)
    this.mode = GLOB_libre;
    
    // contient un ensemble de point (une ligne = 2 points par exemple). 
    //Permet de créer un objet
    this.point = [];

    // variable d'environnement : contient les bornes du graphe
    this.brd;
    
    // variable permettant la création de la grille
    this.grid = true;		   
    
    // variable permettant de créer un menu pour enregistrer les objets
    this.menu_enregistre = true;   
    
    this.ms = false;
    
    /*Bidouille pour regler compatibilité sous firefox*/
    this.lastEvent;
    
}

//------------ Déclaration comme classe dérivée de Essaim -------------//

EssaimJSXGraph.prototype = Object.create(Essaim.prototype);
EssaimJSXGraph.prototype.constructor = EssaimJSXGraph;

//Définition des nouveaux attributs

// nom affiché dans le menu
EssaimJSXGraph.prototype.nomAffiche = "Essaim : Dessin JSXGraph";

// nature de la classe
EssaimJSXGraph.prototype.proto = "EssaimJSXGraph";

// image à insérer dans l'énoncé
EssaimJSXGraph.prototype.imageEnonce = "images_essaims/graph.png";

// drapeau, si "true", gère une réponse dans l'analyse
EssaimJSXGraph.prototype.gereReponse = false;


Essaim.prototype.aUneAide = false;

// si "true", fixe la taille de l'image dans l'énoncé
EssaimJSXGraph.prototype.gereTailleImageEnonce = true;

/*Variable de classe*/
EssaimJSXGraph.prototype.$divMenu = $("<div></div>").html("Menu Contextuel");
EssaimJSXGraph.prototype.$menuButtons = $("<div></div>");
EssaimJSXGraph.prototype.stackMultiSelect = [];
EssaimJSXGraph.prototype.$multiSelect = $("<div></div>").html("Multi-Select");
EssaimJSXGraph.prototype.$selection = $("<div></div>");
EssaimJSXGraph.prototype.$multiSelectMenu = $("<div></div>");

//------------ METHODES -----------------//

EssaimJSXGraph.prototype.initEnonce = function ()
/*
 * Initialisation de la partie "énoncé" de l'essaim
 * ajoute un bouton dans la liste d'Essaims de l'énoncé
 * Cas spécial, cet essaim gère aussi la taille de l'image
 */
{
    var tab = document.getElementById('Rid_Enonce_Essaims_List');
    var li = document.createElement('li');
    li.id = "RidEnEs_" + this.nom;
    
    // Bouton ajouté dans la liste des "actions d'Essaim" de l'énoncé
    var bouton = document.createElement('button');
    bouton.id = "boutonEssaimEnonce" + this.nom;
    bouton.className = "Rcl_Surligne_Essaim";
    var txt = document.createTextNode(this.nom);
    bouton.appendChild(txt);

    bouton.onclick = function () {
	// On supprime le "RidEnEs_" devant le nom de la variable
        nomEssaim = li.id.slice("RidEnEs_".length, li.id.length);
	
        var ind = rucheSys.rechercheIndice(nomEssaim, rucheSys.listeBlocPrepa);
	
        var essaimFd = rucheSys.listeBlocPrepa[ind];

	// Si gère réponse, ne peut pas créer deux images "essaim" à la fois
        if (essaimFd.gereReponse == true) {
            alert("Problème , cet essaim devrait pouvoir gérer plusieurs dessins. Contacter les développeurs");
        } else {
            rucheSys.enonce.ajoutImageEssaim(essaimFd);
        }
    }
    li.appendChild(bouton);
    tab.appendChild(li);
}


EssaimJSXGraph.prototype.creerBloc = function (dataRecup)
/* Création d'un bloc  JSXGraph dans l'onglet préparation
 * parametre : - dataRecup : contient l'élément éventuel sauvegardé
 **/
{
    Essaim.prototype.initBloc.call(this);

    // **** Titre du bloc ****

    var titreBloc = document.createElement("DIV");
    var txt = document.createTextNode("Dessin JSXGraph");
    titreBloc.appendChild(txt);
    var span_txtNom = document.createElement("SPAN");    
    span_txtNom.style.backgroundColor = "#f7debc";
    span_txtNom.style.margin = "0px 0px 0px 10px";
    span_txtNom.style.padding = "0px 5px 0px 5px";
    span_txtNom.style.borderRadius = "5px";
    var txtNom = document.createTextNode(" " + this.nom + "\n");
    span_txtNom.appendChild(txtNom);
    titreBloc.appendChild(span_txtNom);
    titreBloc.style.textAlign = "center";

    this.divBloc.appendChild(titreBloc);

    // **** Fabrication du contenu du bloc ****
    
    /*Gestion des evenement du bloc essaim*/
    var barre_tache_editJSXGraph = document.createElement("DIV");
    // Menu "composants" et bouton "composants"
    var bouton_composant_editJSXGraph = document.createElement("button");
    bouton_composant_editJSXGraph.id = "boutonComposantFD" + this.nom;
    bouton_composant_editJSXGraph.innerHTML = "Composants";
    bouton_composant_editJSXGraph.className = "Rcl_Editor_Button_Composant";
    bouton_composant_editJSXGraph.onclick = function () {
        var nom = "editJSXGraph" + this.id.slice("boutonComposantFD".length, this.id.length);
        var nomEssaim = this.id.slice("boutonComposantFD".length, this.id.length);
        var ind = rucheSys.rechercheIndice(nomEssaim, rucheSys.listeBlocPrepa);
        var essaim = rucheSys.listeBlocPrepa[ind];
    }
    barre_tache_editJSXGraph.appendChild(bouton_composant_editJSXGraph);

    /*Initialisation du graphe en lui meme*/
    var $div_brd = $("<div></div>").attr({
        id: "box" + this.numero,
        class: "jxgbox"}).css({
            width: this.divBloc.clientWidth - 30,
            height: 400
	}).appendTo($(this.divBloc));
    
    this.brd = JXG.JSXGraph.initBoard('box' + this.numero, 
				      {	axis: this.axis,
					keepaspectratio: true,
					grid: false});

    /* -----------------------------------
       Création des blocs div pour les menus
       --------------------------------------
    */
    
    /* On crée des blocs correspondant aux différents menus :
     * - div_button_action :  bloc pour le menu des actions
     * - div_button_objet : bloc pour le menu des objets
     * - div_menu_contextuelle : bloc pour le menu contextuel
     **/
    /*
     * Pour chacun de ces menus, on crée un bloc div supplémentaire pour le retour à la ligne :
     * - le bloc div_button_retour_chariot_Action
     * - le bloc div_button_retour_chariot_Objet
     * - le bloc menuButtons
     **/
    /* ----------------------
       Menu pour les actions
       -------------------------
       * Actions possibles :
       * - grille (afficher/supprimer)
       * - déplacer (déplacement libre)
       * - save (sauvegarder des objets dans une boîte à dessins)
       * - supprimer (à mettre plus tard dans le menu contextuel)
       * - multi-selection 
       **/
    var $div_button_action = $("<div></div>").appendTo(this.divBloc);
    var $zoneTexteAction = $("<p></p>").text("Actions").appendTo($div_button_action);
    
    var $div_button_retour_chariot_Action = $("<div></div>").appendTo($div_button_action);
    var $div_button_objet = $("<div></div>").appendTo(this.divBloc);
    
    var $zoneTexteObjet = $("<p></p>").text("Objets").appendTo($div_button_objet);
    var $div_button_retour_chariot_Objet = $("<div></div>").appendTo($div_button_objet);
    
    
    var $div_menu_contextuelle = $("<div></div>").appendTo(this.divBloc);
    this.$divMenu.appendTo($div_menu_contextuelle);
    this.$menuButtons.appendTo($div_menu_contextuelle);
    this.context();

    var modeSelect = function (event) {
	event.data.essaimJSXGraph.mode = GLOB_libre
    };

    var $menu_deroulant = $("<select></select>");
    /*Ajout des différent boutton necessaire au bon fonctionnement du graphe*/
    /* title permet d'afficher une infobulle au survol du bouton */
    var $button_switch_grille = 
	$("<button title=\"Affiche/enlève la grille.\">Grille</button>")
	.appendTo($div_button_retour_chariot_Action).click( 
	    {essaimJSXGraph: this}, function (event) {
		event.data.essaimJSXGraph.grid = !event.data.essaimJSXGraph.grid;
		if (event.data.essaimJSXGraph.grid) {
                    event.data.essaimJSXGraph.brd.removeGrids();
		}else {
                    event.data.essaimJSXGraph.brd.create('grid', []);
		}
		event.data.essaimJSXGraph.brd.fullUpdate();
            });
    
    var $button_libre =
	$("<button title=\"Permet de déplacer des objets dans le graphe.\"> Deplacer </button>")
	.appendTo($div_button_retour_chariot_Action).click(
            {essaimJSXGraph: this}, function (event) {
		event.data.essaimJSXGraph.mode = GLOB_libre
            });
    
    
    /*******************************************************
     * il ne faut pas supprimer cette ligne
     */
    EssaimJSXGraph.prototype.$button_libre = $button_libre;
    
    var $menu_deroulant = $("<select></select>").click({}, function(){
	console.log($($menu_deroulant).val())/*console.log(this.text())*/;
	
    });
    
    var $charger = $("<button>Charger</button>")
	.click({essaimJSXGraph: this, md:$menu_deroulant}, function(event){
	    var ejsx = event.data.essaimJSXGraph;
	    var $m = event.data.md;
	    var ss = saveState[$($m).val()]
	    for (var i in ss){
		ejsx.brd.objects[ss[i].id] = ss[i];
	    }
	    ejsx.brd.fullUpdate();
	});

    var $save = 
	$("<button title=\"Permet de sauvegarder des éléments du graphique dans une boite à dessin.\">Ajout dans boîte à dessin </button>")
	.appendTo($div_button_retour_chariot_Action).click(
            {essaimJSXGraph: this, menu_D: $menu_deroulant, charge:$charger}, function (event) {
		var tab = {};
		if (event.data.essaimJSXGraph.menu_enregistre) {
                    event.data.menu_D.appendTo($div_button_retour_chariot_Action);
		    event.data.charge.appendTo($div_button_retour_chariot_Action);
                    event.data.essaimJSXGraph.menu_enregistre = false;
		}
		for (i in event.data.essaimJSXGraph.brd.objects) {
                    if (i.toLowerCase() !== "jxgBoard1_infobox".toLowerCase()) {
			if (event.data.essaimJSXGraph.brd.objects[i].visible){
			    tab[i] = event.data.essaimJSXGraph.brd.objects[i];
			}
                    }
		}
		var clef = Object.keys(tab);
		var nom_objet = clef[clef.length - 2];
		saveState[nom_objet] = tab;
		event.data.menu_D
		    .append("<option value=\"" + nom_objet + "\">" + nom_objet + "</option>");
            });
    
    /**
     * button supprimer
     * supprimer un element en click,
     * si cliquer sur un element non valide, il va alert un message de error,
     * si valide, il va supprimer l'element.
     * il marche une fois et puis revient en mode selection
     * @type {*|{trigger, _default}|jQuery}
     */
    var $supprimer = 
	$("<button title = \"Permet de supprimer un élément.\">Supprimer un élément</button>")
	.appendTo($div_button_retour_chariot_Action).click(
	    {essaimJSXGraph: this}, function (event) {
		modeSelect(event);
		var tmp = function () {
		    var element = essaimJSXGraph.getTopUnderMouse();
		    if(element.elType){
			essaimJSXGraph.brd.removeObject(element);
		    }else {
			alert("element invalide.")
		    }
		    essaimJSXGraph.brd.update();
		    essaimJSXGraph.brd.off("up", tmp);
		    
		    essaimJSXGraph.brd.on("up", function () {
			essaimJSXGraph.selection()
		    })
		};
		essaimJSXGraph.brd.on("up", tmp)	
	    });

    var $button_image = $("<button></button>")
        .html("upload image")
        .appendTo($div_button_retour_chariot_Action)
        .click(function (event) {
            var self = essaimJSXGraph;
            self.popupImageUploader(function (event) {
                var result = event.target.result;
                self.brd.create("image", [result, [0, 0], [5, 5]]);
                self.brd.update()
            })
        });
    
    var $multiselect = 
	$("<button title = \"Action de multi-sélection\">Multi-select</button>")
	.appendTo($div_button_retour_chariot_Action).click(
	    {essaimJSXGraph: this}, function (event) {
		essaimJSXGraph.multiSelect();
	    });


    /* ----------------------
       Menu pour les objets
       -------------------------
       * Objets disponibles :
       * - point
       * - ligne
       * - cercle
       * - segment
       * - flèche
       * - axe
	   * - angle
       **/
    var $button_point = $("<button title=\"Permet de créer un point.\">Point</button>")
	.appendTo($div_button_retour_chariot_Objet).click(
            {essaimJSXGraph: this}, function (event) {
		event.data.essaimJSXGraph.mode = GLOB_point;
            });
    
    var $button_ligne = 
	$("<button title=\"Permet de créer une droite. On utilise deux points pour cela.\">Droite</button>")
	.appendTo($div_button_retour_chariot_Objet).click(
            {essaimJSXGraph: this}, function (event) {
		event.data.essaimJSXGraph.mode = GLOB_ligne;
            });

    
    var $button_cercle = 
	$("<button title=\"Permet de créer un cercle. On utilise deux points pour cela.\">Cercle</button>")
	.appendTo($div_button_retour_chariot_Objet).click(
            {essaimJSXGraph: this}, function (event) {
		event.data.essaimJSXGraph.mode = GLOB_cercle;
            });
    
    var $button_segment = 
	$("<button title=\"Permet de créer un segment. On utilise deux points pour cela.\">Segment</button>")
	.appendTo($div_button_retour_chariot_Objet).click(
            {essaimJSXGraph: this}, function (event) {
		event.data.essaimJSXGraph.mode = GLOB_segment;
            });
    
    var $button_arrow = 
	$("<button title=\"Permet de créer un vecteur. On utilise deux points pour cela.\">Vecteur</button>")
	.appendTo($div_button_retour_chariot_Objet).click(
            {essaimJSXGraph: this}, function (event) {
		event.data.essaimJSXGraph.mode = GLOB_arrow;
            });
    
    var $button_axis = 
	$("<button title=\"Permet de créer un axe. On utilise deux points pour cela.\">Axe</button>")
	.appendTo($div_button_retour_chariot_Objet).click(
            {essaimJSXGraph: this}, function (event) {
		event.data.essaimJSXGraph.mode = GLOB_axe;
            });   
			
	var $button_angle = 
	$("<button title=\"Permet de créer un angle en utiliant 3 points\">Angle</button>").appendTo($div_button_retour_chariot_Objet).click(
	{essaimJSXGraph: this}, function (event){
		event.data.essaimJSXGraph.mode = GLOB_angle;
	});

    /*Gestion de l'evenementiel*/
    var timer;
    $(window).resize({essaimJSXGraph: this}, function (event) {
	var graph = event.data.essaimJSXGraph
	console.log(graph.brd);
        clearTimeout(timer);
        timer = setTimeout(
	    function () {
		
		graph.brd.resizeContainer(
		    graph.divBloc.clientWidth - 30,
		    graph.divBloc.clientWidth - 30);
	    },200);
	});
	/*$(window).mousemove({essaimJSXGraph:this}, function(event){
	var graph = event.data.essaimJSXGraph;
	
   /* }, 200);*/
/*});*/

    /*Creation de points, à retoucher/améliorer*/
    var essaimJSXGraph = this;
    this.brd.on('up', function (event) {
        if (essaimJSXGraph.mode !== GLOB_libre) {
            var point = undefined;
            var brd = essaimJSXGraph.brd;
            var parent = undefined;
            var coords = getMouseCoords(event, essaimJSXGraph.brd);
	    
            for (element in brd.objects) {
                if (JXG.isPoint(brd.objects[element])
                    && brd.objects[element].hasPoint(coords.scrCoords[1], coords.scrCoords[2])) {
                    point = element;
                }
            }
            if (point === undefined) {
                point = brd.create("point", brd.getUsrCoordsOfMouse(event));
                if (parent !== undefined) {
                    point.ancestors[0] = 0;
                }
	    }else if (!brd.objects[point].getAttribute("visible")) {
		brd.objects[point].setAttribute({visible: true});
            }
            essaimJSXGraph.point.push(point);
	    
            /*Création de la forme souhaitée*/
	    if (essaimJSXGraph.mode === GLOB_point) {
                essaimJSXGraph.point = [];
            }
/*<<<<<<< HEAD*/
            else if (essaimJSXGraph.point.length === 2) {
		if (essaimJSXGraph.mode !== GLOB_axe){
		    var newElement = brd.create(essaimJSXGraph.mode, essaimJSXGraph.point);
/*=======*/
		else if (essaimJSXGraph.point.length === 3) {
			
/*>>>>>>> 8b60977a8af6452cca8ccb9ca2d16e229b559802*/
		}
		
        else if (essaimJSXGraph.point.length === 2 && essaimJSXGraph.mode !== GLOB_angle) {
			if (essaimJSXGraph.mode !== GLOB_axe){
				var newElement = brd.create(essaimJSXGraph.mode, essaimJSXGraph.point);
				essaimJSXGraph.point = [];
			}
			if (essaimJSXGraph.mode === GLOB_axe) {
				var newElement = 
				brd.create(essaimJSXGraph.mode,essaimJSXGraph.point, 
				   { 
				       name:'',
				       withLabel:true,
				       label:{
					   position:'top'
				       }
				   });
<<<<<<< HEAD
		    /*Sert à ne pas créer les grilles lorsque on crée un axe*/                    
		    newElement.removeAllTicks();
                    newElement.isDraggable = true;
                    newElement.on('drag', function () {
			essaimJSXGraph.brd.fullUpdate()
                    });
                    for (var i in newElement.ancestors) {
			newElement.ancestors[i].isDraggable = true;
			newElement.ancestors[i].on('drag', function () {
                            essaimJSXGraph.brd.fullUpdate()
                        });
                    }
		    newElement.needsRegularUpdate = true;
		 
                }
		console.log(newElement);
		essaimJSXGraph.point = [];
            }
=======
				   
				/*Sert à ne pas créer les grilles lorsque on crée un axe*/                    
				newElement.removeAllTicks();
                newElement.isDraggable = true;
				
                newElement.on('drag', function () {
					essaimJSXGraph.brd.fullUpdate()
                });
				
					for (var i in newElement.ancestors) {
						newElement.ancestors[i].isDraggable = true;
						newElement.ancestors[i].on('drag', function () {
							essaimJSXGraph.brd.fullUpdate()
                        });
					}
				}
			}
>>>>>>> 8b60977a8af6452cca8ccb9ca2d16e229b559802
        }
    });

    this.brd.on('move', function(event){
	essaimJSXGraph.lastEvent = event;
    });

    
    EssaimJSXGraph.prototype.initEnonce.call(this);

    EssaimJSXGraph.prototype.initAnalyse.call(this);    
};


EssaimJSXGraph.prototype.nouveauComposant = function (classeComposant) {
    rucheSys.ajoutComposantEssaim("editJSXGraph" + this.nom, classeComposant);
}

EssaimJSXGraph.prototype.detruitBloc = function () {
    freeBoard(this.brd);
    Essaim.prototype.detruitBloc.call(this);
}

/* -------------------------------------------------
   Génération du code OEF
   ----------------------------------------------------
*/
EssaimJSXGraph.prototype.toOEF = function () {
    var bord_gauche = this.brd.getBoundingBox()[0];
    var bord_haut = this.brd.getBoundingBox()[1];
    var bord_droit = this.brd.getBoundingBox()[2];
    var bord_bas = this.brd.getBoundingBox()[3];
    var OEF = "\\text{rangex" + this.nom + " = " + bord_gauche + "," + bord_droit + "}\n"
    OEF += "\\text{rangey" + this.nom + " = " + bord_bas + "," + bord_haut + "}\n";
    OEF += "\\text{" + this.nom + " = rangex \\rangex" + this.nom + "\n";
    OEF += "rangey \\rangey" + this.nom + "\n";

    if (!this.grid){
 	var pas_x = JXG.Options.ticks.ticksDistance;
 	var pas_y = JXG.Options.ticks.ticksDistance;
 	
 	/*On recupere les position des première ligne de la grille*/
 	var deb_x = (bord_gauche - (bord_gauche%JXG.Options.ticks.ticksDistance));
 	var deb_y = (bord_bas - (bord_bas%JXG.Options.ticks.ticksDistance));
 	
 	var nb_x = Math.ceil(bord_droit - bord_gauche / pas_x);
 	var nb_y = Math.ceil(bord_haut - bord_bas / pas_x);
 	OEF += "parallel " + 
 	    deb_x + "," + bord_haut + "," + 
 	    deb_x + "," +  bord_bas + "," + 
 	    pas_x     + "," +  0  + "," + 
 	    nb_x + ",grey\n";
 	
 	OEF += "parallel " + 
 	    bord_gauche + "," + deb_y + "," + 
 	    bord_droit  + "," + deb_y + "," + 
 	    0  + "," +    pas_y    + "," + 
  	    nb_y + ",grey\n";
    }

    for (element in this.brd.objects){
	var brdElement = this.brd.objects[element];
	
	/*On recupère la hauteur et la largeur de la zone de dessin, en terme de 
	  coordonnées du dessin*/
	var largeur = bord_droit - bord_gauche;
	var hauteur = bord_haut - bord_bas;
	
	
	/*Taille de la diagonale de la zone de dessin*/
	var coef = Math.sqrt(largeur * largeur + hauteur * hauteur);
	

	if (brdElement.getAttribute("visible")){
	    switch (brdElement.getType()){
	    case GLOB_point :
		OEF +=  "point " + brdElement.X() + "," + brdElement.Y() + ",black\n";
		break;
	    case GLOB_ligne :
		var p1 = brdElement.point1;
		var p2 = brdElement.point2;
		
		/*Taille de la diagonale de la zone de dessin*/
		var coef = Math.sqrt(largeur * largeur + hauteur * hauteur);
		
		/*a et b correspondent aux vecteurs de translation des deux points qui correspondent à
		  la ligne, car en OEF la primitive ligne ne fait qu'un segment, on translate donc 
		  les points en dehors de la zone de dessin, pour donner l'illusion d'une droite*/
		var a = (p2.X() - p1.X()) * coef;
		var b = (p2.Y() - p1.Y()) * coef;
		
		OEF += "line " +
		    (a + p1.X()) + "," + (b + p1.Y()) + "," +
		    (-a + p2.X()) + "," + (-b + p2.Y()) +
		    ",black\n";
		break;
	    case GLOB_cercle :
		OEF += "circle " + brdElement.center.X() + "," + brdElement.center.Y() +
		    "," + (brdElement.Radius() * this.brd.unitX) + ",black\n";
		break;
	    case GLOB_segment :
		var p1 = brdElement.point1;
		var p2 = brdElement.point2;

		OEF += "segment " +
		    p1.X() + "," + p1.Y()+ "," +
		    p2.X() + "," + p2.Y() + ",black\n";
		break;
	    case GLOB_arrow : 
		var p1 = brdElement.point1;
		var p2 = brdElement.point2;
		
		OEF += "arrow " +
		    p1.X() + "," + p1.Y()+ "," +
		    p2.X() + "," + p2.Y() + ",7,black\n";
		break;
	    case GLOB_axe : 
		/*On recupère les deux points qui définisse un axe*/
		var p1 = brdElement.point1;
		var p2 = brdElement.point2;
		
		/*Inverted sert à gerer les axes qui pointent vers la gauche, 
		  lorsque c'est -1 une inversion à lieu, sinon on fait normalement*/
		var inverted = 1;
		if (p2.X() < p1.X()){
		    inverted = -1;
		} 

		/**/
		var coef_dir = inverted * (p2.Y() - p1.Y()) /(p2.X() - p1.X());
		var bord_1;
		var bord_2;
		if (coef_dir < 0){
		    if (inverted === -1){
			dist_bord_1 = Math.abs(bord_haut   - p2.Y());
			dist_bord_2 = Math.abs(bord_gauche - p2.X());

		    }else{
			dist_bord_1 = Math.abs( bord_bas  - p2.Y());
			dist_bord_2 = Math.abs(bord_droit - p2.X());

		    }
		    
		}else{
		    if (inverted === -1){
			dist_bord_1 = Math.abs( bord_bas  - p2.Y());
			dist_bord_2 = Math.abs(bord_droit - p2.X());
		    }else{	
			dist_bord_1 = Math.abs(bord_haut   - p2.Y());
			dist_bord_2 = Math.abs(bord_gauche - p2.X());
		    }
		}
		var dist_1 = inverted * coef_dir * dist_bord_1;
		var dist_2 = inverted * coef_dir * dist_bord_2;
		
		var pyth_1 = Math.sqrt(dist_1 * dist_1 + dist_bord_1 * dist_bord_1);
		var pyth_2 = Math.sqrt(dist_2 * dist_2 + dist_bord_2 * dist_bord_2);

		var point_final = {x:p2.X(), y:p2.Y()};
		if (pyth_1 < pyth_2){
		    point_final.y += inverted * dist_1;
		    point_final.x += inverted * dist_bord_1;
		}else{
		    point_final.y += inverted * dist_2;
		    point_final.x += inverted * dist_bord_2;
		}

		OEF += "arrow " +
		    p1.X() + "," + p1.Y() + "," +
		    point_final.x + "," + point_final.y + ",7,black\n";
		break;
	    default :
	    }
	}	
    }

    OEF += "\\text{url" + this.nom + " = draw(200,200\n\\" + this.nom + ")}"
    return OEF;
}

EssaimJSXGraph.prototype.toOEFFromStatement = function (idReponse) {
    return "<img src=\"\\url" + this.nom + "\" alt=\"Erreur avec l'image " + this.nom + "\"/>";

};


/**
 * supprimer une image dans le board
 * @param image: JSXGraph.element(image), la variable qui indique une image de JSXGraph
 */
EssaimJSXGraph.prototype.removeImage = function (image) {
    this.brd.removeObject(image)
};

$(document).ready(function () {
    rucheSys.initClasseEssaim(EssaimJSXGraph)
});


/**
 * ici on definir les options de menu
 * @param element, callback argument
 * @returns {{}}
 */
EssaimJSXGraph.prototype.menuOptions = function (element) {
    var options = {};
    var self = this;
    options.common = {
        changeNom: {
            nom: "Changer le nom",
            callback: function () {
		$.when(self.inputbox("Entrer un nom : "))
		    .done(function (nom) {
			element.name = nom;
			self.brd.update()
		    })
		    .fail(function (err) {
			alert(err)
		    })
            }
        }
    };
    return options
};

/**
 * insère une image dans un point
 * @param url" String, url de l'image
 * @param pointExiste: JSXGraph.element(point), le variable qui indique un point de JSXGraph
 * @returns {*}
 */
EssaimJSXGraph.prototype.fillImageIntoPoint = function (url, pointExiste) {
    /**
     * Important:
     * En changer le numero de layer de image, on met image le plus haut que les autre
     */
    this.brd.options.layer["image"] = 10;
    function getCoord2D(paint) {
        return getCoord(paint).slice(1)
    }

    function getSize(paint) {
        return paint.visProp.size
    }

    var coodsToPixel = 30;
    //TODO to have an exact ratio
    var width = getSize(pointExiste) / coodsToPixel;
    var point = (function () {
        var point = getCoord2D(pointExiste);
        point[0] -= width / 2;
        point[1] -= width / 2;
        return point
    })();
    return this.brd.create("image", [url, point, [width, width]])
};

/**
 * Interface function
 * pop up un fenetre a upload un image
 * @param readSuccess
 * @param readFail
 */
EssaimJSXGraph.prototype.popupImageUploader = function (readSuccess, readFail) {
    var self = this;
    if (!FileReader){
		var err = "A Newer Version of Browser is Required.";
		if(readFail){
			readFail(err)
		}
		else throw err
	}
    var $input = $("<input />")
        .attr("type", "file");
    var $img = $("<img />").attr({
        src: "",
        alt: "image"
    });
    $input.trigger("click");
    function readFile(file) {
        var reader = new FileReader();
        reader.onload = readSuccess;
    /*
        function readSuccess(event) {
            self.fillImageIntoPoint(event.target.result, paint)
        }
    */
        reader.readAsDataURL(file);
    }

    $input.get(0).onchange = function (event) {
	var target = event.target || event.srcElement; //Ligne de compatibilité de divers navigateur
        readFile(target.files[0])
    }
};

/**
 * Obtenir la premiere element, a partir du texte*
 * * les textes ont le moins prioritaire juste dans cette fonction,
 * dont le layer n'est pas globalement modifie
 * @returns {*}
 */
EssaimJSXGraph.prototype.getTopUnderMouse = function () {
    //var layer = board.options.layer;
    var layer = {
        point: 9,
        arc: 8,
        line: 7,
        circle: 6,
        curve: 5,
        polygon: 4,
        sector: 3,
        angle: 2,
        grid: 1,
        image: 0,
        text: -1
    };
    var ele = this.brd.getAllUnderMouse(this.lastEvent);
    if (!ele.length) return null;
    var level = layer[ele[0].elType];
    var top = ele[0];
    for (var i = 0; i < ele.length; i++) {
	if (level < layer[ele[i].elType]) {
            level = layer[ele[i].elType];
            top = ele[i]
        }
    }
    return top
};

/**
 * Interface function
 * construire un menu, voir doc
 * @param element, callback argument
 */
EssaimJSXGraph.prototype.buildMenu = function (element) {
    // Pour indiquer les options dans le menu par rapport aux types des elements
    var buildButton = function (option) {
        return $("<button></button>")
            .html(option.nom)
            .click(option.callback)
    };
    var options = this.menuOptions(element);
    console.log(options);
    var self = this;
    this.$menuButtons.html("");
    (function (list) {
        for (var key = 0; key < list.length; key++) {
            if (options[list[key]]) {
                var option = Object.keys(options[list[key]]);
                for (var i = 0; i < option.length; i++) {
                    self.$menuButtons.append(buildButton(options[list[key]][option[i]]))
                }
            }

        }
    })(["common", element.elType])
};

/**
 * Function: selection mode
 */
EssaimJSXGraph.prototype.selection = function () {
    var element = this.getTopUnderMouse();
    if(element.elType){
	this.$divMenu.html("Menu Contextuel de " + element.elType + " " +element.name);
	this.buildMenu(element)
    }
};

/**
 * Interface function
 * effectuer le menu contextuel a la page
 */
EssaimJSXGraph.prototype.context = function () {
    /*C'est pas compatible avec firefox la dessous, a voir pourquoi...*/
    var self = this;
    this.brd.on("up", function () {
	self.selection()
    })
};

/**
 * associer un evenement de souris a multi-select
 * clicquer une fois un element: le select, deuxieme fois: le lache
 * button ok: finir multi-selection, puis menu va apparaitre
 * button clean: effacer multi-selection
 */
EssaimJSXGraph.prototype.multiSelect = function () {
    this.stackMultiSelect = [];
    this.$multiSelect.appendTo(this.divBloc);
    var self = this;
    if (!this.ms){
	// ok button
	var $ok = $("<button></button>").appendTo(this.$multiSelect)
	    .html("ok")
	    .click(function (event) {
		self.brd.off("up", tmp);
		self.$button_libre.trigger("click");
		$ok.remove();
		$clean.remove();
		self.buildMultiSelectMenu()
	    });
	// clean button
	var $clean = $("<button></button>").appendTo(this.$multiSelect)
	    .html("clean")
	    .click(function () {
		self.cleanMultiSelection()
	    });

	this.ms = true;
    }
    this.$selection.appendTo(this.divBloc);
    this.$multiSelectMenu.appendTo(this.divBloc);
    var tmp = function () {
	self.$button_libre.trigger("click");
	var element = self.getTopUnderMouse();
	if(element.elType) {
	    var tmp = self.stackMultiSelect.indexOf(element);
	    if (tmp >= 0) {
		self.stackMultiSelect.splice(tmp, 1)
	    } else {
		self.stackMultiSelect.push(element)
	    }
	}
	//interface
	self.$selection.html("");
	var html = [];
	var select = self.stackMultiSelect;
	for(var i = 0; i < select.length; i++){
	    html.push(select[i].elType + " " + select[i].name)
	}
	self.$selection.html(JSON.stringify(html))
    };
    this.brd.on("up", tmp)
};

/**
 * Interface function
 * construire les button dans le menu
 */
EssaimJSXGraph.prototype.buildMultiSelectMenu = function () {
    // this.stackMultiStack est le array de selection
    var menu = {};
    var self = this;

    menu.grouper = {
        nom: "grouper",
        callback: function () {
            self.brd.create("group", self.stackMultiSelect)
        }
    };

    menu.toutsup = {
        nom: "tout supprimer",
        callback: function () {
            for(var i = 0; i < self.stackMultiSelect.length; i++){
                self.brd.removeObject(self.stackMultiSelect[i])
            }
            self.brd.update()
        }
    };

    var key = Object.keys(menu);
    var buildButton = function (option) {
	console.log(option);
	return $("<button></button>")
	    .html(option.nom)
	    .click(option.callback)
    };
    for(var i = 0; i < key.length; i++){
	self.$multiSelectMenu.append(buildButton(menu[key[i]]))
    }
    self.$multiSelectMenu.appendTo(self.divBloc)
};

/**
 * effacer les selections multiples
 */
EssaimJSXGraph.prototype.cleanMultiSelection = function () {
    this.stackMultiSelect = [];
    this.$selection.html("");
    this.$multiSelectMenu.html("")
};

/**
 * popup un input box pour recuperer le valeur
 * @param label: le titre du input
 * @param type: le type du input
 * @returns {*}, $.Deferred.promise()
 */
EssaimJSXGraph.prototype.inputbox = function (label, type) {
    label = label || "";
    type = type || "text";
    var def = $.Deferred();
    var $box = $("<div></div>")
	.appendTo(this.divBloc);
    var $label = $("<div></div>")
	.html(label)
	.appendTo($box);
    var $input = $("<input />")
	.attr("type", type)
	.appendTo($box);
    var $submit = $("<button></button>")
	.html("ok")
	.click(function (event) {
	    if(!$input.val() || !$input.val().length){
		def.reject("le valeur n'est pas defini")
	    }else {
		$box.remove();
		def.resolve($input.val())
	    }
	})
	.appendTo($box);
    return def.promise()
};

EssaimJSXGraph.prototype.selectMode = function () {
    this.$button_libre.trigger("click")
};

function getMouseCoords(event, brd){
    var cPos = brd.getCoordsTopLeftCorner(event, 0),
    absPos = JXG.getPosition(event, 0),
    dx = absPos[0] - cPos[0],
    dy = absPos[1] - cPos[1];
    return new JXG.Coords(JXG.COORDS_BY_SCREEN, [dx, dy], brd);
}
