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

EssaimJSXGraph = function (num) {

    //Appelle le constructeur parent
    Essaim.call(this, num);

    //---------- ATTRIBUTS -------------//

    this.nom = "JSXGraph" + num;	// nom de l'élément
    this.numero = num;				// numéro de l'essaim
    this.proto = "EssaimJSXGraph";	// nature de la classe
    this.mode = GLOB_point;			// permet de définir dans quel mode l'utilisateur se trouve (mode point, mode ligne...)
    this.point = [];				// contient un ensemble de point (une ligne = 2 points par exemple). Permet de créer un objet
    this.brd;						// variable d'environnement : contient les bornes du graphe
    this.grid = true;				// variable permettant la création de la grille
    this.saveState = [];			// variable permettant de sauvegarder l'état actuel du dessin
	this.menu_enregistre = true;	// variable permettant de créer un menu pour enregistrer les objets
}

//------------ Déclaration comme classe dérivée de Essaim -------------//

EssaimJSXGraph.prototype = Object.create(Essaim.prototype);
EssaimJSXGraph.prototype.constructor = EssaimJSXGraph;

//Définition des nouveaux attributs
EssaimJSXGraph.prototype.nomAffiche = "Essaim : Dessin JSXGraph";
EssaimJSXGraph.prototype.proto = "EssaimJSXGraph";

EssaimJSXGraph.prototype.imageEnonce = "images_essaims/graphe.gif";

EssaimJSXGraph.prototype.gereReponse = false;
Essaim.prototype.aUneAide = false;
EssaimJSXGraph.prototype.gereTailleImageEnonce = true;


//------------ METHODES -----------------//

EssaimJSXGraph.prototype.initEnonce = function () {
    var tab = document.getElementById('Rid_Enonce_Essaims_List');
    var li = document.createElement('li');
    li.id = "RidEnEs_" + this.nom;

    var bouton = document.createElement('button');
    bouton.id = "boutonEssaimEnonce" + this.nom;
    bouton.className = "Rcl_Surligne_Essaim";
    var txt = document.createTextNode(this.nom);
    bouton.appendChild(txt);

    bouton.onclick = function () {
        nomEssaim = li.id.slice("RidEnEs_".length, li.id.length);
        var ind = rucheSys.rechercheIndice(nomEssaim, rucheSys.listeBlocPrepa);
        var essaimFd = rucheSys.listeBlocPrepa[ind];
        if (essaimFd.gereReponse == true) {
            alert("Problème , cet essaim devrait pouvoir gérer plusieurs dessins. Contacter les développeurs");
        } else {
            rucheSys.enonce.ajoutImageEssaim(essaimFd);
        }
    }
    li.appendChild(bouton);
    tab.appendChild(li);
}

