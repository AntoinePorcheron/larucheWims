/*
 * Classe Essaim de Dessins JSXGraph : 
 * Permet de créer un bloc d'instructions générant un dessins utilisant JSXGraphe
 */

/*
 * Probl�me :
 * + on a pas de suppression d'element (pas encore)
 * + am�liorer bouton (graphique)
 * + on ne peut pas encore connecter les points au lignes/segment.
 * + Le loading ne marche pas sur le graphe
 */

/*Pseudo type �num�r�e qui permet d'avoir des nom explicite pour la variable mode*/
var GLOB_libre = "libre";
var GLOB_point = "point";
var GLOB_ligne = "line";
var GLOB_cercle = "circle";
var GLOB_arrow = "arrow";
var GLOB_segment = "segment";

EssaimJSXGraph = function (num) {

    //Appelle le constructeur parent
    Essaim.call(this, num);

    //---------- ATTRIBUTS -------------//

    this.nom = "JSXGraph" + num;
    this.numero = num;
    this.proto = "EssaimJSXGraph";

    /* La variable mode permet de d�finir dans quel mode l'utilisateur se trouve,
     * si il souhaite dessiner (le choix de la forme), etc...
     */

    this.mode = GLOB_point;			// permet de définir dans quel mode l'utilisateur se trouve
    this.point = [];				// 
    this.brd;						// variable 
    this.grid = true;				// variable permettant la création de la grille
    this.axis_x = false;			// variable permettant la création d'un axe X
    this.axis_y = false;			// variable permettant la création d'un axe Y
    this.saveState = [];			// variable permettant de sauvegarder l'état actuel du dessin
	this.menu_enregistre = true;	// variable permettant de créer un menu pour enregistrer les objets
}

//------------ D�claration comme classe d�riv�e de Essaim -------------//

EssaimJSXGraph.prototype = Object.create(Essaim.prototype);
EssaimJSXGraph.prototype.constructor = EssaimJSXGraph;

