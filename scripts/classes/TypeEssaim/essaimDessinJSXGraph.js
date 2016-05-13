/*TODO : 
 * - Faire les autre TODO
 * - Lien avec les variables
 * - Essayer un scénario
 * - Retirer un max d'attribut de la classe (tout les divs quasiment)
 * - trouver d'autre TODO
 * - Refactor certaine fonction
 * - Corriger bug point lors de drag d'objet
 * - Generer code OEF correspondant (variable lié)
 * - Corriger sauvegarde du site en JSON
 */

/*
 * Classe Essaim de Dessin JSXGraph :
 * Permet de créer un bloc d'instructions générant un dessin utilisant JSXGraphe
 */
/*Pseudo type énuméré qui permet d'avoir des noms explicites pour la variable mode*/
var GLOB = 
    {
	libre:"libre",
	point:"point",
	ligne:"line",
	cercle:"circle",
	fleche:"arrow",
	segment:"segment",
	axe:"axis",
	angle:"angle"
    };

/*Variable qui contient les différente sauvegarde des différent graphe*/
var saveState = {};

//Variables qui définissent la largeur du panneau latéral et la hauteur du panneau d'entête.
var GLOB_largeur = 110;
var GLOB_hauteur = 30;

EssaimJSXGraph = function(num) {

    //Appelle le constructeur parent
    Essaim.call(this, num);

    //---------- ATTRIBUTS -------------//
    this.nom = "JSXGraph" + num; // nom de l'élément
    this.numero = num; // numéro de l'essaim
    this.proto = "EssaimJSXGraph"; // nature de la classe

    // permet de définir dans quel mode l'utilisateur se trouve 
    //(mode point, mode ligne...)
    this.mode = GLOB.libre;

    // contient un ensemble de point (une ligne = 2 points par exemple). 
    //Permet de créer un objet
    this.point = [];
    
    // variable d'environnement : contient le graphe
    this.brd;
    
    // variable permettant la création de la grille
<<<<<<< HEAD
    this.grid = true;

    // variable permettant de créer un menu pour enregistrer les objets
    this.menu_enregistre = true;
    this.ms = false;

    /* Règle compatibilité sous firefox*/
=======
    this.grid = false;
    
    /*Bidouille pour regler compatibilité sous firefox*/
>>>>>>> origin/dev
    this.lastEvent;
    
    /*Contient un element qui permet d'afficher la prévisualisation pour certain dessin*/
    this.previsualisedObject;

    /*Page de "couverture" pour simplifier le dessin dans un graphe*/
    this.surpage;
    
    this.inputZone;
    this.deroulant;
    this.inputBoxMenu = $("<div></div>");
<<<<<<< HEAD
	
	this.hauteur_graphe = 200;
	this.largeur_graphe  = 200;
}
=======
};

>>>>>>> origin/dev
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
EssaimJSXGraph.prototype.$menuContextuel = $("<div></div>")
    .attr("class", "menu_contextuel")
    .hide();
EssaimJSXGraph.prototype.stackMultiSelect = [];
EssaimJSXGraph.prototype.$multiSelect = $("<div></div>").html("Multi-Select");
EssaimJSXGraph.prototype.$selection = $("<div></div>");
EssaimJSXGraph.prototype.$multiSelectMenu = $("<div></div>");

//------------ METHODES -----------------//
EssaimJSXGraph.prototype.initEnonce = function()
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
    bouton.onclick = function() {
        // On supprime le "RidEnEs_" devant le nom de la variable
        nomEssaim = li.id.slice("RidEnEs_".length, li.id.length);
        var ind = rucheSys.rechercheIndice(nomEssaim, rucheSys.listeBlocPrepa);
        var essaimFd = rucheSys.listeBlocPrepa[ind];
        // Si gère réponse, ne peut pas créer deux images "essaim" à la fois
        if (essaimFd.gereReponse) {
            alert(
                "Problème , cet essaim devrait pouvoir gérer plusieurs dessins. Contacter les développeurs"
            );
        } else {
            rucheSys.enonce.ajoutImageEssaim(essaimFd);
        }
    };
    li.appendChild(bouton);
    tab.appendChild(li);
};