/* Création d'un bloc */
EssaimJSXGraph.prototype.creerBloc = function (dataRecup) {
    Essaim.prototype.initBloc.call(this);

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

    // **** Fabrication du contenu du bloc ****
    // *** Barre de tâches pour cet éditeur ***

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

    this.divBloc.appendChild(titreBloc);
    var $div_brd = $("<div></div>").attr({
        id: "box" + this.numero,
        class: "jxgbox"
    }).css({
        width: this.divBloc.clientWidth - 30,
        height: 400
    }).appendTo($(this.divBloc));

	
	/* -----------------------------------
	Création des blocs div pour les menus
	--------------------------------------
	*/
	
	/* On crée deux blocs correspondant aux deux menus : 
	 * - div_button_action :  bloc pour le menu des actions
	 * - div_button_objet : bloc pour le menu des objets
	 **/
	/*
	 * Pour chacun de ces menus, on crée un bloc div supplémentaire pour le retour à la ligne : 
	 * - le bloc div_button_retour_chariot_Action
	 * - le bloc div_button_retour_chariot_Objet
	 * 
	 **/
	 
	/* ----------------------
	  Menu pour les actions 
	-------------------------
	
	 * Actions possibles : 
	 * - grille (afficher/supprimer)
	 * - déplacer (déplacement libre)
	 * - save (sauvegarder des objets dans une boîte à dessins)
	 **/
	 
    var $div_button_action = $("<div></div>");
	var $zoneTexteAction = $("<p></p>").text("Actions").appendTo($div_button_action);
	var $div_button_retour_chariot_Action = $("<div></div>").appendTo($div_button_action);
	
	/* title permet d'afficher une infobulle au survol du bouton */
    var $button_switch_grille = $("<button title=\"Affiche/enlève la grille.\">Grille</button>").appendTo($div_button_retour_chariot_Action).click(
	{essaimJSXGraph : this}, function(event){
		event.data.essaimJSXGraph.grid = !event.data.essaimJSXGraph.grid;
		if (event.data.essaimJSXGraph.grid){
		event.data.essaimJSXGraph.brd.removeGrids();	
		}
		else {
		event.data.essaimJSXGraph.brd.create('grid', []);
		}
		event.data.essaimJSXGraph.brd.fullUpdate();
	});
	
	var $button_libre = $("<button title=\"Permet de déplacer des objets dans le graphe.\"> Deplacer </button>").appendTo($div_button_retour_chariot_Action).click(
	{essaimJSXGraph : this}, function(event){
		event.data.essaimJSXGraph.mode = GLOB_libre
	});
	
	var $menu_deroulant = $("<select></select>");
	
	var $save = $("<button title=\"Permet de sauvegarder des éléments du graphique dans une boite à dessin.\">Ajout dans boîte à dessin </button>").appendTo($div_button_retour_chariot_Action).click(
	{essaimJSXGraph : this, menu_D : $menu_deroulant}, function(event){
	    var tab = {};
		if(event.data.essaimJSXGraph.menu_enregistre){
			event.data.menu_D.appendTo($div_button_retour_chariot_Action);
			event.data.essaimJSXGraph.menu_enregistre = false;
		}
	    for (i in event.data.essaimJSXGraph.brd.objects){
			if (i.toLowerCase() !== "jxgBoard1_infobox".toLowerCase()){
				tab[i] = event.data.essaimJSXGraph.brd.objects[i];
			}
	    }
	    event.data.essaimJSXGraph.saveState.push(tab);
	    var clef = Object.keys(tab);
	    var nom_objet = clef[clef.length - 2];
	    event.data.menu_D.append("<option value"+ nom_objet +">" + nom_objet + "</option>");
	});
	
	$div_button_action.appendTo(this.divBloc);
	
	/* ----------------------
	  Menu pour les objets 
	-------------------------
	
	 * Objets disponibles :
	 * - point
	 * - ligne
	 * - cercle
	 * - segment
	 * - flèche
	 * - axe X (horizontal)
	 * - axe Y (vertical)
	 **/ 
	 
	var $div_button_objet = $("<div></div>");
	var $zoneTexteObjet = $("<p></p>").text("Objets").appendTo($div_button_objet);
	var $div_button_retour_chariot_Objet = $("<div></div>").appendTo($div_button_objet);
	
    var $button_point = $("<button title=\"Permet de créer un point.\">Point</button>").appendTo($div_button_retour_chariot_Objet).click(
        {essaimJSXGraph: this}, function (event) {
            event.data.essaimJSXGraph.mode = GLOB_point;
        });

    var $button_ligne = $("<button title=\"Permet de créer une ligne. On utilise deux points pour cela.\">Ligne</button>").appendTo($div_button_retour_chariot_Objet).click(
        {essaimJSXGraph: this}, function (event) {
            event.data.essaimJSXGraph.mode = GLOB_ligne;
        });

    var $button_cercle = $("<button title=\"Permet de créer un cercle. On utilise deux points pour cela.\">Cercle</button>").appendTo($div_button_retour_chariot_Objet).click(
        {essaimJSXGraph: this}, function (event) {
            event.data.essaimJSXGraph.mode = GLOB_cercle;
        });

    var $button_segment = $("<button title=\"Permet de créer un segment. On utilise deux points pour cela.\">Segment</button>").appendTo($div_button_retour_chariot_Objet).click(
        {essaimJSXGraph: this}, function (event) {
            event.data.essaimJSXGraph.mode = GLOB_segment;
        });

    var $button_arrow = $("<button title=\"Permet de créer un vecteur. On utilise deux points pour cela.\">Vecteur</button>").appendTo($div_button_retour_chariot_Objet).click(
		{essaimJSXGraph : this}, function(event){
			event.data.essaimJSXGraph.mode = GLOB_arrow;
		});

    var $button_axis = $("<button title=\"Permet de créer un axe. On utilise deux points pour cela.\">Axe</button>").appendTo($div_button_retour_chariot_Objet).click(
		{essaimJSXGraph : this}, function(event){
			event.data.essaimJSXGraph.mode = GLOB_axe;
		});
	
    /* Permet de créer un axe en donnant les coordonnées des points dans une zone de texte */
	
    /*var $form_valeur_axe = $("<form></form>").appendTo($div_button_retour_chariot_Objet);*/
    /*var $axe = $("<input type=\"text\" placeholder=\"(x1,y1);(x2,y2)\"></input>").appendTo($form_valeur_axe);*/
    /*var $button_axis = $("<button>Axe</button>").appendTo($div_button_retour_chariot_Objet).click(
	{essaimJSXGraph : this}, function(event){
	    event.data.essaimJSXGraph.axis = !event.data.essaimJSXGraph.axis;   
	    if (event.data.essaimJSXGraph.axis_x){
		event.data.essaimJSXGraph.brd.create('axis', [[0, 0], [1, 0]],
						     {ticks: {insertTicks: true,
							      ticksDistance: 1,
							      label: {offset: [-20, -20]}}});
		event.data.essaimJSXGraph.brd.fullUpdate();
	    }
	});    */
    
    $div_button_objet.appendTo(this.divBloc);

    EssaimJSXGraph.prototype.initEnonce.call(this);
    EssaimJSXGraph.prototype.initAnalyse.call(this);
	
    /* Création du graphe */
    this.brd = JXG.JSXGraph.initBoard('box' + this.numero,
				      {axis: this.axis,
				       keepaspectratio:true,
				       grid:false
				       });
    
				
    /*Gestion de la modification de la taille du bloc*/
    /*Pour le moment, la solution trouvée pour limiter le problème lors du resize, c'est 
     d'inclure un delai de 200 millisecondes*/
    var timer;
    $(window).resize({essaimJSXGraph: this}, function (event) {
        var graph = event.data.essaimJSXGraph;
        clearTimeout(timer);
        timer = setTimeout(
            function () {
                graph.brd.resizeContainer(graph.divBloc.clientWidth - 30,
					  graph.divBloc.clientWidth - 30);
            }, 200);
    });

    
    /*Creation de points, à retoucher/améliorer*/
    var essaimJSXGraph = this;
    this.brd.on('up', function(event){
		if (essaimJSXGraph.mode !== GLOB_libre){
			var point = undefined;
			var brd = essaimJSXGraph.brd;
			if (brd.drag_dx !== 0 || brd.drag_dy !== 0){
				essaimJSXGraph.point = [];
				}
				else{
					var getMouseCoords = function(event) {
						var cPos = brd.getCoordsTopLeftCorner(event,0),
							absPos = JXG.getPosition(event, 0),
							dx = absPos[0]-cPos[0],
							dy = absPos[1]-cPos[1];
						return new JXG.Coords(JXG.COORDS_BY_SCREEN, [dx, dy], brd);
					}
				
				var parent = undefined;
				var coords = getMouseCoords(event);
		
				for (element in brd.objects){
					if (JXG.isPoint(brd.objects[element])
					&& brd.objects[element].hasPoint(coords.scrCoords[1],coords.scrCoords[2])){
						point = element;
					}
				}
				if (point === undefined){
					point = brd.create("point", brd.getUsrCoordsOfMouse(event));
					if (parent !== undefined){
						point.ancestors[0] = 0;
					}
				}
				else if (!brd.objects[point].getAttribute("visible")){
					brd.objects[point].setAttribute({visible : true});
				}
				essaimJSXGraph.point.push(point);
			}
		
			/*Création de la forme souhaitée*/
			if (essaimJSXGraph.mode === GLOB_point){
				essaimJSXGraph.point = [];
			}
			else if (essaimJSXGraph.point.length === 2){
				brd.create(essaimJSXGraph.mode, essaimJSXGraph.point);
				essaimJSXGraph.point = [];
			}
		}
    });
}