//D�finit les nouveaux attributs
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
            alert("Probl�me , cet essaim devrait pouvoir g�rer plusieurs dessins. Contacter les d�veloppeurs");
        } else {
            rucheSys.enonce.ajoutImageEssaim(essaimFd);
        }
    }
    li.appendChild(bouton);
    tab.appendChild(li);
}

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
    // *** Barre de t�ches pour cet �diteur ***

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
	 
	/* Menu pour les actions 
	 * - grille (afficher/supprimer)
	 * - déplacer (déplacement libre)
	 * - save (sauvegarder des objets dans une boîte à dessins)
	 **/
	 
    var $div_button_action = $("<div></div>");
	var $zoneTexteAction = $("<p></p>").text("Actions").appendTo($div_button_action);
	var $div_button_retour_chariot_Action = $("<div></div>").appendTo($div_button_action);
	
    var $button_switch_grille = $("<button>Grille</button>").appendTo($div_button_retour_chariot_Action).click(
	{essaimJSXGraph : this}, function(event){
	    event.data.essaimJSXGraph.grid = !event.data.essaimJSXGraph.grid;
	    if (event.data.essaimJSXGraph.grid){
		event.data.essaimJSXGraph.brd.removeGrids();	
	    }else{
		event.data.essaimJSXGraph.brd.create('grid', []);
	    }
	    event.data.essaimJSXGraph.brd.fullUpdate();
	});
	
	var $button_libre = $("<button> Deplacer </button>").appendTo($div_button_retour_chariot_Action).click(
	{essaimJSXGraph : this}, function(event){
	    event.data.essaimJSXGraph.mode = GLOB_libre
	});
	
	var $menu_deroulant = $("<select></select>");
	
	var $save = $("<button>Ajout dans boîte à dessins</button>").appendTo($div_button_retour_chariot_Action).click(
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
	
	/* Menu pour les objets 
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
	
    var $button_point = $("<button>Point</button>").appendTo($div_button_retour_chariot_Objet).click(
        {essaimJSXGraph: this}, function (event) {
            event.data.essaimJSXGraph.mode = GLOB_point;
        });

    var $button_ligne = $("<button>Ligne</button>").appendTo($div_button_retour_chariot_Objet).click(
        {essaimJSXGraph: this}, function (event) {
            event.data.essaimJSXGraph.mode = GLOB_ligne;
        });

    var $button_cercle = $("<button>Cercle</button>").appendTo($div_button_retour_chariot_Objet).click(
        {essaimJSXGraph: this}, function (event) {
            event.data.essaimJSXGraph.mode = GLOB_cercle;
        });

    var $button_segment = $("<button>Segment</button>").appendTo($div_button_retour_chariot_Objet).click(
        {essaimJSXGraph: this}, function (event) {
            event.data.essaimJSXGraph.mode = GLOB_segment;
        });

    var $button_arrow = $("<button>Vecteur</button>").appendTo($div_button_retour_chariot_Objet).click(
	{essaimJSXGraph : this}, function(event){
	    event.data.essaimJSXGraph.mode = GLOB_arrow;
	});

    var $button_axis_x = $("<button>Axe X</button>").appendTo($div_button_retour_chariot_Objet).click(
	{essaimJSXGraph : this}, function(event){
	    event.data.essaimJSXGraph.axis_x = !event.data.essaimJSXGraph.axis_x;   
	    if (event.data.essaimJSXGraph.axis_x){
		event.data.essaimJSXGraph.brd.create('axis', [[0, 0], [1, 0]],
						     {ticks: {insertTicks: true,
							      ticksDistance: 1,
							      label: {offset: [-20, -20]}}});
		event.data.essaimJSXGraph.brd.fullUpdate();
	    }
	});

    var $button_axis_y = $("<button>Axe Y</button>").appendTo($div_button_retour_chariot_Objet).click(
	{essaimJSXGraph : this}, function(event){
	    event.data.essaimJSXGraph.axis_y = !event.data.essaimJSXGraph.axis_y;
	    if (event.data.essaimJSXGraph.axis_y){
		event.data.essaimJSXGraph.brd.create('axis', [[0, 0], [0, 1]],
						     {ticks: {insertTicks: false,
							      ticksDistance: 1,
							      label: {offset: [-20, -20]}},
						      /*grid:false*/
						     });
		event.data.essaimJSXGraph.brd.fullUpdate();
	    }
	});
    
    
    $div_button_objet.appendTo(this.divBloc);
    

    EssaimJSXGraph.prototype.initEnonce.call(this);
    EssaimJSXGraph.prototype.initAnalyse.call(this);

    /*Cr�ation du graphe*/
    this.brd = JXG.JSXGraph.initBoard('box' + this.numero,
				      {axis: this.axis,
				       keepaspectratio:true,
				       grid:false
				       }); /*TEST*/
    
    /*var board = JXG.JSXGraph.initBoard('box'+this.numero, { 
	boundingbox:[-3,13.5, 5.5,-10],
	axis:false,
	showCopyright:false,
	zoom: {
	    factorX:1.25,
	    factorY:1.25,
	    wheel:true,
	    needshift:true,
	    eps: 0.1
	}
    }
				      );
    xaxis = board.create('axis', [[0, 0], [1,0]], 
			 {name:'x', 
			  withLabel: true, 
			  label: {position: 'rt',  // possible values are 'lft', 'rt', 'top', 'bot'
				  offset: [-15, 20]   // (in pixels)
				 }
			 });
    yaxis = board.create('axis', [[0, 0], [0, 1]], 
			 {name:'y', 
			  withLabel: true, 
			  label: {
			      position: 'rt',  // possible values are 'lft', 'rt', 'top', 'bot'
			      offset: [-20, 0]   // (in pixels)
			  }
			 });					
    /*Gestion de la modification de la taille du bloc*/
    /*Pour le moment, la solution trouver pour limiter le probl�me lors du resize, c'est 
     d'inclure un delai de 200milliseconde*/
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

    
    /*Creation de points, � retoucher/am�liorer*/
    var essaimJSXGraph = this;
    this.brd.on('up', function(event){
	if (essaimJSXGraph.mode !== GLOB_libre){
	    var point = undefined;
	    var brd = essaimJSXGraph.brd;
	    if (brd.drag_dx !== 0 || brd.drag_dy !== 0){
		essaimJSXGraph.point = [];
	    }else{
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
		}else if (!brd.objects[point].getAttribute("visible")){
		    brd.objects[point].setAttribute({visible : true});
		}
		essaimJSXGraph.point.push(point);
	    }
	    /*Creation de la forme souhaiter*/
	    if (essaimJSXGraph.mode === GLOB_point){
		essaimJSXGraph.point = [];
	    }else if (essaimJSXGraph.point.length === 2){
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

EssaimJSXGraph.prototype.toOEF = function(){
    var x1 = this.brd.getBoundingBox()[0];
    var y1 = this.brd.getBoundingBox()[1];
    var x2 = this.brd.getBoundingBox()[2];
    var y2 = this.brd.getBoundingBox()[3];

    console.log(this.brd.getBoundingBox());

    var OEF = "\\text{rangex" + this.nom + " = " + x1 + "," + x2 + "}\n"
    OEF += "\\text{rangey" + this.nom + " = " + y2 + "," + y1 + "}\n";
    OEF += "\\text{" + this.nom + " = rangex \\rangex" + this.nom + "\n";
    OEF += "rangey \\rangey" + this.nom + "\n";
    
    if (this.grid){
	console.log(this.brd);
    }

    
    for (element in this.brd.objects){
	var brdElement = this.brd.objects[element];
	if (brdElement.getAttribute("visible")){
	    switch (brdElement.getType()){
	    case GLOB_point :
		OEF +=  "point " + brdElement.X() + "," + brdElement.Y() + ",black\n";
		break;
	    case GLOB_ligne :
		var p1 = brdElement.point1;
		var p2 = brdElement.point2;

		var hauteur = x2 - x1;
		var largeur = y1 - y2;
		/*On recup�re la hauteur et la largeur de la zone de dessin, en terme de 
		  coordonn�e du dessin*/
		
		var coef = Math.sqrt(largeur * largeur + hauteur * hauteur);
		/*Taille de la diagonal de la zone de dessin*/
		
		var a = (p2.X() - p1.X()) * coef;
		var b = (p2.Y() - p1.Y()) * coef;
		/*a et b correspondent au vecteur de translation des deux point qui correspondent �
		  la ligne, car un OEF la primitive ligne ne fait qu'un segment, on translate donc 
		  les point en dehors de la zone de dessin, pour donner l'illusion d'une droite*/
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
		console.log(tmp);
		OEF += tmp;
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
 * insere un image dans un point
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
    //TODO to have a exact ratio
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
 * supprimer un image dans le board
 * @param image: JSXGraph.element(image), la variable qui indique une image de JSXGraph
 */
EssaimJSXGraph.prototype.removeImage = function (image) {
    this.brd.removeObject(image)
};

//TODO attendtion il y a un document ready ici, eviter de faire le confilict
$(document).ready(function () {
    rucheSys.initClasseEssaim(EssaimJSXGraph)
});

