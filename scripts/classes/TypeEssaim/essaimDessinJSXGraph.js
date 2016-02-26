/*
 * Classe Essaim de Dessins JSXGraph : 
 * Permet de crÃ©er un bloc d'instructions gÃ©nÃ©rant un dessins utilisant JSXGraphe
 */

/*
 * Problème : On ne peut pas crée plusieur graphe, faudrait trouver la raison de se problème
 * + le redimensionnement possede quelque problème, il n'est pas complétement fonctionnel
 * + parfois, lors de simple drag, on crée une forme que l'on voulais pas
 * + on a pas de suppression d'element (pas encore)
 * + on a pas la génération du code OEF correspondant
 */

/*Pseudo type énumérée qui permet d'avoir des nom explicite pour la variable mode*/
var point = 1;
var ligne = 2;
var cercle = 3;
var segment = 4;

EssaimJSXGraph = function(num){

    //Appelle le constructeur parent
    Essaim.call(this.num);

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

/*EssaimJSXGraph.prototype.imageEnonce= "NULL";*/

EssaimJSXGraph.prototype.gereReponse = false;
Essaim.prototype.aUneAide = false;
EssaimJSXGraph.prototype.gereTailleImageEnonce = false;

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
	if (essaimFd.gereReponde == true){
	    alert("Problï¿½me , cet essaim devrait pouvoir gï¿½rer plusieurs dessins. Contacter les dï¿½veloppeurs");
	}else{
	    var indice_tailleX =
		rucheSys.rechercheIndice("tailleX"+essaimFd.nom,rucheSys.listeEditeur);
	    var indice_tailleY =
		rucheSys.rechercheIndice("tailleY"+essaimFd.nom,rucheSys.listeEditeur);
	    rucheSys.listeEditeur[indice_tailleX].recupDonneesVar();
	    rucheSys.listeEditeur[indice_tailleY].recupDonneesVar();
	    
	    var oef_tailleX = Number(rucheSys.listeEditeur[indicie_tailleX].toOEF());
	    var oef_tailleY = Number(rucheSys.listeEditeur[indicie_tailleY].toOEF());
	    if (oef_tailleX<5 || oef_tailleY<5) {
                alert("Une image ne peut pas ï¿½tre en largeur\n ou hauteur plus petite que 5 pixels");
	    } else {
                essaimFd.tailleImageEnonceX = oef_tailleX;
                essaimFd.tailleImageEnonceY = oef_tailleY;
	    }
	    
	    /*rucheSys.enonce.ajoutImageEssaim(essaimFd);*/ /*Inclusion de l'image reportée à
	    						     *plus tard*/
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

    /** un facon jquery*/
    var $div_brd = $("<div></div>").attr({
        id: "box" + this.num,
        class: "jxgbox"
    }).css({
        width: this.divBloc.clientWidth - 30,
        height: 400
    }).appendTo($(this.divBloc));

    /*Ok, on garde la façon JQuery*/
    var $div_button = $("<div></div>");
    var $button_point = $("<button>Point</button>").appendTo($div_button).click(
	{objet : this}, function(e){
	    e.data.objet.mode = point;
	});

    var $button_ligne = $("<button>Ligne</button>").appendTo($div_button).click(
	{objet : this}, function(e){
	    e.data.objet.mode = ligne;
	});
    var $button_cercle = $("<button>Cercle</button>").appendTo($div_button).click(
	{objet : this}, function(e){
	    e.data.objet.mode = cercle;
	});
    var $button_segment = $("<button>Segment</button>").appendTo($div_button).click(
	{objet : this}, function(e){
	    e.data.objet.mode = segment;
	});

    $div_button.appendTo(this.divBloc);

    EssaimJSXGraph.prototype.initEnonce.call(this);
    EssaimJSXGraph.prototype.initAnalyse.call(this);

    
    /*Création du graphe*/
    this.brd = JXG.JSXGraph.initBoard('box' + this.num, {axis:true});
    var brd = this.brd;
    var db = this.divBloc;
    /*Gestion de la modification de la taille du bloc*/
    /*A modifier, ne marche pas pour les resize non "manuel"*/
    $(window).resize(function(){
	brd.resizeContainer(db.clientWidth - 30, 400, false, false);
    });
    
    /*Creation de points, à retoucher/améliorer*/
    $div_brd.click({objet : this}, function(e){
	var getMouseCoords = function(e, i) {
            var cPos = brd.getCoordsTopLeftCorner(e, i),
		absPos = JXG.getPosition(e, i),
		dx = absPos[0]-cPos[0],
		dy = absPos[1]-cPos[1];
            return new JXG.Coords(JXG.COORDS_BY_SCREEN, [dx, dy], brd);
	}
	var tmp = e.data.objet;
	var point_tmp = undefined;
	var coords = getMouseCoords(e, 0);
	for (el in brd.objects){
	    if (JXG.isPoint(brd.objects[el]) && brd.objects[el].hasPoint
		(coords.scrCoords[1],coords.scrCoords[2])){
		point_tmp = el;
	    }
	}
	if (point_tmp !== undefined){
	    tmp.point.push(point_tmp);
	    console.log(tmp.point);
	}else{
	    tmp.point.push(brd.create("point", brd.getUsrCoordsOfMouse(e)));
	}
	switch (tmp.mode){
	case point:
	    if (tmp.point.length === 1){
		tmp.point = [];
	    }
	    break;
	case ligne:
	    if (tmp.point.length === 2){
		brd.create("line", tmp.point);
		tmp.point = [];
	    }
	    break;
	case cercle:
	    if (tmp.point.length === 2){
		brd.create("circle", tmp.point);
		tmp.point = [];
	    }
	    break;
	case segment:
	    if (tmp.point.length === 2){
		brd.create("segment", tmp.point);
		tmp.point = [];
	    }
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
    return "";
}

EssaimJSXGraph.prototype.toOEFFromStatement = function(idReponse){
    /*Peut etre TODO*/
}

$(document).ready(function(){ rucheSys.initClasseEssaim(EssaimJSXGraph)});