EssaimJSXGraph.prototype.nouveauComposant = function (classeComposant) {
    rucheSys.ajoutComposantEssaim("editJSXGraph" + this.nom, classeComposant);
}

EssaimJSXGraph.prototype.detruitBloc = function () {
    freeBoard(this.brd);
    Essaim.prototype.detruitBloc.call(this);
}

/* Changer le nom de certaines variables */
EssaimJSXGraph.prototype.toOEF = function(){
    var bord_gauche = this.brd.getBoundingBox()[0];		// remplacer x1 par bord_gauche
    var bord_haut = this.brd.getBoundingBox()[1];		// remplacer y1 par bord_haut
    var bord_droit = this.brd.getBoundingBox()[2];		// remplacer x2 par bord_droit
    var bord_bas = this.brd.getBoundingBox()[3];		// remplacer y2 par bord_bas

    console.log(this.brd.getBoundingBox());

    var OEF = "\\text{rangex" + this.nom + " = " + bord_gauche + "," + bord_droit + "}\n"
    OEF += "\\text{rangey" + this.nom + " = " + bord_bas + "," + bord_haut + "}\n";
    OEF += "\\text{" + this.nom + " = rangex \\rangex" + this.nom + "\n";
    OEF += "rangey \\rangey" + this.nom + "\n";
    
    if (!this.grid){
		console.log(JXG.Options.axis.ticks.ticksDistance);
		
		for (var i = 0; i < this.brd.grids.length; i++){
			console.log(this.brd.grids[i]);
		}
    }

    
    for (element in this.brd.objects){
		var brdElement = this.brd.objects[element];
		
		/*On recupère la hauteur et la largeur de la zone de dessin, en terme de 
		coordonnées du dessin*/
		var largeur = bord_droit - bord_gauche;
		var hauteur = bord_haut - bord_bas;
		
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

					tmp = "segment " +
						p1.X() + "," + p1.Y()+ "," +
						p2.X() + "," + p2.Y() + ",black\n";
					OEF += tmp;
					break;
				case GLOB_arrow : 
					var p1 = brdElement.point1;
					var p2 = brdElement.point2;
					
					tmp = "arrow " +
						p1.X() + "," + p1.Y()+ "," +
						p2.X() + "," + p2.Y() + ",7,black\n";
					OEF += tmp;
					break;
					
					/*  En cours. Voir tableau 
				case GLOB_axe : 
				 p1.X() permet de récupérer la coordonnée X du point p1 
					
					
					var p1 = brdElement.point1;
					var p2 = brdElement.point2;
					
					var distance_largeur_gauche; 	// on récupère la distance avec le bord gauche
					var distance_largeur_droite; 	// on récupère la distance avec le bord droit
					var distance_hauteur_haut;		// on récupère la distance avec la hauteur haute
					var distance_hauteur_bas;		// on récupère la distance avec la hauteur basse
					
				 On cherche à savoir quel point est au dessus 
				if (p1.X() > p2.X()){
					distance_largeur_droite = Math.sqrt(largeur * largeur + p1.X() * p1.X());
					distance_largeur_gauche = Math.sqrt(largeur * largeur + p2.X() * p2.X());
				} 
				else{
					distance_largeur_gauche = Math.sqrt(largeur * largeur + p2.X() * p2.X());
					distance_largeur_droite = Math.sqrt(largeur * largeur + p1.X() * p1.X());
				}
				
				On cherche à savoir quel point est à droite 
				if (p1.Y() > p2.Y()){
					distance_hauteur_haut = Math.sqrt(hauteur * hauteur + p1.Y() * p1.Y());
					distance_hauteur_bas = Math.sqrt(hauteur * hauteur + p2.Y() * p2.Y());
				} 
				else {
					distance_hauteur_bas = Math.sqrt(hauteur * hauteur + p2.Y() * p2.Y());
					distance_hauteur_haut = Math.sqrt(hauteur * hauteur + p1.Y() * p1.Y());
				}
				
				a et b correspondent aux vecteurs de translation des deux points 
				while 
					var a = (p2.X() - p1.X());
					var b = (p2.Y() - p1.Y());
				
					break;*/
				default:
					break;
			}
		}	
    }
    OEF += "hline black,0,0\nvline black,0,0}\n"
    OEF += "\\text{url" + this.nom + " = draw(200,200\n\\" + this.nom + ")}"
    return OEF;
}

EssaimJSXGraph.prototype.toOEFFromStatement = function (idReponse) {
    return "<img src=\"\\url" + this.nom + "\" alt=\"Erreur avec l'image " + this.nom + "\"/>";

};

/**
 * insère une image dans un point
 * @param url" String, url de l'image
 * @param pointExiste: JSXGraph.element(point), le variable qui indique un point de JSXGraph
 * @returns JSXGraph.image
 */
EssaimJSXGraph.prototype.fillImageIntoPoint = function (url, pointExiste) {
    function getCoord2D(paint) {
        return getCoord(paint).slice(1)
    }
    function getSize(paint) {
        return paint.visProp.size
    }
    board.options.layer["image"] = 10;
    // make the priority of image higher than point
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
 * supprimer une image dans le board
 * @param image: JSXGraph.element(image), la variable qui indique une image de JSXGraph
 */
EssaimJSXGraph.prototype.removeImage = function (image) {
    this.brd.removeObject(image)
};

//TODO attention il y a un document ready ici, éviter de faire le conflit
$(document).ready(function () {
    rucheSys.initClasseEssaim(EssaimJSXGraph)
});

