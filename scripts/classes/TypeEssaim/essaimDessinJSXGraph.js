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
var GLOB_arc = "arc";

// variable permettant de sauvegarder l'état actuel du dessin*/
var saveState = {};
var selectListener = [];

//Variables qui définissent la largeur du panneau latéral et la hauteur du panneau d'entête.
var GLOB_largeur = 110;
var GLOB_hauteur = 30;

var AllJSXGraph = [];

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

    this.previsualisedObject = undefined;

    this.surpage;

    this.inputZone;

    this.deroulant;

    this.inputBoxMenu = $("<div></div>");
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
EssaimJSXGraph.prototype.$divMenu = $("<div class='menu_contextuel'></div>").hide();
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
					   axis: this.axis,
					   keepaspectratio: true,
					   /*boundingbox: [-5, 5, 5, -5],*/
					   grid: false,
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
     var $div_bouton_forme = $("<div></div>")
         .css({
             "display": "inline"
         })
         .appendTo($top_panel);

     var $div_bouton_action = $("<div class='actionLeft' ></div>")
         .appendTo($left_panel);

     var $div_menu_contextuel = $("<div></div>")
         .appendTo($left_panel);

     this.inputZone = $("<div></div>").appendTo($left_panel);

     this.$multiSelect.appendTo($left_panel).hide();
     this.$selection.appendTo(this.$multiSelect).hide();
     this.$multiSelectMenu.appendTo(this.$multiSelect).hide();

     var modeSelect = function (event) {
         self.mode = GLOB_libre
     };

     /******************************
      * A ne pas modifier
      */
     this.modeSelect = modeSelect;


     this.$divMenu.appendTo( $bloc_contenu);
     this.$menuButtons.appendTo( $bloc_contenu);
     this.inputBoxMenu.appendTo( $bloc_contenu);

     this.initBoutonForme($div_bouton_forme);
     this.initBoutonAction($div_bouton_action);
     this.initEventListener($top_panel, $left_panel);

     
     var barre_tache_editJSXGraph = document.createElement("DIV");
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

     /*On met à jour le deroulant car celui ci peut déjà posseder des éléments d'autres graphes.*/
     this.updateDeroulant();
     
     EssaimJSXGraph.prototype.initEnonce.call(this);
     EssaimJSXGraph.prototype.initAnalyse.call(this);

     console.log(rucheSys.listeVariables);
 }


EssaimJSXGraph.prototype.nouveauComposant = function (classeComposant) {
    rucheSys.ajoutComposantEssaim("editJSXGraph" + this.nom, classeComposant);
}


EssaimJSXGraph.prototype.detruitBloc = function () {
    /*JXG.JSXGraph.freeBoard(this.brd);*/
    /*this.brd = null;*/
    Essaim.prototype.detruitBloc.call(this);
}


/**
 * toOEF
 * Fonction qui génère le code OEF correspondant au graphe construit
 * @return {string} Code oef généré dans cette fonction
 */
