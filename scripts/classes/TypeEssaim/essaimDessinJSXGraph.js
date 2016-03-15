/*
 * Classe Essaim de Dessins JSXGraph : 
 * Permet de crÃ©er un bloc d'instructions gÃ©nÃ©rant un dessins utilisant JSXGraphe
 */

/*
 * Problï¿½me :
 * + on a pas de suppression d'element (pas encore)
 * + amï¿½liorer bouton (graphique)
 * + on ne peut pas encore connecter les points au lignes/segment.
 * + Le loading ne marche pas sur le graphe
 */

/*Pseudo type ï¿½numï¿½rï¿½e qui permet d'avoir des nom explicite pour la variable mode*/
var GLOB_libre = "libre";
var GLOB_point = "point";
var GLOB_ligne = "line";
var GLOB_cercle = "circle";
var GLOB_segment = "segment";

EssaimJSXGraph = function (num) {

    //Appelle le constructeur parent
    Essaim.call(this, num);

    //---------- ATTRIBUTS -------------//

    this.nom = "JSXGraph" + num;
    this.numero = num;
    this.proto = "EssaimJSXGraph";

    /* Probablement ï¿½ mieux dï¿½finir*/
    /* La variable mode permet de dï¿½finir dans quel mode l'utilisateur se trouve,
     * si il souhaite dessiner (le choix de la forme), etc...
     */

    this.mode = GLOB_point;
    this.point = [];
    this.brd;
}

//------------ Dï¿½claration comme classe dï¿½rivï¿½e de Essaim -------------//

EssaimJSXGraph.prototype = Object.create(Essaim.prototype);
EssaimJSXGraph.prototype.constructor = EssaimJSXGraph;

//Dï¿½finit les nouveaux attributs
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
            alert("Problï¿½me , cet essaim devrait pouvoir gï¿½rer plusieurs dessins. Contacter les dï¿½veloppeurs");
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
    // *** Barre de tï¿½ches pour cet ï¿½diteur ***

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

    /*Ok, on garde la faï¿½on JQuery*/
    var $div_button = $("<div></div>");
    var $button_libre = $("<button> Deplacer </button>").appendTo($div_button).click(
	{essaimJSXGraph : this}, function(event){
	    event.data.essaimJSXGraph.mode = GLOB_libre
	});
    var $button_point = $("<button>Point</button>").appendTo($div_button).click(
        {essaimJSXGraph: this}, function (event) {
            event.data.essaimJSXGraph.mode = GLOB_point;
        });

    var $button_ligne = $("<button>Ligne</button>").appendTo($div_button).click(
        {essaimJSXGraph: this}, function (event) {
            event.data.essaimJSXGraph.mode = GLOB_ligne;
        });

    var $button_cercle = $("<button>Cercle</button>").appendTo($div_button).click(
        {essaimJSXGraph: this}, function (event) {
            event.data.essaimJSXGraph.mode = GLOB_cercle;
        });

    var $button_segment = $("<button>Segment</button>").appendTo($div_button).click(
        {essaimJSXGraph: this}, function (event) {
            event.data.essaimJSXGraph.mode = GLOB_segment;
        });

    $div_button.appendTo(this.divBloc);

    EssaimJSXGraph.prototype.initEnonce.call(this);
    EssaimJSXGraph.prototype.initAnalyse.call(this);

    /*Crï¿½ation du graphe*/
    this.brd = JXG.JSXGraph.initBoard('box' + this.numero, {axis: false, keepaspectratio: true});

    /*Gestion de la modification de la taille du bloc*/
    /*Pour le moment, la solution trouver pour limiter le problï¿½me lors du resize, c'est 
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
    /*Creation de points, à retoucher/améliorer*/
    var essaimJSXGraph = this;
    this.brd.on('up', function(event){
	console.log(this.grids);
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
    console.log(this.brd.grids);
    this.brd.removeGrids();
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
    var OEF = "\\text{rangex" + this.nom + " = " + x1 + "," + x2 + "}\n"
    OEF += "\\text{rangey" + this.nom + " = " + y2 + "," + y1 + "}\n";
    OEF += "\\text{" + this.nom + " = rangex \\rangex" + this.nom + "\n";
    OEF += "rangey \\rangey" + this.nom + "\n";
    for (element in this.brd.objects){
	var brdElement = this.brd.objects[element];
	if (brdElement.getAttribute("visible")){
	    switch (brdElement.getType()){
	    case GLOB_point :
		OEF +=  "point " + brdElement.X() + "," + brdElement.Y() + ",black\n";
		break;
	    case GLOB_ligne :
		OEF += "line " + brdElement.point1.X() + "," + brdElement.point1.Y() + "," +
		    brdElement.point2.X() + "," + brdElement.point2.Y() + ",black\n";
		break;
	    case GLOB_cercle :
		OEF += "circle " + brdElement.center.X() + "," + brdElement.center.Y() +
		    "," + (brdElement.Radius() * this.brd.unitX) + ",black\n";
		break;
	    case GLOB_segment :
		OEF += "segment " + brdElement.point1.X() + "," + brdElement.point1.Y() + "," +
		    brdElement.point2.X() + "," + brdElement.point2.Y() + ",black\n"
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
 * @param image: JSXGraph.element(image), le veriable qui indique un image de JSXGraph
 */
EssaimJSXGraph.prototype.removeImage = function (image) {
    this.brd.removeObject(image)
};

//TODO attendtion il y a un document ready ici, eviter de faire le confilict
$(document).ready(function () {
    rucheSys.initClasseEssaim(EssaimJSXGraph)
});