EssaimJSXGraph.prototype.creerBloc = function(dataRecup)
/* Création d'un bloc  JSXGraph dans l'onglet préparation
 * parametre : - dataRecup : contient l'élément éventuel sauvegardé
<<<<<<< HEAD
 **/ {
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

     var self = this;

     AllJSXGraph.push(this);

     /*Création du panneau d'affichage*/
     /*On fait en sorte de ne pas avoir le clic droit sur cette zone, pour avoir le menu contextuel personnalisé*/
     var $bloc_contenu = $("<div></div>")
	 .on("contextmenu", 
	     function(event){
		 event.preventDefault(); return false
	     });
     
     this.surpage = new BlocFocus($bloc_contenu, this.divBloc);
	 
	 //Permet de changer la taille du graphe OEF généré
	$("<div></div>")
	.attr({'id':'edjg_resize_bloc_' + this.numero})
	.appendTo(self.divBloc).hide();
	 
	var $champHauteur = $("<input class='edjg_resize' />")
		.attr({'type':'text','placeholder':'Hauteur', 'value':self.hauteur_graphe, 'id':'champ_hauteur_' + this.numero})
		.appendTo($("#edjg_resize_bloc_" + this.numero));
	var $champLargeur = $("<input class='edjg_resize'/>")
		.attr({'type':'text','placeholder':'Largeur', 'value':self.largeur_graphe, 'id':'champ_largeur_' + this.numero})
		.appendTo($("#edjg_resize_bloc_" + this.numero));
	var $button_validate = $("<input class='edjg_resize' />")
		.attr({'type':'button', 'value':'Valider', 'title':'Valide la sélection'})
			.click(function(){
				self.hauteur_graphe = $("#champ_hauteur_" + self.numero).val();
				self.largeur_graphe = $("#champ_largeur_" + self.numero).val();
				$("#edjg_resize_bloc_" + self.numero).hide();
				$("#edjg_bouton_resize_" + self.numero).show();
		}).appendTo($("#edjg_resize_bloc_" + this.numero))
	
	var $button_resize = $("<input />")
	.attr({'type':'button','value':'Changer taille','id':'edjg_bouton_resize_' + this.numero, 'title':'Permet de changer la taille du graphe généré en OEF.'})
	.click(function(){	
		$("#edjg_resize_bloc_" + self.numero).show();
		$("#edjg_bouton_resize_" + self.numero).hide();
	})
	.appendTo(self.divBloc);
	
     // **** Fabrication du contenu du bloc ****

     /* Le panneau d'affichage du graphe est composé de trois blocs
      * - un bloc lateral qui contient les actions disponibles sur le graphe
      * - un bloc au sommet qui contient les formes que l'on peut créer sur le graphe
      * - un bloc plus central qui contient le graphe en lui même
      */
     var $left_panel = $("<div class=\"leftMenu\"></div>")
         .css({
             "position": "absolute",
             "width": GLOB_largeur,
             "height": this.surpage.height(),
             "bottom": 0,
             "top": 0
         })
         .appendTo($bloc_contenu);
     var $top_panel = $("<div class=\"topMenu\"></div>")
         .css({
             "position": "absolute",
             "width": this.surpage.width() - GLOB_largeur,
             "height": GLOB_hauteur,
             "top": 0,
             /*"background-color":"#00ff00",*/
             "display": "inline"
         })
         .appendTo($bloc_contenu);

     var $div_brd = $("<div></div>")
	 .attr({
             "id": "box" + this.numero,
             "class": "jxgbox"
         })
         .css({
             "position": "absolute",
             "width": this.surpage.width() - GLOB_largeur,
             "height": this.surpage.height() - GLOB_hauteur,
             "bottom": 0,
             "right": 0
         })
         .appendTo($bloc_contenu);

     this.brd = JXG.JSXGraph.initBoard('box' + this.numero,
				       {
					   axis: false,
					   keepaspectratio: true,
					   grid: false,
					   showCopyright: false
				       });

     /* -----------------------------------
	Création des blocs div pour les menus
	--------------------------------------
=======
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
    var self = this;
    
    /*On fait en sorte de ne pas avoir le clic droit sur cette zone, 
     *pour avoir le menu contextuel personnalisé*/
    var $bloc_contenu = $("<div></div>")
	.attr("id", "test_"+this.numero)
	.on("contextmenu", function(event) {
            event.preventDefault();
            return false;});
    
    /*Création du panneau d'affichage*/
    this.surpage = new BlocFocus($bloc_contenu, this.divBloc);
    
    // **** Fabrication du contenu du bloc ****
    /* Le panneau d'affichage du graphe est composé de trois blocs
     * - un bloc lateral qui contient les actions disponibles sur le graphe
     * - un bloc au sommet qui contient les formes que l'on peut créer sur le graphe
     * - un bloc plus central qui contient le graphe en lui même
>>>>>>> origin/dev
     */
    var $left_panel = $("<div></div>")
	.attr({"class":"leftMenu", "id":"lp_"+this.numero})
	.css({
        "position": "absolute",
        "width": GLOB_largeur,
        "height": this.surpage.height(),
        "bottom": 0,
        "top": 0
    }).appendTo($bloc_contenu);
    var $top_panel = $("<div class=\"topMenu\"></div>").css({
        "position": "absolute",
        "width": this.surpage.width() - GLOB_largeur,
        "height": GLOB_hauteur,
        "top": 0,
        "display": "inline"
    }).appendTo($bloc_contenu);
    var $div_brd = $("<div></div>").attr({
        "id": "box" + this.numero,
        "class": "jxgbox"
    }).css({
        "position": "absolute",
        "width": this.surpage.width() - GLOB_largeur,
        "height": this.surpage.height() - GLOB_hauteur,
        "bottom": 0,
        "right": 0
    }).appendTo($bloc_contenu);
    this.brd = JXG.JSXGraph.initBoard('box' + this.numero, {
        axis: false,
        keepaspectratio: true,
        grid: this.grid,
        showCopyright: false
    });

    /* -----------------------------------
       Création des blocs div pour les menus
       --------------------------------------
    */
    /* On crée des blocs correspondant aux différents menus :
     * - div_bouton_action :  bloc pour le menu des actions
     * - div_bouton_forme : bloc pour le menu des objets
     * - div_menu_contextuel : bloc pour le menu contextuel
     */
    // markbyyan
    var $div_bouton_forme = $("<div></div>").css({
        "display": "inline"
    }).appendTo($top_panel);
    var $div_bouton_action = $("<div class='actionLeft' ></div>").appendTo(
        $left_panel);
    this.inputZone = $("<div></div>").attr("class", "zoneInput").appendTo(
        $left_panel);
    this.$multiSelect.appendTo($left_panel).hide();
    this.$selection.appendTo(this.$multiSelect).hide();
    this.$multiSelectMenu.appendTo(this.$multiSelect).hide();
    var modeSelect = function(event) {
        self.mode = GLOB.libre;
    };

    /*var $div_choix_lier*/
    
    /******************************
     * A ne pas modifier
     */
    this.modeSelect = modeSelect;
    var tmpTestSelector = "#test_" + this.numero
    this.$menuContextuel.appendTo($(tmpTestSelector));
    this.inputBoxMenu.appendTo($bloc_contenu);
    this.initBoutonForme($div_bouton_forme);
    this.initBoutonAction($div_bouton_action);
    this.initEventListener($top_panel, $left_panel);
    var barre_tache_editJSXGraph = document.createElement("DIV");
    var bouton_composant_editJSXGraph = document.createElement("button");
    bouton_composant_editJSXGraph.id = "boutonComposantFD" + this.nom;
    bouton_composant_editJSXGraph.innerHTML = "Composants";
    bouton_composant_editJSXGraph.className = "Rcl_Editor_Button_Composant";
    bouton_composant_editJSXGraph.onclick = function() {
        var nom = "editJSXGraph" + this.id.slice("boutonComposantFD".length,
						 this.id.length);
        var nomEssaim = this.id.slice("boutonComposantFD".length, this.id
				      .length);
        var ind = rucheSys.rechercheIndice(nomEssaim, rucheSys.listeBlocPrepa);
        var essaim = rucheSys.listeBlocPrepa[ind];
    };
    barre_tache_editJSXGraph.appendChild(bouton_composant_editJSXGraph);

    /*On met à jour le deroulant car celui ci peut déjà posseder des éléments d'autres graphes.*/
    this.updateDeroulant();
    EssaimJSXGraph.prototype.initEnonce.call(this);
    EssaimJSXGraph.prototype.initAnalyse.call(this);
};
EssaimJSXGraph.prototype.nouveauComposant = function(classeComposant) {
    rucheSys.ajoutComposantEssaim("editJSXGraph" + this.nom,
				  classeComposant);
};
EssaimJSXGraph.prototype.detruitBloc = function() {
    /*JXG.JSXGraph.freeBoard(this.brd);*/
    /*this.brd = null;*/
    Essaim.prototype.detruitBloc.call(this);
};
/**
 * toOEF
 * Fonction qui génère le code OEF correspondant au graphe construit
 * @return {string} Code oef généré dans cette fonction
 */
