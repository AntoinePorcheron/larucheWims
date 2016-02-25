/*
 * Classe Essaim de Dessins JSXGraph : 
 * Permet de crÃ©er un bloc d'instructions gÃ©nÃ©rant un dessins utilisant JSXGraphe
 */

EssaimJSXGraph = function(num){

    //Appelle le constructeur parent
    Essaim.call(this.num);

    //---------- ATTRIBUTS -------------//

    this.nom = "JSXGraph" + num;
    this.numero = num;
    this.proto = "EssaimJSXGraph";

    /*this.tailleImageEnonceX = 200;
      this.tailleImageEnonceY = 200;*/
}

//------------ Dï¿½claration comme classe dï¿½rivï¿½e de Essaim -------------//

EssaimJSXGraph.prototype = Object.create(Essaim.prototype);
EssaimJSXGraph.prototype.constructor = EssaimJSXGraph;

//Dï¿½finit les nouveaux attributs
EssaimJSXGraph.prototype.nomAffiche = "Essaim : Dessin JSXGraph";
EssaimJSXGraph.prototype.proto = "EssaimJSXGraph";

/*EssaimJSXGraph.prototype.imageEnonce= "NULL";*/

EssaimJSXGraph.prototype.gereReponde = false;
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
	    
	    /*rucheSys.enonce.ajoutImageEssaim(essaimFd);*/ /*Inclusion de l'image reportï¿½e ï¿½ 
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
    // *** Barre de tï¿½ches pour cet ï¿½diteur ***

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
    var div_brd = document.createElement("DIV");
    div_brd.setAttribute("style", "width:" + this.divBloc.clientWidth - 30 + "px;height:400px;");
    /*-30 pour obtenir un ensemble harmonieux*/
    
    /*div_brd.setAttribute("id", "box");
    div_brd.setAttribute("class", "jxgbox");
    this.divBloc.appendChild(div_brd);*/
    /** un facon jquery*/
    var $div_brd = $("<div></div>")
        .attr({
            id: "box",
            class: "jxgbox"
        })
        .css({
            width: 300,
            height: 400
        })
        .appendTo($(this.divBloc));
    /**/
    /*Ok, on gardera probablement la façon JQuery*/
    var brd = JXG.JSXGraph.initBoard('box', {axis:true});
    
    EssaimJSXGraph.prototype.initEnonce.call(this);
    EssaimJSXGraph.prototype.initAnalyse.call(this);

    /*Gestion de la modification de la taille du bloc*/
    window.onresize = function(){
	/*A modifier, ne marche pas pour les resize non "manuel"*/
	brd.resizeContainer(db.clientWidth - 30, 400, false, false);
    }

    /*Creation de points, à retoucher/améliorer*/
    /*Gere la grille magnétique*/
    div_brd.onmousedown = function(e){
	/*La partie en commentaire sera utile lors de la gestion de la grille magnetique*/	
	/*if (grilleMagnetique){
	    var pos = [Math.round(brd.getUsrCoordsOfMouse(e)[0]), Math.round(brd.getUsrCoordsOfMouse(e)[1])];
	}else{*/
	    var pos = brd.getUsrCoordsOfMouse(e);
    /*}*/
	brd.create("point", pos);
    }
}


EssaimJSXGraph.prototype.nouveauComposant = function(classeComposant){
    rucheSys.ajoutComposantEssaim("editJSXGraph"+this.nom, classeComposant);
}

EssaimJSXGraph.prototype.detruitBloc = function(){
    Essaim.prototype.detruitBloc.call(this);
    /*Ajouter suppression du graphe*/
}

EssaimJSXGraph.prototype.toOEF = function(){
    /*TODO : gï¿½nï¿½rer le code OEF*/
    return "";
}

EssaimJSXGraph.prototype.toOEFFromStatement = function(idReponse){
    /*Peut etre TODO*/
}

$(document).ready(function(){ rucheSys.initClasseEssaim(EssaimJSXGraph)});
