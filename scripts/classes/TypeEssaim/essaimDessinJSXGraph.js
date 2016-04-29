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
      d'inclure un delai de 200 millisecondes, sinon la taille du graphe change trops vite par rapport à la fenetre*/
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
		var newElement = brd.create(essaimJSXGraph.mode, essaimJSXGraph.point);
		essaimJSXGraph.point = [];
		if (essaimJSXGraph.mode === GLOB_axe){
		    /*Sert à ne pas crée les grilles lorsque on crée un axe*/
		    newElement.removeAllTicks();
		    newElement.isDraggable = true;
		    newElement.on('drag',function(){essaimJSXGraph.brd.fullUpdate()});
		    for (var i in newElement.ancestors){
			newElement.ancestors[i].isDraggable = true;
			newElement.ancestors[i].on('drag',function(){essaimJSXGraph.brd.fullUpdate()});
		    }
		}
	    }
	}
    }
	       )};


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

    var OEF = "\\text{rangex" + this.nom + " = " + bord_gauche + "," + bord_droit + "}\n"
    OEF += "\\text{rangey" + this.nom + " = " + bord_bas + "," + bord_haut + "}\n";
    OEF += "\\text{" + this.nom + " = rangex \\rangex" + this.nom + "\n";
    OEF += "rangey \\rangey" + this.nom + "\n";
    
    if (!this.grid){
	var pas_x = JXG.Options.ticks.ticksDistance * this.brd.zoomX;
	var pas_y = JXG.Options.ticks.ticksDistance * this.brd.zoomY;
	var n_bas;
	var n_haut;
	var n_bas;
	var n_gauche;
	var n_droite;
	
	if (bord_gauche > 0){
	    var n = Math.round(bord_haut / pas_x);
	}else if (bord_droit < 0){
	    var n = -Math.round( bord_bas / pas_y);
	}else{
	    /*var n = Math.round() + Math.round();*/
	}
	
	if (bord_bas > 0){
	    var n = Math.round( bord_droit / pas);
	}else if (bord_haut < 0){
	    var n = -Math.round(bord_gauche / pas);
	}else{

	}
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
		var p1 = brdElement.point1;
		var p2 = brdElement.point2;
		
		var pointInter_1 = { x : p1.X(), y : p1.Y() };
		var pointInter_2 = { x : p2.X(), y : p2.Y() };
		var pointFinalFleche = { x : 0, y : 0 };
		var pointFinalDroite = { x : 0, y : 0 };
		
		// Cas où les deux points sont sur une ligne horizontale
		if (p1.Y() === p2.Y()){
		    // On compare les abscisses pour agrandir correctement le trait
		    if (p1.X() > p2.X){
			pointFinalDroite.x = bord_droit;
			pointFinalDroite.y = p1.Y();
			
			pointFinalFleche.x = bord_gauche;
			pointFinalFleche.y = p2.Y();
		    }
		    else {
			pointFinalDroite.x = bord_gauche;
			pointFinalDroite.y = p1.Y();
			
			pointFinalFleche.x = bord_droit;
			pointFinalFleche.y = p2.Y();
		    }
		}
		else {
		    var coef_dir = ( p1.X() - p2.X() ) /( p1.Y() - p2.Y() );

		    // Si l'axe est orienté vers le bas
		    if ( p2.Y() < p1.Y() ){
			// On cherche les deux intersections possibles avec le bord du graphe...
			if (coef_dir > 0){
			    pointInter_1.x = ( -(bord_bas) / coef_dir );
			    pointInter_1.y = -( bord_bas );
			    
			    pointInter_2.x = -( bord_gauche );
			    pointInter_2.y = ( -(bord_gauche) / coef_dir );
			    
			    //... on garde seulement celle avec le x le plus grand
			    if (pointInter_1.x > pointInter_2.x ){
				pointFinalFleche.x = pointInter_1.x;
				pointFinalFleche.y = pointInter_1.y;
				
				pointFinalDroite.x = p1.X();
				pointFinalDroite.y = p1.Y();
			    }
			    else {
				pointFinalFleche.x = pointInter_2.x;
				pointFinalFleche.y = pointInter_2.y;
				
				pointFinalDroite.x = p1.X();
				pointFinalDroite.y = p1.Y();
			    }
			}
			else {
			    pointInter_1.x = ( (bord_haut) / coef_dir );
			    pointInter_1.y = bord_haut;
			    
			    pointInter_2.x = bord_droit;
			    pointInter_2.y = ( bord_droit / coef_dir ); 
			    
			    //... on garde seulement celle avec le x le plus petit
			    if (pointInter_1.x < pointInter_2.x ){
				pointFinalFleche.x = pointInter_1.x;
				pointFinalFleche.y = pointInter_1.y;
				
				pointFinalDroite.x = p1.X();
				pointFinalDroite.y = p1.Y();
			    }
			    else {
				pointFinalFleche.x = pointInter_2.x;
				pointFinalFleche.y = pointInter_2.y;
				
				pointFinalDroite.x = p1.X();
				pointFinalDroite.y = p1.Y();
			    }
			}
		    }
		    
		    // Si l'axe est orienté vers le haut
		    else if ( p2.Y() > p1.Y() ){ 
			// On cherche les deux intersections possibles avec le bord du graphe...
			if (coef_dir > 0){
			    pointInter_1.x = ( bord_haut / coef_dir );
			    pointInter_1.y = bord_haut;
			    
			    pointInter_2.x = bord_droit;
			    pointInter_2.y = ( bord_droit / coef_dir );
			    
			    //... on garde seulement celle avec le x le plus grand
			    if (pointInter_1.x > pointInter_2.x ){
				pointFinalFleche.x = pointInter_1.x;
				pointFinalFleche.y = pointInter_1.y;
				
				pointFinalDroite.x = p1.X();
				pointFinalDroite.y = p1.Y();
			    }
			    else {
				pointFinalFleche.x = pointInter_2.x;
				pointFinalFleche.y = pointInter_2.y;
				
				pointFinalDroite.x = p1.X();
				pointFinalDroite.y = p1.Y();
			    }
			}
			else {
			    pointInter_1.x = ( bord_haut / coef_dir );
			    pointInter_1.y = bord_haut;
			    
			    pointInter_2.x = -( bord_gauche );
			    pointInter_2.y = ( -(bord_gauche) / coef_dir ); 
			    
			    //... on garde seulement celle avec le x le plus petit
			    if (pointInter_1.x < pointInter_2.x ){
				pointFinalFleche.x = pointInter_1.x;
				pointFinalFleche.y = pointInter_1.y;
				
				pointFinalDroite.x = p1.X();
				pointFinalDroite.y = p1.Y();
			    }
			    else {
				pointFinalFleche.x = pointInter_2.x;
				pointFinalFleche.y = pointInter_2.y;
				
				pointFinalDroite.x = p1.X();
				pointFinalDroite.y = p1.Y()	;
			    }
			}
		    }
		    // Si les deux points sont identiques
		    else {
			console.log("Les deux points sont identique, or il en faut deux différents pour un axe.");
		    }
		}
		OEF += "arrow " +
		    pointFinalDroite.x + "," + pointFinalDroite.y + "," +
		    pointFinalFleche.x + "," + pointFinalFleche.y + ",7,black\n";
		break;
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