EssaimJSXGraph.prototype.toOEF = function() {
    var bord_gauche = this.brd.getBoundingBox()[0];
    var bord_haut = this.brd.getBoundingBox()[1];
    var bord_droit = this.brd.getBoundingBox()[2];
    var bord_bas = this.brd.getBoundingBox()[3];
    /*On recupère la hauteur et la largeur de la zone de dessin, en terme de 
      coordonnées du dessin*/
    var largeur = bord_droit - bord_gauche;
    var hauteur = bord_haut - bord_bas;
    /*Taille de la diagonale de la zone de dessin*/
    var coef = Math.sqrt(largeur * largeur + hauteur * hauteur);
    var coef_dir_diagonal = (bord_haut - bord_bas) / (bord_droit -
						      bord_gauche);
    var OEF = "\\text{rangex" + this.nom + " = " + bord_gauche + "," +
        bord_droit + "}\n";
    OEF += "\\text{rangey" + this.nom + " = " + bord_bas + "," + bord_haut +
        "}\n";
    OEF += "\\text{" + this.nom + " = rangex \\rangex" + this.nom + "\n";
    OEF += "rangey \\rangey" + this.nom + "\n";
    if (this.grid) {
        var pas_x = JXG.Options.ticks.ticksDistance;
        var pas_y = JXG.Options.ticks.ticksDistance;
        /*On recupère les positions des premières lignes de la grille*/
        var deb_x = (bord_gauche - (bord_gauche % JXG.Options.ticks.ticksDistance));
        var deb_y = (bord_bas - (bord_bas % JXG.Options.ticks.ticksDistance));
        var nb_x = Math.ceil(bord_droit - bord_gauche / pas_x);
        var nb_y = Math.ceil(bord_haut - bord_bas / pas_x);
        OEF += "parallel " + deb_x + "," + bord_haut + "," + deb_x + "," +
            bord_bas + "," + pas_x + "," + 0 + "," + nb_x + ",grey\n";
        OEF += "parallel " + bord_gauche + "," + deb_y + "," + bord_droit +
            "," + deb_y + "," + 0 + "," + pas_y + "," + nb_y + ",grey\n";
    }
    var p1, p2;
    for (var element in this.brd.objects) {
        var brdElement = this.brd.objects[element];
        if (brdElement.getAttribute("visible")) {
            switch (brdElement.getType()) {
            case GLOB.point:
                OEF += "point " + brdElement.X() + "," + brdElement.Y() +
                    ",black\n";
                break;
            case GLOB.ligne:
                p1 = brdElement.point1;
                p2 = brdElement.point2;
                /*a et b correspondent aux vecteurs de translation des deux points qui
                  correspondent à la ligne, car en OEF la primitive ligne ne fait qu'un segment,
                  on translate donc les points en dehors de la zone de dessin, pour donner
                  l'illusion d'une droite*/
                var a = (p2.X() - p1.X()) * coef;
                var b = (p2.Y() - p1.Y()) * coef;
                OEF += "line " + (a + p1.X()) + "," + (b + p1.Y()) +
                    "," + (-a + p2.X()) + "," + (-b + p2.Y()) +
                    ",black\n";
                break;
            case GLOB.cercle:
                OEF += "circle " + brdElement.center.X() + "," +
                    brdElement.center.Y() + "," + (brdElement.Radius() *
						   this.brd.unitX) + ",black\n";
                break;
            case GLOB.segment:
                p1 = brdElement.point1;
                p2 = brdElement.point2;
                OEF += "segment " + p1.X() + "," + p1.Y() + "," + p2.X() +
                    "," + p2.Y() + ",black\n";
                break;
            case GLOB.fleche:
                p1 = brdElement.point1;
                p2 = brdElement.point2;
                OEF += "arrow " + p1.X() + "," + p1.Y() + "," + p2.X() +
                    "," + p2.Y() + ",7,black\n";
                break;
            case GLOB.axe:
                /*On recupère les deux points qui définisse un axe*/
                var brd = this.brd;
                p1 = brdElement.point1;
                p2 = brdElement.point2;
                var l, r, t, b;
                g = bord_gauche;
                d = bord_droit;
                t = bord_haut;
                b = bord_bas;
                var gauche_vers_droite = p1.X() < p2.X();
                var top_line_tmp = brd.create("segment", [
                    [g, t],
                    [d, t]
                ]);
                var bot_line_tmp = brd.create("segment", [
                    [g, b],
                    [d, b]
                ]);
                var side_line_tmp;
                /*Si on va de la gauche vers la droite, le coté gauche est inutile
                 * et vice et versa.
                 */
                if (gauche_vers_droite) {
                    side_line_tmp = brd.create("segment", [
                        [d, t],
                        [d, b]
                    ]);
                } else {
                    side_line_tmp = brd.create("segment", [
                        [g, t],
                        [g, b]
                    ]);
                }
                var intersect1 = brd.create("intersection", [brdElement,
							     top_line_tmp, 0
							    ]);
                var intersect2 = brd.create("intersection", [brdElement,
							     bot_line_tmp, 0
							    ]);
                var intersect3 = brd.create("intersection", [brdElement,
							     side_line_tmp, 0
							    ]);
                var dist1 = distance(p2, intersect1);
                var dist2 = distance(p2, intersect2);
                var dist3 = distance(p2, intersect3);
                var res;
                if ((dist1 < dist2) && (dist1 < dist3)) {
                    res = intersect1;
                } else if ((dist2 < dist1) && (dist2 < dist3)) {
                    res = intersect2;
                } else if ((dist3 < dist1 && dist3 < dist2)) {
                    res = intersect3;
                } else {
                    console.error("Une erreurs est survenu");
                }
                var xp1 = (p1.X() - p2.X()) * coef;
                var yp1 = (p1.Y() - p2.Y()) * coef;
                OEF += "arrow " + xp1 + "," + yp1 + "," + res.X() + "," +
                    res.Y() + ",7,black\n";
                brd.removeObject(intersect1);
                brd.removeObject(intersect2);
                brd.removeObject(intersect3);
                brd.removeObject(top_line_tmp);
                brd.removeObject(bot_line_tmp);
                brd.removeObject(side_line_tmp);
                break;
            case GLOB.angle:
                p1 = brdElement.point1;
                p2 = brdElement.point2;
                p3 = brdElement.point3;
                /*On crée une ligne temporaire pour obtenir l'angle de "base" à partir de l'axe X*/
                var tmpLine = this.brd.create("line", [p1, p2]);
                var valAngleAxeX = (tmpLine.getAngle() * 360) / (2 *
								 Math.PI);
                this.brd.removeObject(tmpLine);
                var valAngle = (brdElement.Value() * 360) / (2 * Math.PI) +
                    valAngleAxeX;
                OEF += "arc " + p1.X() + "," + p1.Y() + "," + "1,1," +
                    valAngleAxeX + "," + valAngle + ",black\n";
                break;
            default:
            }
        }
    }
<<<<<<< HEAD
    OEF += "}\n\\text{url" + this.nom + " = draw(" + this.hauteur_graphe + "," + this.largeur_graphe + "\n\\" + this.nom + ")}"
=======
    OEF += "}\n\\text{url" + this.nom + " = draw(200,200\n\\" + this.nom +
        ")}";
>>>>>>> origin/dev
    return OEF;
};
/**
 * Genere le code OEF qui correspond à la partie "statement", code necessaire pour l'affichage de l'image
 */