EssaimJSXGraph.prototype.toOEF = function () {
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
    var coef_dir_diagonal = (bord_haut - bord_bas) / (bord_droit - bord_gauche);
    var OEF = "\\text{rangex" + this.nom + " = " + bord_gauche + "," + bord_droit + "}\n"
    OEF += "\\text{rangey" + this.nom + " = " + bord_bas + "," + bord_haut + "}\n";
    OEF += "\\text{" + this.nom + " = rangex \\rangex" + this.nom + "\n";
    OEF += "rangey \\rangey" + this.nom + "\n";
    if (!this.grid) {
        var pas_x = JXG.Options.ticks.ticksDistance;
        var pas_y = JXG.Options.ticks.ticksDistance;
        /*On recupère les positions des premières lignes de la grille*/
        var deb_x = (bord_gauche - (bord_gauche % JXG.Options.ticks.ticksDistance));
        var deb_y = (bord_bas - (bord_bas % JXG.Options.ticks.ticksDistance));
        var nb_x = Math.ceil(bord_droit - bord_gauche / pas_x);
        var nb_y = Math.ceil(bord_haut - bord_bas / pas_x);
        OEF += "parallel " +
            deb_x + "," + bord_haut + "," +
            deb_x + "," + bord_bas + "," +
            pas_x + "," + 0 + "," +
            nb_x + ",grey\n";
        OEF += "parallel " +
            bord_gauche + "," + deb_y + "," +
            bord_droit + "," + deb_y + "," +
            0 + "," + pas_y + "," +
            nb_y + ",grey\n";
    }
    for (element in this.brd.objects) {
        var brdElement = this.brd.objects[element];
        if (brdElement.getAttribute("visible")) {
            switch (brdElement.getType()) {
            case GLOB_point :
                OEF += "point " + brdElement.X() + "," + brdElement.Y() + ",black\n";
                break;
            case GLOB_ligne :
                var p1 = brdElement.point1;
                var p2 = brdElement.point2;
                /*a et b correspondent aux vecteurs de translation des deux points qui
                  correspondent à la ligne, car en OEF la primitive ligne ne fait qu'un segment,
                  on translate donc les points en dehors de la zone de dessin, pour donner
                  l'illusion d'une droite*/
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
                    p1.X() + "," + p1.Y() + "," +
                    p2.X() + "," + p2.Y() + ",black\n";
                break;
            case GLOB_arrow :
                var p1 = brdElement.point1;
                var p2 = brdElement.point2;
                OEF += "arrow " +
                    p1.X() + "," + p1.Y() + "," +
                    p2.X() + "," + p2.Y() + ",7,black\n";
                break;
            case GLOB_axe :

                /*On recupère les deux points qui définisse un axe*/
                var brd = this.brd;
                var p1 = brdElement.point1;
                var p2 = brdElement.point2;

                var l, r, t, b;
                g = bord_gauche;
                d = bord_droit;
                t = bord_haut;
                b = bord_bas;

                var gauche_vers_droite = p1.X() < p2.X();
                var top_line_tmp = brd.create("segment", [[g, t], [d, t]]);
                var bot_line_tmp = brd.create("segment", [[g, b], [d, b]]);
                var side_line_tmp;

                /*Si on va de la gauche vers la droite, le coté gauche est inutile
                 * et vice et versa.
                 */
                if (gauche_vers_droite) {
                    side_line_tmp = brd.create("segment", [[d, t], [d, b]]);
                } else {
                    side_line_tmp = brd.create("segment", [[g, t], [g, b]]);
                }
                var intersect1 = brd.create("intersection", [brdElement, top_line_tmp, 0]);
                var intersect2 = brd.create("intersection", [brdElement, bot_line_tmp, 0]);
                var intersect3 = brd.create("intersection", [brdElement, side_line_tmp, 0]);
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

                OEF += "arrow " +
                    xp1 + "," + yp1 + "," +
                    res.X() + "," + res.Y() + ",7,black\n";

                brd.removeObject(intersect1);
                brd.removeObject(intersect2);
                brd.removeObject(intersect3);
                brd.removeObject(top_line_tmp);
                brd.removeObject(bot_line_tmp);
                brd.removeObject(side_line_tmp);

                break;
            case GLOB_angle :
                var p1 = brdElement.point1;
                var p2 = brdElement.point2;
                var p3 = brdElement.point3;
                /*On crée une ligne temporaire pour obtenir l'angle de "base" à partir de l'axe X*/
                var tmpLine = this.brd.create("line", [p1, p2]);
                var valAngleAxeX = (tmpLine.getAngle() * 360) / (2 * Math.PI);
                this.brd.removeObject(tmpLine);
                var valAngle = ( brdElement.Value() * 360 ) / ( 2 * Math.PI ) + valAngleAxeX;
                OEF += "arc " +
                    p1.X() + "," + p1.Y() + "," + "1,1," + valAngleAxeX + "," + valAngle + ",black\n";
                break;
            default :
            }
        }
    }
    OEF += "}\n\\text{url" + this.nom + " = draw(200,200\n\\" + this.nom + ")}"
    return OEF;
}


