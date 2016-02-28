/*
 * Classe Essaim de Dessins JSXGraph : 
 * Permet de crÃ©er un bloc d'instructions gÃ©nÃ©rant un dessins utilisant JSXGraphe
 */

/*
 * Problème :
 * + le redimensionnement possede quelque problème, il n'est pas complétement fonctionnel
 * + parfois, lors de simple drag, on crée une forme que l'on voulais pas
 * + on a pas de suppression d'element (pas encore)
 * + on a pas la génération du code OEF correspondant
 * + améliorer bouton (graphique)
 * + on ne peut pas encore connecter les points au lignes/segment..
 */

/*Pseudo type énumérée qui permet d'avoir des nom explicite pour la variable mode*/
var point = "point";
var ligne = "line";
var cercle = "circle";
var segment = "segment";

EssaimJSXGraph = function(num){

    //Appelle le constructeur parent
    Essaim.call(this,num);

    //---------- ATTRIBUTS -------------//

    this.nom = "JSXGraph" + num;
    this.numero = num;
    this.proto = "EssaimJSXGraph";

    /* Probablement à mieux définir*/
    /* La variable mode permet de définir dans quel mode l'utilisateur se trouve,
     * si il souhaite dessiner (le choix de la forme), etc...
     */
   
    this.mode = ligne;
    this.point = [];
    this.brd;
}

//------------ Déclaration comme classe dérivée de Essaim -------------//

EssaimJSXGraph.prototype = Object.create(Essaim.prototype);
EssaimJSXGraph.prototype.constructor = EssaimJSXGraph;

//Définit les nouveaux attributs
EssaimJSXGraph.prototype.nomAffiche = "Essaim : Dessin JSXGraph";
EssaimJSXGraph.prototype.proto = "EssaimJSXGraph";

EssaimJSXGraph.prototype.imageEnonce= "image_essaims/graphe.gif";

EssaimJSXGraph.prototype.gereReponse = false;
Essaim.prototype.aUneAide = false;
EssaimJSXGraph.prototype.gereTailleImageEnonce = true;

//------------ METHODES -----------------//

EssaimJSXGraph.prototype.initEnonce = function(){
    var tab = document.getElementById('Rid_Enonce_Essaims_List');
    var li = document.createElement('li');
    li.id = "RidEnEs_"+this.nom;
    
    var bouton = document.createElement('button');
    bouton.id = "boutonEssaimEnonce"+this.nom;
    bouton.className = "Rcl_Surligne_Essaim";
    var txt = document.createTextNode(this.nom);
    bouton.appendChild(txt);
    
    bouton.onclick = function(){
	nomEssaim = li.id.slice("RidEnEs_".length,li.id.length);
	var ind = rucheSys.rechercheIndice(nomEssaim, rucheSys.listeBlocPrepa);
	var essaimFd = rucheSys.listeBlocPrepa[ind];
	if (essaimFd.gereReponse == true){
	    alert("Problème , cet essaim devrait pouvoir gérer plusieurs dessins. Contacter les développeurs");
	}else{
	    rucheSys.enonce.ajoutImageEssaim(essaimFd);
	}
    }
    li.appendChild(bouton);
    tab.appendChild(li);
}