EssaimJSXGraph.prototype.toOEFFromStatement = function(idReponse) {
    return "<img src=\"\\url" + this.nom + "\" alt=\"Erreur avec l'image " +
        this.nom + "\"/>";
};
/**
 * supprime une image dans le plateau
 * @param image: JSXGraph.element(image), la variable qui indique une image de JSXGraph
 */
EssaimJSXGraph.prototype.removeImage = function(image) {
    this.brd.removeObject(image);
};
/**
 * ici on definit les options du menu contextuel
 * @param element, callback argument
 * @returns {{}}
 */
EssaimJSXGraph.prototype.menuOptions = function(element) {
    var options = {};
    var self = this;
    options.common = {
        changeNom: {
            nom: "Changer le nom",
            callback: function() {
                $.when(self.inputbox("", self.inputBoxMenu, "Nom"))
                    .done(function(nom) {
                        element.name = nom.toUpperCase();
                        element.setAttribute({
                            "withLabel": true
                        });
                        self.brd.update();
                    }).fail(function(err) {
                        alert(err);
                    });
            }
        },
        supprime: {
            nom: "Supprimer",
            callback: function() {
                self.removeElement(element);
                self.point = [];
            }
        }
    };
    options.point = {
        lier: {
            nom: "Lier",
            callback: function() {
		
                var tmp = getUsableVar();
                element.addConstraint([function(){ return getValueVar(tmp[0]) }, element.Y()]);
		self.brd.fullUpdate();
            }
        }
    };
    options.image = {
        resize: {
            nom: "Changer la taille",
            callback: function() {
                $.when(self.inputbox(
                    "Entrer la largeur et la hauteur, separer par , ",
                    self.inputBoxMenu)).done(function(data) {
			var width = parseInt(data.match(
				/^ *[^,]* *,/)[0].replace(
					/,/, ""));
			var height = parseInt(data.match(
				/, *[^,]*$/)[0].replace(/,/,
							""));
			element.updateSize();
			element.updateRenderer();
			self.brd.fullUpdate();
                    });
            }
        },
        haut: {
            nom: "remettre en haut",
            callback: function() {
                var tmp = element;
                self.brd.removeObject(element);
                self.brd.create("image", [tmp.url, [tmp.X(), tmp.Y()],
					  tmp.usrSize
					 ]);
            }
        }	
    };

    options.angle = {
	lier:{
	    nom: "Lier",
	    callback: function(){
		var tmp = getUsableVar();
		element.setAngle(function(){ return getValueVar(tmp[0])});
		self.brd.fullUpdate();
	    }
	}
    }

    options.segment = {
	lier:{
	    nom: "Lier",
	    callback: function(){
		var tmp = getUsableVar();
		element.setAttribute("length", function(){ return getValueVar(tmp[0])});
		self.brd.fullUpdate();
	    }
	}
    }

    options.circle = {
	lier:{
	    nom: "Lier",
	    callback: function(){
		var tmp = getUsableVar();
		element.setRadius((function(){ return getValueVar(tmp[0])}));
		self.brd.fullUpdate();
	    }
	}
    }
    return options;
};


/* TODO à faire
 * remplacer tous les this.mode et tous les self.mode par this/self.updateMode
 *
 */

/**
 * Met à jour le mode courant 
 * @param nouveauMode - nouveau mode qui va etre appliquer
 */
EssaimJSXGraph.prototype.updateMode = function(nouveauMode) {
    this.mode = nouveauMode;
    /*var ancienMode = this.mode;
    this.modeInUse = nouveauMode;
    for (i = 0; i < 7; i++) {
        if (modeInUse(donnees.valeur) === i) {}
    }*/
};


/**
 * Retourne le mode courant
 * @return {string} - mode courant
 */
EssaimJSXGraph.prototype.getMode = function(){
    return this.mode;
}

/*TODO : Surbrillance*/
/* Permet de savoir quel mode est entrain d'être utilisé */
/*EssaimJSXGraph.prototype.modeInUse = function(mode) {
    var donnees = {
        boutonCourant: null,
        valeur: null
    };
    switch (this.mode) {
    case GLOB.point:
        donnees.boutonCourant = $button_point;
        donnees.valeur = 1;
        break;
    case GLOB.ligne:
        donnees.boutonCourant = $button_ligne;
        donnees.valeur = 2;
        break;
    case GLOB.cercle:
        donnees.boutonCourant = $button_cercle;
        donnees.valeur = 3;
        break;
    case GLOB.fleche:
        donnees.boutonCourant = $button_arrow;
        donnees.valeur = 4;
        break;
    case GLOB.segment:
        donnees.boutonCourant = $button_segment;
        donnees.valeur = 5;
        break;
    case GLOB.axe:
        donnees.boutonCourant = $button_axis;
        donnees.valeur = 6;
        break;
    case GLOB.angle:
        donnees.boutonCourant = $button_angle;
        donnees.valeur = 7;
        break;
    default:
        donnees.boutonCourant = $button_libre;
        donnees.valeur = 8;
    }
    return donnees;
};*/


/**
 * insère une image dans un point
 * @param url" String, url de l'image
 * @param pointExiste: JSXGraph.element(point), le variable qui indique un point de JSXGraph
 * @returns {*}
 */
EssaimJSXGraph.prototype.fillImageIntoPoint = function(url, pointExiste) {
    /**
     * Important:
     * En changent le numéro de layer de l'image, on met l'image plus haute que les autres
     */
    this.brd.options.layer["image"] = 100;

    function getCoord2D(paint) {
        return getCoord(paint).slice(1);
    }

    function getSize(paint) {
        return paint.visProp.size;
    }
    var coordsToPixelX = /*30*/ this.brd.unitX; /*TODO - A VERIFIER*/
    var coordsToPixelY = this.brd.unitY;
    //TODO to have an exact ratio
    var width = getSize(pointExiste) / coordsToPixelX;
    var height = getSize(pointExiste) / coordsToPixelY
    var point = (function() {
        var point = getCoord2D(pointExiste);
        point[0] -= width / 2;
        point[1] -= height / 2;
        return point;
    })();
    return this.brd.create("image", [url, point, [width, height]]);
};
/**
 * fait apparaitre une fenêtre pour charger une image.
 * @param readSuccess
 * @param readFail
 */