/**
 * Genere le code OEF qui correspond à la partie "statement", code necessaire pour l'affichage de l'image
 */
EssaimJSXGraph.prototype.toOEFFromStatement = function (idReponse) {
    return "<img src=\"\\url" + this.nom + "\" alt=\"Erreur avec l'image " + this.nom + "\"/>";

};


/**
 * supprime une image dans le plateau
 * @param image: JSXGraph.element(image), la variable qui indique une image de JSXGraph
 */
EssaimJSXGraph.prototype.removeImage = function (image) {
    this.brd.removeObject(image)
};


/**
 * ici on definit les options du menu contextuel
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
                $.when(self.inputbox("", self.inputBoxMenu, "Nom"))
                    .done(function (nom) {
			element.name = nom;
			element.setAttribute({"withLabel":true});
                        self.brd.update()
		    })
                    .fail(function (err) {
                        alert(err)
                    })
            }
        },
	supprime:{
	    nom:"Supprimer",
	    callback: function(){
		self.removeElement(element);
		self.point = [];
	    }
	}
    };
	
    options.image = {
        resize: {
	    nom: "Changer la taille",
            callback: function () {
                $.when(self.inputbox("Entrer la largeur et la hauteur, separer par , ", self.inputBoxMenu))
                    .done(function (data) {
                        var width = parseInt(data.match(/^ *[^,]* *,/)[0].replace(/,/, ""));
                        var height = parseInt(data.match(/, *[^,]*$/)[0].replace(/,/, ""));
                        element.updateSize();
                        element.updateRenderer();
                        self.brd.fullUpdate()
                    })
            }
        },
        haut: {
            nom: "remettre en haut",
            callback: function () {
                var tmp = element;
                self.brd.removeObject(element);
                self.brd.create("image", [tmp.url, [tmp.X(), tmp.Y()], tmp.usrSize])
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
     * En changent le numéro de layer de l'image, on met l'image plus haute que les autres
     */
    this.brd.options.layer["image"] = 100;
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
 * fait apparaitre une fenêtre pour charger une image.
 * @param readSuccess
 * @param readFail
 */