EssaimJSXGraph.prototype.creerBloc = function(dataRecup){
    Essaim.prototype.initBloc.call(this);
    
    var titreBloc = document.createElement("DIV");
    var txt = document.createTextNode("Dessin JSXGraph");
    titreBloc.appendChild(txt);
    var span_txtNom = document.createElement("SPAN");

    span_txtNom.style.backgroundColor = "#f7debc";
    span_txtNom.style.margin = "0px 0px 0px 10px";
    span_txtNom.style.padding = "0px 5px 0px 5px";
    span_txtNom.style.borderRadius = "5px";
    var txtNom = document.createTextNode(" "+this.nom+"\n");
    span_txtNom.appendChild(txtNom);
    titreBloc.appendChild(span_txtNom);
    titreBloc.style.textAlign="center";

    // **** Fabrication du contenu du bloc ****
    // *** Barre de tâches pour cet éditeur ***

    var barre_tache_editJSXGraph = document.createElement("DIV");

    // Menu "composants" et bouton "composants"
    var bouton_composant_editJSXGraph = document.createElement("button");
    bouton_composant_editJSXGraph.id = "boutonComposantFD"+this.nom;
    bouton_composant_editJSXGraph.innerHTML = "Composants";
    bouton_composant_editJSXGraph.className = "Rcl_Editor_Button_Composant";
    bouton_composant_editJSXGraph.onclick = function(){
	var nom = "editJSXGraph"+this.id.slice("boutonComposantFD".length, this.id.length);
	var nomEssaim = this.id.slice("boutonComposantFD".length, this.id.length);
	var ind = rucheSys.rechercheIndice(nomEssaim,rucheSys.listeBlocPrepa);
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

    /*Ok, on garde la façon JQuery*/
    var $div_button = $("<div></div>");
    var $button_point = $("<button>Point</button>").appendTo($div_button).click(
	{essaimJSXGraph : this}, function(event){
	    event.data.essaimJSXGraph.mode = point;
	});

    var $button_ligne = $("<button>Ligne</button>").appendTo($div_button).click(
	{essaimJSXGraph : this}, function(event){
	    event.data.essaimJSXGraph.mode = ligne;
	});
    
    var $button_cercle = $("<button>Cercle</button>").appendTo($div_button).click(
	{essaimJSXGraph : this}, function(event){
	    event.data.essaimJSXGraph.mode = cercle;
	});
    
    var $button_segment = $("<button>Segment</button>").appendTo($div_button).click(
	{essaimJSXGraph : this}, function(event){
	    event.data.essaimJSXGraph.mode = segment;
	});

    $div_button.appendTo(this.divBloc);

    EssaimJSXGraph.prototype.initEnonce.call(this);
    EssaimJSXGraph.prototype.initAnalyse.call(this);

    /*Création du graphe*/
    this.brd = JXG.JSXGraph.initBoard('box' + this.numero, {axis:true});
   
    /*Gestion de la modification de la taille du bloc*/
    /*A modifier, ne marche pas pour les resize non "manuel"*/
    $(window).resize({essaimJSXGraph : this},function(event){
	var graph = event.data.essaimJSXGraph;
	graph.brd.resizeContainer(graph.divBloc.clientWidth - 30, 400);
    });
    
    /*Creation de points, à retoucher/améliorer*/
    $div_brd.click({essaimJSXGraph : this}, function(event){
	var essaimJSXGraph = event.data.essaimJSXGraph;
	var point = undefined;
	var brd = essaimJSXGraph.brd;
	var getMouseCoords = function(event) {
            var cPos = brd.getCoordsTopLeftCorner(event,0),
		absPos = JXG.getPosition(event, 0),
		dx = absPos[0]-cPos[0],
		dy = absPos[1]-cPos[1];
            return new JXG.Coords(JXG.COORDS_BY_SCREEN, [dx, dy], brd);
	}
	
	
	var coords = getMouseCoords(event);
	for (element in brd.objects){
	    if (JXG.isPoint(brd.objects[element]) &&
		brd.objects[element].hasPoint(coords.scrCoords[1],coords.scrCoords[2])){
		point = element;
	    }
	}
	if (point === undefined){
	    point = brd.create("point", brd.getUsrCoordsOfMouse(event));
	}
	essaimJSXGraph.point.push(point);

	/*Creation de la forme souhaiter*/
	if (essaimJSXGraph.mode === point){
	    essaimJSXGraph.point = [];
	}else if (essaimJSXGraph.point.length === 2){
	    brd.create(essaimJSXGraph.mode, essaimJSXGraph.point);
	    essaimJSXGraph.point = [];
	}
    });
}


EssaimJSXGraph.prototype.nouveauComposant = function(classeComposant){
    rucheSys.ajoutComposantEssaim("editJSXGraph"+this.nom, classeComposant);
}

EssaimJSXGraph.prototype.detruitBloc = function(){
    freeBoard(this.brd);
    Essaim.prototype.detruitBloc.call(this);
    /*Ajouter suppression du graphe*/
}

EssaimJSXGraph.prototype.toOEF = function(){
    /*TODO : générer le code OEF*/
    var OEF = "\\text{rangex" + this.nom + " = -5,5}\n\\text{rangey" + this.nom + " = -5,5}\n";
    OEF += "\\text{" + this.nom + " = rangex \\rangex" + this.nom + "\n";
    OEF += "rangey \\rangey" + this.nom + "\n";
    for (element in this.brd.objects){
	var brdElement = this.brd.objects[element];
	if (brdElement.getType() === point){
	    OEF +=  "point " + brdElement.X() + "," + brdElement.Y() + ",black\n";
	}else if (brdElement.getType() === ligne){
	    console.log(brdElement.point1);
	    OEF += "polyline black," + brdElement.point1.X() + "," + brdElement.point1.Y() + "," + brdElement.point2.X() + "," + brdElement.point2.Y() + "\n"; 
	}
    }
    OEF += "hline black,0,0\nvline black,0,0}\n"
    OEF += "\\text{url" + this.nom + " = draw(200,200\n\\" + this.nom + ")}"
    return OEF;
}

EssaimJSXGraph.prototype.toOEFFromStatement = function(idReponse){
    return "<img src=\"\\url" + this.nom + "\" alt=\"Erreur de lecture d'image\"/>";

}

$(document).ready(function(){ rucheSys.initClasseEssaim(EssaimJSXGraph)});