EssaimJSXGraph.prototype.popupImageUploader = function(readSuccess, readFail) {
    var self = this;
    if (!FileReader) {
        var err = "A Newer Version of Browser is Required.";
        if (readFail) {
            readFail(err);
        } else throw err;
    }
    var $input = $("<input />").attr("type", "file");
    var $img = $("<img />").attr({
        src: "",
        alt: "image"
    });
    $input.trigger("click");

    function readFile(file) {
        var reader = new FileReader();
        reader.onload = readSuccess;
        reader.readAsDataURL(file);
    }
    $input.get(0).onchange = function(event) {
        var target = event.target || event.srcElement;
        readFile(target.files[0]);
    };
};
/**
 * getTopUnderMouse
 * Obtenir le premier élément, à partir du texte
 * les textes sont le moins prioritaires juste dans cette fonction,
 * dont le layer n'est pas globalement modifié
 * @returns {*}
 */
EssaimJSXGraph.prototype.getTopUnderMouse = function() {
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
    if (!ele.length || ele.length < 2) return null;
    var type = ele[0].getType();
    var level = layer[type];
    var top = ele[0];
    for (var i = 0; i < ele.length; i++) {
        if (level < layer[type]) {
            level = layer[type];
            top = ele[i];
        }
    }
    return top;
};
/**
 * buildMenu :
 * construit un menu lié a l'objet selectionné, pour le menu contextuel.
 * @param element, callback argument
 */
EssaimJSXGraph.prototype.buildMenu = function(element) {
    // Pour indiquer les options dans le menu par rapport aux types des éléments
    var buildButton = function(option) {
        return $("<input type='button' value='" + option.nom + "'/>").click(
            option.callback);
    };
    var options = this.menuOptions(element);
    var self = this;
    (function(list) {
        for (var key = 0; key < list.length; key++) {
            if (options[list[key]]) {
                var option = Object.keys(options[list[key]]);
                for (var i = 0; i < option.length; i++) {
                    self.$menuContextuel.append(buildButton(options[list[key]]
						     [option[i]]));
                }
            }
        }
    })(["common", element.getType()]);
};

/**
 * Sélectionne un objet pour le menu contextuel
 */
EssaimJSXGraph.prototype.selection = function(event) {
    this.hideAllContext();
    var element = this.getTopUnderMouse();
    if (element && element.getType() && element.getType() !== "text"){
	var position  = {
            "x": event.clientX,
            "y": event.clientY};
	this.showContextMenu(position, element);
    }else{
	console.log("Pas d'élément");
    };
};

/**
 * associer un évènement de souris à multi-select
 * cliquer une fois sur un élément le selectionne, une deuxième fois ça le lache
 * le bouton ok stop la multi-selection puis fait apparaitre un menu
 * le bouton effacer efface la multi-selection
 */
EssaimJSXGraph.prototype.multiSelect = function() {
    var tmp = function() {
        self.$button_libre.trigger("click");
        var element = self.getTopUnderMouse();
        if (element.getType()) {
            var tmp = self.stackMultiSelect.indexOf(element);
            if (tmp >= 0) {
                self.stackMultiSelect.splice(tmp, 1);
            } else {
                self.stackMultiSelect.push(element)
            }
        }
        //interface
        self.$selection.html("");
        var html = [];
        var select = self.stackMultiSelect;
        for (var i = 0; i < select.length; i++) {
            html.push(select[i].getType() + " " + select[i].name);
        }
        self.$selection.html(JSON.stringify(html));
    };
    this.mode = GLOB.libre;
    this.stackMultiSelect = [];
    this.brd.off("up", tmp);
    // pour eviter deux fois cliquer
    var self = this;
    // ok button
    var tmpSelector = "#lp_"+this.numero;
    this.$multiSelect.appendTo($(tmpSelector));
    this.$multiSelect.html("Multi-Select").show();
    this.$selection.html("").show();
    this.$multiSelectMenu.html("");
    this.$multiSelectMenu.show();
    var $tout = $("<input />").appendTo(this.$multiSelect).attr({
        type: "button",
        value: "Tout Select"
    }).html("Tout Select").click(function() {
        var keys = Object.keys(self.brd.objects);
        var html = [];
        for (var i = 0; i < keys.length; i++) {
            var element = self.brd.objects[keys[i]];
            if (element.getType() != "text" && element.name) {
                self.stackMultiSelect.push(element);
            }
        }
        var select = self.stackMultiSelect;
        for (i = 0; i < select.length; i++) {
            html.push(select[i].getType() + " " + select[i].name);
        }
        self.$selection.html(JSON.stringify(html));
    });
    var $ok = $("<input type='button' value ='Ok' />").appendTo(this.$multiSelect)
        .html("ok").click(function(event) {
            self.brd.off("up", tmp);
            self.$button_libre.trigger("click");
            $tout.remove();
            $ok.remove();
            $clean.remove();
            self.buildMultiSelectMenu();
        });
    // clean button
    var $clean = $("<input type='button' value='Effacer' />").appendTo(this
								       .$multiSelect).html("Effacer").click(function() {
									   self.cleanMultiSelection();
								       });
    this.$selection.appendTo(this.$multiSelect);
    this.$multiSelectMenu.appendTo(this.$multiSelect);
    console.log(this.$multiSelect);
    this.brd.on("up", tmp);
};
/**
 * construit les boutons dans le menu de multi selection.
 */
EssaimJSXGraph.prototype.buildMultiSelectMenu = function() {
    // this.stackMultiStack est le array de selection
    var menu = {};
    var self = this;
    menu.grouper = {
        nom: "Grouper",
        callback: function() {
            self.brd.create("group", self.stackMultiSelect);
        }
    };
    menu.toutsup = {
        nom: "Suppression",
        callback: function() {
            for (var i = 0; i < self.stackMultiSelect.length; i++) {
                self.brd.removeObject(self.stackMultiSelect[i]);
            }
            self.brd.update();
            self.cleanMultiSelection();
        }
    };
    menu.sauvegarder = {
        nom: "Sauvegarde",
        callback: function() {
            self.saveSelection(self.stackMultiSelect);
            self.cleanMultiSelection();
        }
    };
    var key = Object.keys(menu);
    var buildButton = function(option) {
        return $("<input type='button' value=" + option.nom +
                 " title=\"Permet de supprimer toute la sélection.\"/>")
            .html(option.nom).click(option.callback);
    };
    for (var i = 0; i < key.length; i++) {
        self.$multiSelectMenu.append(buildButton(menu[key[i]]));
    }
    self.$multiSelectMenu.appendTo(self.$multiSelect);
};
/**
 * effacer les selections multiples
 */