EssaimJSXGraph.prototype.popupImageUploader = function (readSuccess, readFail) {
    var self = this;
    if (!FileReader) {
        var err = "A Newer Version of Browser is Required.";
        if (readFail) {
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
 * getTopUnderMouse
 * Obtenir le premier élément, à partir du texte
 * les textes sont le moins prioritaires juste dans cette fonction,
 * dont le layer n'est pas globalement modifié
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
 * buildMenu :
 * construit un menu lié a l'objet selectionné, pour le menu contextuel.
 * @param element, callback argument
 */
EssaimJSXGraph.prototype.buildMenu = function (element) {
    // Pour indiquer les options dans le menu par rapport aux types des éléments
    var buildButton = function (option) {
        return $("<input type='button' value='" + option.nom + "'/>")
            /*.html(option.nom) */
            .click(option.callback)
    };
    var options = this.menuOptions(element);
    var self = this;
    this.$menuButtons.html("");
    (function (list) {
        for (var key = 0; key < list.length; key++) {
            if (options[list[key]]) {
                var option = Object.keys(options[list[key]]);
                for (var i = 0; i < option.length; i++) {
                    self.$divMenu.append(buildButton(options[list[key]][option[i]]))
                }
            }
        }
    })(["common", element.elType])
};


/**
 * Sélectionne un objet pour le menu contextuel
 */
EssaimJSXGraph.prototype.selection = function (event) {
    var element = this.getTopUnderMouse();
    var self = this;
    /*On ne doit pas pouvoir séléctioner du text, ça n'a pas de sens...*/
    if (element.elType && element.elType !== "text"){
	var positionInputBox = {"x":event.clientX, "y":event.clientY};
	this.unsetContextMenu();
	this.inputBoxMenu
	    .css(
		{"position":"absolute",
		 "left":positionInputBox.x - 5,
		 "top":positionInputBox.y - 5,
		 "z-index":"100000"})
	    .show();
	this.$divMenu.css(
	    {"position":"absolute",
	     "left":positionInputBox.x + 5,
	     "top":positionInputBox.y + 5,
	     "border":"1px black solid",
	     "z-index":"100"
	    })
	    .click(function(){
		self.$divMenu.hide();
	    })
	    .show();
        this.buildMenu(element)
    }else{
	this.unsetContextMenu();
    }
};

/**
 * associer un évènement de souris à multi-select
 * cliquer une fois sur un élément le selectionne, une deuxième fois ça le lache
 * le bouton ok stop la multi-selection puis fait apparaitre un menu
 * le bouton effacer efface la multi-selection
 */
EssaimJSXGraph.prototype.multiSelect = function () {
    var tmp = function () {
        self.$button_libre.trigger("click");
        var element = self.getTopUnderMouse();
        if (element.elType) {
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
        for (var i = 0; i < select.length; i++) {
            html.push(select[i].elType + " " + select[i].name)
        }
        self.$selection.html(JSON.stringify(html));
    };
    this.mode = GLOB_libre;
    this.stackMultiSelect = [];
    this.brd.off("up", tmp);
    // pour eviter deux fois cliquer
    var self = this;
    // ok button
    this.$multiSelect.html("Multi-Select").show();
    this.$selection.html("").show();
    this.$multiSelectMenu.html("");
    this.$multiSelectMenu.show();
    var $ok = $("<input type='button' value ='Ok' />").appendTo(this.$multiSelect)
        .html("ok")
        .click(function (event) {
            self.brd.off("up", tmp);
            self.$button_libre.trigger("click");
            $ok.remove();
            $clean.remove();
            self.buildMultiSelectMenu()
        });
    // clean button
    var $clean = $("<input type='button' value='Effacer' />").appendTo(this.$multiSelect)
        .html("Effacer")
        .click(function () {
            self.cleanMultiSelection();
        });
    this.$selection.appendTo(/*this.divBloc*/this.$multiSelect);
    this.$multiSelectMenu.appendTo(/*this.divBloc*/this.$multiSelect);
    this.brd.on("up", tmp)
};


/**
 * construit les boutons dans le menu de multi selection.
 */
EssaimJSXGraph.prototype.buildMultiSelectMenu = function () {
    // this.stackMultiStack est le array de selection
    var menu = {};
    var self = this;
    menu.grouper = {
        nom: "Grouper",
        callback: function () {
            self.brd.create("group", self.stackMultiSelect)
        }
    };
    menu.toutsup = {
        nom: "Suppression",
        callback: function () {
            for (var i = 0; i < self.stackMultiSelect.length; i++) {
                self.brd.removeObject(self.stackMultiSelect[i])
            }
            self.brd.update()
	    self.cleanMultiSelection();
        }
    };

    menu.sauvegarder = {
	nom: "Sauvegarde",
	callback:function(){
	    self.saveSelection(self.stackMultiSelect);
	    self.cleanMultiSelection();
	}
    };
    var key = Object.keys(menu);
    var buildButton = function (option) {
        /*console.log(option);*/
        return $("<input type='button' value="+option.nom+" title=\"Permet de supprimer toute la sélection.\"/>")
            .html(option.nom)
            .click(option.callback)
    };
    for (var i = 0; i < key.length; i++) {
        self.$multiSelectMenu.append(buildButton(menu[key[i]]))
    }
    self.$multiSelectMenu.appendTo(self.$multiSelect)
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
 * Fait apparaitre une boite d'entrée utilisateur pour récuperer la valeur
 *
 * @param label - le titre du input
 * @param type - le type du input
 * @returns {*}, $.Deferred.promise()
 */
EssaimJSXGraph.prototype.inputbox = function (label, parent, hint, showButton=true, type="text") {
    /*console.log(parent);*/
    label = label || "";
    type = type || "text";
    var def = $.Deferred();
    this.inputZone.html("");
    var $box = $("<div></div>")
        .appendTo(parent);
    var $label = $("<div></div>")
        .html(label)
        .appendTo($box);
    var $input = $("<input />")
        .attr({"type":type, "placeholder":hint})
        .appendTo($box);
    var $submit = $("<input type='button' value='Valider' />")
        .html("ok")
        .click(function (event) {
            if (!$input.val() || !$input.val().length) {
                def.reject("La valeur n'est pas definie.")
            } else {
                $box.remove();
                def.resolve($input.val())
            }
        })
        .appendTo($box);
    if (!showButton){
	$submit.hide();
    }
    return def.promise()
};


/**
 * TODO
 */
EssaimJSXGraph.prototype.selectMode = function () {
    this.$button_libre.trigger("click")
};


/**
 * Fonction qui initialise les boutons qui permettent de générer des éléments sur le graphe tel que
 * des points, des lignes, etc. Cette fonction gère aussi les événements lié à ces boutons.
 *
 * @param parent - élément dans lequel viennent s'insérer tous les boutons
 */
EssaimJSXGraph.prototype.initBoutonForme = function (parent) {
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
    
    
    var $button_point = $("<input type='button' value='Point' title=\"Permet de créer un point.\"/>")
        .appendTo($div_bouton_forme)
        .click(function (event) {
            self.mode = GLOB_point;
        });

    var $button_ligne = $("<input type='button' value='Droite' title=\"Permet de créer une droite. On utilise deux points pour cela.\"/>")
        .appendTo($div_bouton_forme)
        .click(function (event) {
            self.mode = GLOB_ligne;
        });

    var $button_cercle =
        $("<input type='button' value='Cercle' title=\"Permet de créer un cercle. On utilise deux points pour cela.\"/>")
        .appendTo($div_bouton_forme)
        .click(function (event) {
            self.mode = GLOB_cercle;
        });

    var $button_segment =
        $("<input type='button' value='Segment' title=\"Permet de créer un segment. On utilise deux points pour cela.\"/>")
        .appendTo($div_bouton_forme)
        .click(function (event) {
            self.mode = GLOB_segment;
        });

    var $button_arrow =
        $("<input type='button' value='Vecteur' title=\"Permet de créer un vecteur. On utilise deux points pour cela.\"/>")
        .appendTo($div_bouton_forme)
        .click(function (event) {
            self.mode = GLOB_arrow;
        });

    var $button_axis =
        $("<input type='button' value='Axe' title=\"Permet de créer un axe. On utilise deux points pour cela.\"/>")
        .appendTo($div_bouton_forme)
        .click(function (event) {
            self.mode = GLOB_axe;
        });

    var $button_angle =
        $("<input type='button' value='Angle' title=\"Permet de créer un angle en utiliant 3 points\"/>")
        .appendTo($div_bouton_forme)
        .click(function (event) {
            self.mode = GLOB_angle;
        });
}


/**
 * Fonction qui initialise tout les boutons qui gèrent les actions que l'on peut faire dans le
 * graphe (supprimer, se mettre en mode libre, etc). Gère aussi les evenements lié à ces boutons.
 *
 * @param parent - element dans lequel viennent s'inserer tout les boutons
 */
EssaimJSXGraph.prototype.initBoutonAction = function (parent) {
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
    var $button_libre =
        $("<input type='button' value='Déplacer' title=\"Permet de déplacer des objets dans le graphe.\"/>")
        .appendTo($div_bouton_action)
        .click(function (event) {
            self.mode = GLOB_libre
        });

    /**
     * button supprimer
     * supprimer un élément en click,
     * si on clique sur un élément non valide, il va envoyer un message d'erreur,
     * si valide, il va supprimer l'élément.
     * il marche une fois et puis revient en mode selection
     * @type {*|{trigger, _default}|jQuery}
     */
    /*var $supprimer =
        $("<input type='button' value='Supprimer' title = \"Permet de supprimer un élément.\"/>")
        .appendTo($div_bouton_action)
        .click(function (event) {
            self.modeSelect(event);
            var tmp = function () {
                var element = self.getTopUnderMouse();*/
		/*console.log(element.label.coords);*/
		/*TEST = element.label.coords*/
/*                if (element.elType) {
                    self.brd.removeObject(element);
		    self.unsetContextMenu();
                } else {
                    alert("element invalide.")
                }
                self.brd.update();
                self.brd.off("up", tmp);
                self.brd.on("up", function () {
                    self.selection(event)
                })
            };
	    
            self.brd.on("up", tmp)
        });*/

    var $button_image = $("<input type='button' value='Importer image'/>")
        .appendTo($div_bouton_action)
        .click(function (event) {
            self.popupImageUploader(function (event) {
                var result = event.target.result;
                self.brd.create("image", [result, [0, 0], [5, 5]]);
                self.brd.update()
            })
        });

    var $multiselect =
        $("<input type='button' value ='Multi-select' title = \"Action de multi-sélection\" />")
        .appendTo($div_bouton_action)
        .click(function (event) {
            self.multiSelect();
        });

    var $button_switch_grille =
        $("<input type='button' value = 'Grille' title=\"Affiche/enlève la grille.\" />")
        .appendTo($div_bouton_action)
        .click(function (event) {
            self.grid = !self.grid;
            if (self.grid) {
                self.brd.removeGrids();
            } else {
                self.brd.create('grid', []);
            }
            self.brd.fullUpdate();
        });

    this.deroulant = $("<select></select>")
        .appendTo($div_bouton_action);

    var $charger = $("<input type='button' value='Charger'/>")
        .click(function (event) {
            self.loadSelection(self.deroulant.val());
        }).appendTo($div_bouton_action);

    var $save =
        $("<input type='button' value = 'Ajout dans BaD' title=\"Permet de sauvegarder des éléments du graphique dans une boite à dessin.\" />")
        .appendTo($div_bouton_action)
        .click({charge: $charger}, function (event) {
            self.saveSelection(self.brd.objects);
        });

	var $button_undo = $("<input type='button' value='Annuler' title=\"Permet d'annuler la dernière action.\" />.").appendTo($div_bouton_action).click( function(event) {
		//TODO fonction undo (annuler/retour action précédente)
	});
    EssaimJSXGraph.prototype.$button_libre = $button_libre;
}


/**
 * Fonction qui se charge d'initialiser tous les "écouteurs" d'événement,
 * comme un redimensionnement, un clic souris ou autre.
 *
 * @param $top_panel - panneau supérieur, qui nécessite un redimensionnement si un
 * redimensionnement a lieu
 * @param $left_panel - panneau latéral gauche qui nécessite un redimensionnement si un
 * redimensionnement a lieu
 */
EssaimJSXGraph.prototype.initEventListener = function ($top_panel, $left_panel) {
    var self = this;
    this.surpage.resize(function () {
        self.brd.resizeContainer(self.surpage.width() - GLOB_largeur, self.surpage.height() - GLOB_hauteur);
        $top_panel
            .css({
                "width": self.surpage.width() - GLOB_largeur,
                "height": GLOB_hauteur
            });
        $left_panel
            .css({
                "width": GLOB_largeur,
                "height": self.surpage.height()
            });
    });
    
    this.brd.on('down', function (event) {
	if (event.buttons === 1){
	    var brd = self.brd;
            var mode = self.mode;
            var coords = getMouseCoords(event, brd);
            var userCoord = brd.getUsrCoordsOfMouse(event)
	    var objet;
	    if (self.mode !== GLOB_libre) {
		var point = undefined;
		for (element in brd.objects) {
                    if (brd.objects[element].hasPoint(coords.scrCoords[1], coords.scrCoords[2]) &&
			brd.objects[element].getAttribute("visible") &&
			JXG.isPoint(brd.objects[element])) {
			point = brd.objects[element];
                    }
		    objet = brd.objects[element];
		}
		
		
		if (point === undefined) {
		    /*
		     * On différencie le cas ou on fait des points de construction, 
		     * pour faire les points plus petit
		     */
		    if (mode !== GLOB_point){
			point = brd.create("point", userCoord, {size:1});
		    }else{
			point = brd.create("point", userCoord);
		    }
		}
		
		objet = point;
		
		self.point.push(point);
		switch (mode) {
		case GLOB_point:
		    self.point = [];
		    break;
		case GLOB_ligne:
		    if (self.point.length === 2) {
			objet = brd.create(self.mode, self.point);
			self.point = [];
		    }
		    break;
		case GLOB_cercle:
		    if (self.point.length === 1) {
			self.previsualisedObject = 
			    self.brd.create(self.mode, [self.point[0], userCoord])
			
		    } else if (self.point.length === 2) {
			brd.removeObject(self.previsualisedObject);
			self.previsualisedObject = null;
			objet = brd.create(self.mode, self.point);
			self.point = [];
		    }
		    break;
		case GLOB_arrow:
		    if (self.point.length === 2) {
			objet = brd.create(self.mode, self.point);
			self.point = [];
		    }
		    break;
		case GLOB_segment:
		    if (self.point.length === 2) {
			objet = brd.create(self.mode, self.point);
			self.point = [];
		    }
		    break;
		case GLOB_axe:
		    if (self.point.length === 2) {
			objet = self.createDraggableAxis(self.point);
			self.point = [];
		    }
		    break;
		case GLOB_angle:
		    if (self.point.length === 3) {
			objet = brd.create(self.mode, self.point);
			self.point = [];
		    }
		    break;
		default:
		    console.error("Erreur de mode, le mode selectionné est incorrect");
		}
		if (self.point.length > 3) {
		    console.error("Erreur de points, trop de point en mémoire.");
		    self.point = [];
		}
		if (objet){
		    objet.on("drag", function(){
			self.mode = GLOB_libre;
			self.point = [];
			self.brd.removeObject(self.previsualisedObject);
			self.previsualisedObject = undefined;
		    });
		}
		
            }else{
		self.point = [];
	    }
	}
	point = undefined;
    });

    this.brd.on('move', function (event) {
        self.lastEvent = event;
        if (self.previsualisedObject) {
            self.previsualisedObject.point2.setPosition(JXG.COORDS_BY_USER, self.brd.getUsrCoordsOfMouse(event));
            self.brd.update();
        }
    });

    /*Fonction du menu contextuel*/
    this.brd.on("down", function (event) {
	if (event.buttons === 2){
	    self.selection(event);
	}else{
	    self.unsetContextMenu();
	}
    })
}


/**
 * Fonction qui ajoute une sauvegarde de l'élément passer en parametre
 * @param objects - Element que l'on souhaite enregistré
 */
EssaimJSXGraph.prototype.saveSelection = function (objects) {
    var objets = [];
    var self = this;
    /*console.log(objects);*/
    for (var i in objects) {
	/*console.log("Sauvegarde", getLen(objects[i].childElement), objects[i].elType);*/
	if (objects[i].elType === "point" && objects[i].getAttribute("visible")) {
	    objets.push(objects[i]);
        } else if (objects[i].elType !== "point" /*&& type.indexOf(objects[i].elType) !== -1*/) {
	    objets.push(objects[i]);
        }
    }

    $.when(this.inputbox("Entrer un nom", self.inputZone))
        .done(function (name) {
	    if (saveState[name] === undefined) {
                saveState[name] = objets;
                self.updateDeroulant();
	    } else {
                alert("Le nom " + name + " est déjà pris");
	    }
        })
        .fail(function (err) {
	    alert(err);
        })
}

/**
 * fonction qui charge l'élément selectionné
 * @param name - Nom de l'élément que l'on va charger
 */
EssaimJSXGraph.prototype.loadSelection = function (name) {
    if (saveState[name] === undefined) {
        console.error("Le nom séléctionné n'est pas définie");
    } else {
        var objets = saveState[name];
	var ancestor = {}
        for (var i in objets) {
	    if (objets[i].elType === "point") {
		if (!objets[i]){
		    ancestor[i] = this.brd.create(objets[i].elType, [objets[i].X(), objets[i].Y()], 
						  {name: objets[i].name});
		}
	    } else {
                var points = [];
                for (var j in objets[i].ancestors) {
		    var obj = objets[i].ancestors[j];
		    var tmp;
		    if (!ancestor[j]){
			ancestor[j] = this.brd.create(obj.elType, [obj.X(), obj.Y()],{name:obj.name});
		    }	    
		    points.push(ancestor[j]);
		}
		/*if (objets[i].elType === "angle"){
		    this.brd.create(objets[i].elType, [points[1], points[0], points[1]]);
		}else{
                    this.brd.create(objets[i].elType, points, {name:objets[i].name});
		}*/
		var res;
		if (objets[i].elType === "angle"){
		    /*console.log(points);*/
		    res = [points[1], points[0], points[2]];
		}else{
		    res = points
		}
		this.brd.create(objets[i].elType, res, {name:objets[i].name});
	    }
        }
    }
}

/**
 * Fonction qui met à jour le menu déroulant des sauvegarde de tout les graphes existant
 */
EssaimJSXGraph.prototype.updateDeroulant = function () {
    for (var i = 0; i < AllJSXGraph.length; i++) {
        AllJSXGraph[i].deroulant.empty();
        for (var j in saveState) {
	    $("<option>" + j + "</option>").appendTo(AllJSXGraph[i].deroulant);
        }
    }
}

/**
 *  Fonction qui reinitialise l'affichage du menu contextuel
 */
EssaimJSXGraph.prototype.unsetContextMenu = function(){
    this.$divMenu.html("<div></div>");
    this.$divMenu.hide();
    this.inputBoxMenu.html("<div></div>");
    this.inputBoxMenu.hide();
};

/**
 *Fonction qui permet de crée des axes sans grille que l'on peut déplacer.
 */
EssaimJSXGraph.prototype.createDraggableAxis = function(point){
    var self = this;
    var axis = this.brd.create(this.mode, point, {
        name: '',
        withLabel: true,
        label: {
            position: 'top'
        }
    });
    /*Sert à ne pas créer les grilles lorsque on crée un axe*/
    axis.removeAllTicks();
    axis.isDraggable = true;
    axis.on('drag', function () {
	
        self.brd.fullUpdate()
    });
    
    for (var i in axis.ancestors) {
        axis.ancestors[i].isDraggable = true;
        axis.ancestors[i].on('drag', function () {
            self.brd.fullUpdate()
        });
    }
    axis.needsRegularUpdate = true;
    this.brd.update();
    return axis;
}

/**
 * Fonction qui permet de positionner le nom d'un axe en fonction de son orientation
 * @param axis - Axe pour lequel on veut changer la position du nom de l'axe
 */
/*TODO*/
EssaimJSXGraph.prototype.setAxisNamePosition = function(axis){
    var p1 = axis.point1;
    var p2 = axis.point2;
    var coef_dir = (p1.Y() - p2.Y()) / (p1.X() - p2.X());
    if (p2.X() < p1.X()){
	if (coef_dir > 0){
	    /*axis.*/
	}else{

	}
    }else{
	if (coef_dir < 0){

	}else{

	}
    }
    this.brd.update();
}

EssaimJSXGraph.prototype.removeElement = function(element){
    for (var i in element.childElements){
	this.brd.removeObject(this.brd.objects[i]);
    }
    for (var i in element.ancestors){
	this.brd.removeObject(this.brd.objects[i]);
    }
    this.brd.removeObject(element);
    
}
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
    return Math.sqrt((p1.X() - p2.X()) * (p1.X() - p2.X()) +
		     (p1.Y() - p2.Y()) * (p1.Y() - p2.Y()));
}

/**
 * Fonction qui retourne le nombre d'element d'un objet
 * @param object - objets dont on souhaite connaitre la taille
 * @return retourne le nombre d'élément de l'objet
 */
function getLen(object) {
    // doit donner une erreur quand object est null, undefined ou pas un object
    if (object){
	var tmp = Object.keys(object).length;
    }else{
	console.error("L'objets est indéfinie");
    }
    // afin que cette valeur ne soit pas modifiable
    return -1
}

$(document).ready(function () {
    rucheSys.initClasseEssaim(EssaimJSXGraph)
});