EssaimJSXGraph.prototype.cleanMultiSelection = function() {
    this.stackMultiSelect = [];
    this.$selection.html("");
    this.$multiSelectMenu.html("");
};
/**
 * Fait apparaitre une boite d'entrée utilisateur pour récuperer la valeur
 *
 * @param label - le titre du input
 * @param type - le type du input
 * @returns {*}, $.Deferred.promise()
 */
EssaimJSXGraph.prototype.inputbox = function(label, parent, hint, showButton,
					     type) {
    label = label || "";
    type = type || "text";
    showButton = showButton || true;
    var def = $.Deferred();
    this.inputZone.empty();
    var $box = $("<div></div>").appendTo(parent);
    var $label = $("<div></div>").html(label).appendTo($box);
    var $input = $("<input />").attr({
        "type": type,
        "placeholder": hint
    }).appendTo($box);
    var $submit = $(
        "<input class='bouton_valider' type='button' value='Valider' />"
    ).html("ok").click(function(event) {
        if (!$input.val() || !$input.val().length) {
            def.reject("La valeur n'est pas definie.");
        } else {
            $box.remove();
            def.resolve($input.val());
        }
    }).appendTo($box);
    if (!showButton) {
        $submit.hide();
    }
    return def.promise();
};

/**
 * TODO
 */
EssaimJSXGraph.prototype.selectMode = function() {
    this.$button_libre.trigger("click");
};
/**
 * Fonction qui initialise les boutons qui permettent de générer des éléments sur le graphe tel que
 * des points, des lignes, etc. Cette fonction gère aussi les événements lié à ces boutons.
 *
 * @param parent - élément dans lequel viennent s'insérer tous les boutons
 */
EssaimJSXGraph.prototype.initBoutonForme = function(parent) {
    var self = this;
    var $div_bouton_forme = parent;
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
       */
    var $button_point = $(
        "<input type='button' value='Point' title=\"Permet de créer un point.\"/>"
    ).appendTo($div_bouton_forme).click(function(event) {
        self.mode = GLOB.point;
    });
    var $button_ligne = $(
        "<input type='button' value='Droite' title=\"Permet de créer une droite. On utilise deux points pour cela.\"/>"
    ).appendTo($div_bouton_forme).click(function(event) {
        self.mode = GLOB.ligne;
    });
    var $button_cercle = $(
        "<input type='button' value='Cercle' title=\"Permet de créer un cercle. On utilise deux points pour cela.\"/>"
    ).appendTo($div_bouton_forme).click(function(event) {
        self.mode = GLOB.cercle;
    });
    var $button_segment = $(
        "<input type='button' value='Segment' title=\"Permet de créer un segment. On utilise deux points pour cela.\"/>"
    ).appendTo($div_bouton_forme).click(function(event) {
        self.mode = GLOB.segment;
    });
    var $button_arrow = $(
        "<input type='button' value='Vecteur' title=\"Permet de créer un vecteur. On utilise deux points pour cela.\"/>"
    ).appendTo($div_bouton_forme).click(function(event) {
        self.mode = GLOB.fleche;
    });
    var $button_axis = $(
        "<input type='button' value='Axe' title=\"Permet de créer un axe. On utilise deux points pour cela.\"/>"
    ).appendTo($div_bouton_forme).click(function(event) {
        self.mode = GLOB.axe;
    });
    var $button_angle = $(
        "<input type='button' value='Angle' title=\"Permet de créer un angle en utiliant 3 points\"/>"
    ).appendTo($div_bouton_forme).click(function(event) {
        self.mode = GLOB.angle;
    });
};
/**
 * Fonction qui initialise tout les boutons qui gèrent les actions que l'on peut faire dans le
 * graphe (supprimer, se mettre en mode libre, etc). Gère aussi les evenements lié à ces boutons.
 *
 * @param parent - element dans lequel viennent s'inserer tout les boutons
 */
EssaimJSXGraph.prototype.initBoutonAction = function(parent) {
    var self = this;
    var $div_bouton_action = parent;
    /* ----------------------
       Menu pour les actions
       -------------------------
       * Actions possibles :
       * - grille (afficher/supprimer)
       * - déplacer (déplacement libre)
       * - save (sauvegarder des objets dans une boîte à dessins)
       * - supprimer (à mettre plus tard dans le menu contextuel)
       * - multi-selection
       */
    var $button_libre = $(
        "<input type='button' value='Déplacer' title=\"Permet de déplacer des objets dans le graphe.\"/>"
    ).appendTo($div_bouton_action).click(function(event) {
        self.mode = GLOB.libre;
    });
    /**
     * button supprimer
     * supprimer un élément en click,
     * si on clique sur un élément non valide, il va envoyer un message d'erreur,
     * si valide, il va supprimer l'élément.
     * il marche une fois et puis revient en mode selection
     * @type {*|{trigger, _default}|jQuery}
     */
    var $button_image = $("<input type='button' value='Importer image'/>").appendTo(
        $div_bouton_action).click(function(event) {
            self.popupImageUploader(function(event) {
		var result = event.target.result;
		self.brd.create("image", [result, [0, 0],
					  [5, 5]
					 ]);
		self.brd.update();
            });
	});
    var $multiselect = $(
        "<input type='button' value ='Multi-select' title = \"Action de multi-sélection\" />"
    ).appendTo($div_bouton_action).click(function(event) {
        self.multiSelect();
    });
    var $button_switch_grille = $(
        "<input type='button' value = 'Grille' title=\"Affiche/enlève la grille.\" />"
    ).appendTo($div_bouton_action).click(function(event) {
        self.switchGrid();
    });
    this.deroulant = $("<select></select>").appendTo($div_bouton_action);
    var $charger = $("<input type='button' value='Charger'/>").click(
        function(event) {
            self.loadSelection(self.deroulant.val());
        }).appendTo($div_bouton_action);
    var $save = $(
        "<input type='button' value = 'Ajout dans BaD' title=\"Permet de sauvegarder des éléments du graphique dans une boite à dessin.\" />"
    ).appendTo($div_bouton_action).click({
        charge: $charger
    }, function(event) {
        self.saveSelection(self.brd.objects);
    });
    var $button_undo = $(
        "<input type='button' value='Annuler' title=\"Permet d'annuler la dernière action.\" />."
    ).appendTo($div_bouton_action).click(function(event) {
        //TODO fonction undo (annuler/retour action précédente)
    });
    EssaimJSXGraph.prototype.$button_libre = $button_libre;
};
/**
 * Fonction qui se charge d'initialiser tous les "écouteurs" d'événement,
 * comme un redimensionnement, un clic souris ou autre.
 *
 * @param $top_panel - panneau supérieur, qui nécessite un redimensionnement si un
 * redimensionnement a lieu
 * @param $left_panel - panneau latéral gauche qui nécessite un redimensionnement si un
 * redimensionnement a lieu
 */
EssaimJSXGraph.prototype.initEventListener = function($top_panel, $left_panel) {
    var self = this;
    this.surpage.on("resize", function() {
        self.brd.resizeContainer(self.surpage.width() -
				 GLOB_largeur, self.surpage.height() - GLOB_hauteur);
        $top_panel.css({
            "width": self.surpage.width() - GLOB_largeur,
            "height": GLOB_hauteur
        });
        $left_panel.css({
            "width": GLOB_largeur,
            "height": self.surpage.height()
        });
    });
    var buttons;
    this.brd.on('down', function(event){
	buttons = event.buttons;
    });
    this.brd.on('up', function(event) {
        if (/*event.*/buttons === 1) {
            var brd = self.brd;
            var mode = self.mode;
            var coords = getMouseCoords(event, self.brd);
            var userCoord = brd.getUsrCoordsOfMouse(event);
            var objet;
            if (self.mode !== GLOB.libre) {
                var point;
                for (var element in brd.objects) {
                    if (brd.objects[element].hasPoint(coords.scrCoords[
                        1], coords.scrCoords[2]) && brd.objects[
                            element].getAttribute("visible") && JXG
                        .isPoint(brd.objects[element])) {
                        point = brd.objects[element];
                    }
                    objet = brd.objects[element];
                }
                if (point === undefined) {
                    /*
                     * On différencie le cas ou on fait des points de construction,
                     * pour faire les points plus petit
                     */
                    if (mode !== GLOB.point) {
                        point = brd.create("point", userCoord, {
                            size: 1
                        });
                    } else {
                        point = brd.create("point", userCoord);
                    }
                }
                objet = point;
                self.point.push(point);
                switch (mode) {
                case GLOB.point:
                    self.point = [];
                    break;
                case GLOB.ligne:
                    if (self.point.length === 2) {
                        objet = brd.create(self.mode, self.point);
                        self.point = [];
                    }
                    break;
                case GLOB.cercle:
                    if (self.point.length === 1) {
                        self.previsualisedObject = self.brd.create(
                            self.mode, [self.point[0],
					userCoord
                                       ]);
                    } else if (self.point.length === 2) {
                        brd.removeObject(self.previsualisedObject);
                        self.previsualisedObject = null;
                        objet = brd.create(self.mode, self.point);
                        self.point = [];
                    }
                    break;
                case GLOB.fleche:
                    if (self.point.length === 2) {
                        objet = brd.create(self.mode, self.point);
                        self.point = [];
                    }
                    break;
                case GLOB.segment:
                    if (self.point.length === 2) {
                        objet = brd.create(self.mode, self.point);
                        self.point = [];
                    }
                    break;
                case GLOB.axe:
                    if (self.point.length === 2) {
                        objet = self.createDraggableAxis(self.point);
                        self.point = [];
                    }
                    break;
                case GLOB.angle:
                    if (self.point.length === 3) {
                        objet = brd.create(self.mode, self.point);
                        self.point = [];
                    }
                    break;
                default:
                    console.error(
                        "Erreur de mode, le mode selectionné est incorrect"
                    );
                }
                if (self.point.length > 3) {
                    console.error(
                        "Erreur de points, trop de point en mémoire."
                    );
                    self.point = [];
                }
                if (objet) {
                    objet.on("drag", function() {
                        self.mode = GLOB.libre;
                        self.point = [];
                        self.brd.removeObject(self.previsualisedObject);
                        self.previsualisedObject =
                            undefined;
                    });
                }
            } else {
                self.point = [];
            }
        }
    });
    this.brd.on('move', function(event) {
        self.lastEvent = event;
        if (self.previsualisedObject) {
            self.previsualisedObject.point2.setPosition(JXG.COORDS_BY_USER,
							self.brd.getUsrCoordsOfMouse(event));
            self.brd.update();
        }
    });
    /*Fonction du menu contextuel*/
    this.brd.on("down", function(event) {
        if (event.buttons === 2) {
            self.selection(event);
        } else {
            self.hideContextMenu();
        }
    });

    this.surpage.on("show", function(){
	self.brd.fullUpdate();
	self.updateDeroulant();
	self.hideAllContext();
    });

    this.surpage.on("hide", function(){
	self.hideAllContext();
    });
};
/**
 * Fonction qui ajoute une sauvegarde de l'élément passer en parametre
 * @param objects - Element que l'on souhaite enregistré
 */
EssaimJSXGraph.prototype.saveSelection = function(objects) {
    var type = ["line", "circle", "arrow", "segment", "axis", "angle", "image"];
    var objets = {};
    var points = {};
    var self = this;
    for (var i in objects) {
        if (objects[i].getType() !== "text") {
            if (objects[i].getAttribute("visible") && type.indexOf(objects[
                i].getType()) !== -1) {
                objets[i] = objects[i];
            } else if (objects[i].getAttribute("visible") && objects[i].getType() ===
                       "point") {
                points[i] = objects[i];
            }
        }
    }
    $.when(this.inputbox("Entrer un nom", self.inputZone)).done(function(
        name) {
        if (saveState[name] === undefined) {
            saveState[name] = {
                "forme": objets,
                "point": points
            };
            self.updateDeroulant();
        } else {
            alert("Le nom " + name + " est déjà pris");
        }
    }).fail(function(err) {
        alert(err);
    });
};
/**
 * fonction qui charge l'élément selectionné
 * @param name - Nom de l'élément que l'on va charger
 */
EssaimJSXGraph.prototype.loadSelection = function(name) {
    if (saveState[name] === undefined) {
        console.error("Le nom séléctionné n'est pas défini");
    } else {
        var objets = saveState[name].forme;
        var points = saveState[name].point;
        var ancestor = {};
        for (var i in points) {
            ancestor[i] = this.brd.create("point", [points[i].X(), 
						    points[i].Y()], 
					  {
					      name: points[i].name,
					      size: points[i].getAttribute("size")
					  });
        }
        var ancestorObject = [];
        for (var i in objets) {
            ancestorObject = [];
            for (var j in objets[i].ancestors) {
                ancestorObject.push(ancestor[j]);
            }
            if (objets[i].getType() === "angle") {
                var tmp = ancestorObject;
                ancestorObject = [tmp[1], tmp[0], tmp[2]];
            }
            if (objets[i].getType() !== "axis") {
                this.brd.create(objets[i].getType(), ancestorObject);
            } else {
                this.createDraggableAxis(ancestorObject);
            }
        }
    }
};
/**
 * Fonction qui met à jour le menu déroulant des sauvegarde de tout les graphes existant
 */
EssaimJSXGraph.prototype.updateDeroulant = function() {
    this.deroulant.empty();
    for (var name in saveState) {
        $("<option>" + name + "</option>").appendTo(this.deroulant);
    }
};

/**
 *  Fonction qui reinitialise l'affichage du menu contextuel
 */
EssaimJSXGraph.prototype.hideAllContext = function() {
    this.hideContextMenu();
    this.hideInputBoxMenu();
};

EssaimJSXGraph.prototype.hideInputBoxMenu = function(){
    this.inputBoxMenu.empty();
    this.inputBoxMenu.hide();
}
/**
 *Fonction qui permet de crée des axes sans grille que l'on peut déplacer.
 */
EssaimJSXGraph.prototype.createDraggableAxis = function(point) {
    var self = this;
    var axis = this.brd.create("axis", point, {
        name: '',
        withLabel: true,
        label: {
            position: 'top'
        }
    });
    /*Sert à ne pas créer les grilles lorsque on crée un axe*/
    axis.removeAllTicks();
    axis.isDraggable = true;
    axis.on('drag', function() {
        self.brd.fullUpdate();
    });
    for (var i in axis.ancestors) {
        axis.ancestors[i].isDraggable = true;
        axis.ancestors[i].on('drag', function() {
            self.brd.fullUpdate();
        });
    }
    axis.needsRegularUpdate = true;
    this.brd.update();
    return axis;
};

/**
 * Fonction qui permet de supprimer tout les elements lié à un element
 * @param element - Element dont on souhaite supprimer tout les elements lié
 */
EssaimJSXGraph.prototype.removeElement = function(element) {
    for (var i in element.childElements) {
        this.brd.removeObject(this.brd.objects[i]);
    }
    for (var i in element.ancestors) {
        this.brd.removeObject(this.brd.objects[i]);
    }
    this.brd.removeObject(element);
};

EssaimJSXGraph.prototype.showContextMenu = function(pos, element){
    var self = this;
    this.hideAllContext();
    
    var tmp = "#test_" + this.numero;
    this.$menuContextuel.css({
        "position": "absolute",
        "left": pos.x + 5,
        "top": pos.y + 5,
        "border": "1px black solid",
        "z-index": "5"})
	.click(function() {
            self.hideContextMenu();
	    self.inputBoxMenu
		.css({
		    "position": "absolute",
		    "left": pos.x - 5,
		    "top": pos.y - 5,
		    "z-index": "5"})
		.show();
	})
	.appendTo($(tmp))
	.show();
    this.buildMenu(element);
}

EssaimJSXGraph.prototype.hideContextMenu = function(){
    this.$menuContextuel.empty();
    this.$menuContextuel.hide();
}

/**
 * Fonction qui permet d'activer ou non la grille à volonté
 */
EssaimJSXGraph.prototype.switchGrid = function(){
    this.grid = !this.grid;
    if (!this.grid) {
        this.brd.removeGrids();
    } else {
        this.brd.create('grid', []);
    }
    this.brd.fullUpdate();
}



/*Useful function are below*/
/**
 * Fonction qui retourne toute les variable que l'on peut lié au graphe
 */
function getUsableVar() {
    var usableVar = [];
    var varBase = rucheSys.listeVariables;
    for (var i in varBase) {
        if (["real", "integer"].indexOf(varBase[i].format.nom) !== -1) {
            usableVar.push(varBase[i]);
        }
    }
    return usableVar;
};
/**
 * Fonction qui permet de recuperer les coordonnées d'un clic sur le graphe
 * @param event
 * @param brd
 * @return
 */
function getMouseCoords(event, brd) {
    var cPos = brd.getCoordsTopLeftCorner(event, 0),
    absPos = JXG.getPosition(event, 0),
    dx = absPos[0] - cPos[0],
    dy = absPos[1] - cPos[1];
    return new JXG.Coords(JXG.COORDS_BY_SCREEN, [dx, dy], brd);
}
/**
 * Fonction qui calcule la distance entre deux point JSXGraph.
 * @param p1 - premier point à partir duquel on calcul une distance
 * @param p2 - deuxième point à partir duquel on calcul une distance
 * @return {Number} distance de p1 à p2
 */

function distance(p1, p2) {
    return Math.sqrt((p1.X() - p2.X()) * (p1.X() - p2.X()) + (p1.Y() - p2.Y()) *
		     (p1.Y() - p2.Y()));
}
/**
 * Fonction qui retourne le nombre d'element d'un objet
 * @param object - objets dont on souhaite connaitre la taille
 * @return retourne le nombre d'élément de l'objet
 */

function getLen(object) {
    // doit donner une erreur quand object est null, undefined ou pas un object
    if (object) {
        var tmp = Object.keys(object).length;
    } else {
        console.error("L'objets est indéfinie");
    }
    // afin que cette valeur ne soit pas modifiable
    return -1;
}
/**
 * Fonction qui permet de crée un menu déroulant à l'aide d'un tableau qui contient les options dans le bloc
 * parent. Cette fonction détruit le contenu du bloc parent. On peut définir un id pour le select,
 * par défaut il est null
 * @param options - Tableau qui contient les options désirée
 * @param parent - element dans lequel le select se trouvera
 * @param id - Id du select
 */

function createOption(options, parent, id) {
    id = id || null;
    parent.empty();
    var $select_tmp = $("<select></select>").appendTo(parent);
    if (id) {
        parent.attr("id", id);
    }
    for (var i in options) {
        $("<option></option>").html(options[i]).appendTo($select_tmp);
    }
    return parent;
}
/**
 * Fonction qui permet de recuperer la valeurs entiere ou flottante en fonction de sont type
 * @param {string} variable - Contient la valeur de l'élément
 * @return {Number} -
 */

function getValueVar(variable) {
    var err;
    switch (variable.format.nom) {
    case "integer":
        err = parseInt(variable.recupDonnees(), 10);
        break;
    case "real":
        err = parseFloat(variable.recupDonnees());
        break;
    default:
        console.error(
            "Type inconnue, la variable ne peut etre traiter.");
    }
    if (isNaN(err)) {
        console.error("Aucun éléments viable appartient à la chaine " +
		      variable);
	return 0;
    } else {
        return err;
    }
}

$(document).ready(function() {
    rucheSys.initClasseEssaim(EssaimJSXGraph);
});
