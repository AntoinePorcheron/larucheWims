/*
 * Classe Variable :
 * Déclare et gère les variables. 
 *
*/

function Variable(nom){

	//--------- ATTRIBUTS ---------//


	this.nom = nom;			// nom de la variable.
	this.format = null;		// type de la variable, contient les données (beurk...)
                            // à modifier en relation de classe parente-dérivée
	this.valeur = "";		// valeur de la variable
	this.proto = "Variable"; // type de la variable
    
}

Variable.prototype.zNodesAide = [];         // titres des noeuds de l'arbre d'aide (zTree)
Variable.prototype.elementsAide = [];       // contenu des aides


	//--------- METHODES ----------//


Variable.prototype.ajoutVarDansListe = function()
/*
 * Fonction qui permet d'ajouter une variable dans la liste des variables dans
 * l'onglet Enoncé ainsi que le bouton qui permet de la supprimer.
 *
 */
{
    var tab = document.getElementById('Rid_Enonce_Vars_List');
    var li = document.createElement('li');
    li.id = "RidEnVa_"+this.nom;
    
    var button = document.createElement('button');
    button.id = "Rid_Button_Delete_" + this.nom;
    button.className = "Rcl_Button_Delete";
    var txt = document.createTextNode( this.nom );
    var spantxt = document.createElement('span');
    spantxt.className = "Rcl_Surligne_Variable";
    spantxt.style.cursor = "default";
    spantxt.appendChild(txt);
    
    // bouton de suppression de variable depuis la liste des variables
    button.onclick = function(){
        var variable = li.id.slice("RidEnVa_".length,li.id.length); // On supprime le "RidEnVa_" devant le nom de la variable
        rucheSys.supprVariable(variable);
        var ind = rucheSys.rechercheIndice(variable,rucheSys.listeBlocPrepa);
        rucheSys.listeBlocPrepa.splice(ind,1);
    }
    
    // double click sur le span -> insertion dans l'éditeur principal
    spantxt.ondblclick = function(){
        var nomVar = li.id.slice("RidEnVa_".length,li.id.length); // On supprime le "RidEnVa_" devant le nom de la variable
        rucheSys.enonce.insertVariableDansEditeur(nomVar, true);
    }
    
    li.appendChild(spantxt);
    li.appendChild(button);
    tab.appendChild(li);
    
}

	
	//---------------------------------//

	
Variable.prototype.ajoutVarDansMenuListePreparation = function()
/*
 * Fonction qui permet d'ajouter une variable dans la liste des variables dans
 * l'onglet Préparation ainsi que le bouton qui permet de la supprimer.
 *
 */
{
    
    var divVar = document.getElementById('Rid_Prep_Vars');
    var div = document.createElement('div');
    var txt = document.createTextNode( this.nom );
    
    div.draggable = "true";
    div.addEventListener('dragstart', this.debutDeplacement, false);
    
    div.id = "RidPrVa_"+this.nom;
    div.appendChild(txt);
    divVar.appendChild(div);
    
}
	
	//---------------------------------//
	

Variable.prototype.ajoutVarDansMenuListeAnalyse = function()
/*
 * Fonction qui permet d'ajouter une variable dans la liste des variables dans
 * l'onglet Analyse ainsi que le bouton qui permet de la supprimer.
 *
 */
{
    
    var divVar = document.getElementById('Rid_Analyse_Vars');
    var div = document.createElement('div');
    var txt = document.createTextNode( this.nom );
    
    div.draggable = "true";
    div.addEventListener('dragstart', this.debutDeplacement, false);
    
    div.id = "RidAnVa_"+this.nom;
    div.appendChild(txt);
    
    divVar.appendChild(div);
    
}


	//---------------------------------//
	
	
Variable.prototype.debutDeplacement = function(event)
	/* 
	 * Fonction qui stocke la donnée transportée lors d'un drag and drop
	 */
	{
		event.dataTransfer.setData("texte", event.target.id);
	}
	
	
	//---------------------------------//


Variable.prototype.ajoutBlocDansPreparation = function()
/* 
 * Fonction qui permet d'ajouter le bloc correspondant au type de la variable
 * dans l'onglet préparation.
 *
 */
{
    // Création de la ligne dans la liste des blocs
    var li = $("<li>",{
               id:"RidPrBloc_"+this.nom,
               class:"Rcl_Bloc",
               draggable:"true", //on rajoute ceci pour le drag and drop
               });
    
    // Création du bloc
    var bloc = $("<div>",{
                id:"RidPrBloc_Interne_"+this.nom,
                class:"Rcl_Bloc_Interne",
                });
    
    var divEnTeteVar = $("<div>",{
                         id:"RidPrBloc_Entete_"+this.nom,
                         class:"RidPrBloc_Entete_",
                         });
    bloc.append(divEnTeteVar);
    
    // Création du bouton de choix du type de variable
    var boutonChoixType = $("<button>", {
                              id: "RidPrBloc_Choix_Type_Variable_"+this.nom,
                              class: "Rcl_Bouton_Choix_Type_Var",
                              });
    boutonChoixType.click(function() {
                          // console.log("click ! bouton choix type var");
                          // enregistre l'id bouton cliqué dans le système pour utilisation ultérieure
                          rucheSys.id_dernierMenuClic = this.id;
                          
                          // retrouve la variable à partir de l'id du bouton
                          var nomVar = this.id.slice("RidPrBloc_Choix_Type_Variable_".length,this.id.length);
                          var ind = rucheSys.rechercheIndice(nomVar,rucheSys.listeBlocPrepa);
                          var var0 = rucheSys.listeBlocPrepa[ind];
                          // on sait que dans cette classe, le premier menu (num. 1) correspond par convention au bouton composant qui vient d'être cliqué.
                          var0.menuChoixTypeToggle(this.id);
                          
                          });
    
    var txt = this.nom;
    
    // Création du div d'indication du type de variable
    var affNomType = $("<span>", {
                       id: "RidPrBloc_Nom_Type_Variable_"+this.nom,
                       class: "Rcl_Nom_Type_Variable"
                       });
    affNomType.append("non défini");

    // Création du bouton de suppression de cette variable
    var button = document.createElement('button');
    var txt = document.createTextNode( this.nom );
    button.id = "Rid_Button_Delete_" + this.nom;
    button.className = "Rcl_Button_Delete"
    // bouton de suppression des variable depuis les blocs
    button.onclick = function(){
        variable = li[0].id.slice("RidPrBloc_".length,li[0].id.length);// On supprime le "RidPrBloc_" devant le nom de la variable
        rucheSys.supprVariable(variable);
        var ind = rucheSys.rechercheIndice(variable,rucheSys.listeBlocPrepa);
        rucheSys.listeBlocPrepa.splice(ind,1);
    }

    /* Bouton pour diminuer / agrandir la fenêtre */
    var buttonWindow = document.createElement('button');
    buttonWindow.className = "Rcl_Button_Minimize";
    buttonWindow.addEventListener(	
        'click', 
        function (event) 
        { 
            if (buttonWindow.className == "Rcl_Button_Minimize")
            {
                buttonWindow.className = "";
                buttonWindow.className = "Rcl_Button_Maximize";
                buttonWindow.parentNode.parentNode.parentNode.className = "";
                buttonWindow.parentNode.parentNode.parentNode.className = "Rcl_Bloc Rcl_Closed";
            }
            else 
            {
                buttonWindow.className = "";
                buttonWindow.className = "Rcl_Button_Minimize";
                buttonWindow.parentNode.parentNode.parentNode.className = "";
                buttonWindow.parentNode.parentNode.parentNode.className = "Rcl_Bloc";
            };
        }, 
        true
    );


    /*Button de deplacement vers le haut*/
    var buttonHaut = document.createElement('button');
    buttonHaut.id = "Rid_Button_Up_"+this.nom;
    buttonHaut.className = "Rcl_Move_Up_Arrow";
    buttonHaut.addEventListener('click', function (event)
    {
        var li = buttonHaut.parentNode.parentNode.parentNode;
        var previous = li.previousElementSibling;
        if (previous) {
            li.parentNode.insertBefore(li, previous);
            var nom = li.id.slice("RidPrBloc_".length,li.id.length);
            var ind = rucheSys.rechercheIndice(nom,rucheSys.listeBlocPrepa);
            var temp = rucheSys.listeBlocPrepa[ind];
            rucheSys.listeBlocPrepa[ind] = rucheSys.listeBlocPrepa[ind-1];
            rucheSys.listeBlocPrepa[ind-1] = temp;
        }
    },true);

    
    
    /*button de deplacement vers le bas*/
    var buttonBas = document.createElement('button');
    buttonBas.id = "Rid_Button_Down_"+this.nom;
    buttonBas.className = "Rcl_Move_Down_Arrow";
    buttonBas.addEventListener('click', function (event) { 
        var li = buttonBas.parentNode.parentNode.parentNode;
        var next = li.nextElementSibling;
        if (next) {
            next = next.nextElementSibling;
            var nom = li.id.slice("RidPrBloc_".length,li.id.length);
            var ind = rucheSys.rechercheIndice(nom,rucheSys.listeBlocPrepa);
            var temp = rucheSys.listeBlocPrepa[ind];
            rucheSys.listeBlocPrepa[ind] = rucheSys.listeBlocPrepa[ind+1];
            rucheSys.listeBlocPrepa[ind+1] = temp;
        }
        li.parentNode.insertBefore(li, next);
    },
    true);

    divEnTeteVar.append(button);
    divEnTeteVar.append(buttonWindow);
    divEnTeteVar.append(buttonHaut);
    divEnTeteVar.append(buttonBas);
    divEnTeteVar.append(txt);
    divEnTeteVar.append(boutonChoixType);
    divEnTeteVar.append(affNomType);
//		bloc.appendChild(select);
    li.append(bloc);
    
    $("#Rid_Prep_Blocs").append(li);
    drag();
}

function drag(){ 
    /* Gestion du drag and drop xcvb*/
    /* Cette fonction fait en sorte que les blocs de variable soient droppables */
    var cpt =0;
    console.log('Entrée dans la fonction drag');
    console.log(cpt);
    var T_rc1_drag =document.querySelectorAll(".Rcl_Bloc");
    var rc1_drag = T_rc1_drag[T_rc1_drag.length-1]


    console.log(rc1_drag.id);
    cpt++;

    //var rc1_drag =document.querySelector("#Rid_Prep_Blocs");
   //rc1_drag.draggable = true;
    rc1_drag.addEventListener('dragstart', function(e) {

        e.dataTransfer.setData('text/plain', rc1_drag.id);
        //e.dataTransfer.setDragImage(dragImg, 40, 40); // Une position de 40x40 pixels centrera l'image (de 80x80 pixels) sous le curseur
        
    });

    //On gère la réception
    rc1_drag.addEventListener('dragover', function(e) {
        e.preventDefault(); // Annule l'interdiction de drop
        console.log('Un élément survole la zone');
    });

   rc1_drag.addEventListener('drop', function(e) {
       /*Cette fonction sert à décrire ce qui se passera pour le bloc ciblé ce qui se passera lorsqu'on lachera un objet droppable sur lui */
         
       var nomZoneIn=" "; //on va récupérer l'id du bloc reçu. 
        nomZoneIn=e.dataTransfer.getData('text/plain'); // Affiche le contenu du type MIME « text/plain »
        console.log('Données reçu : ' + nomZoneIn);
//Maintenant nous allons faire en sorte de changer de place le bloc si on passe sur le bloc avant ou après lui

       var id_drop = document.querySelector('#'+nomZoneIn); 
       //var li = buttonHaut.parentNode.parentNode;

        // On va gérer le précédent
        var previous = id_drop.previousElementSibling;//l'élément précédent le bloc droppé
        
        var next = id_drop.nextElementSibling;//l'élément suivant le bloc droppé

     var lgNext= Essaim.prototype.trouverSuivant(id_drop,this); //Permet de donner à cb de cases se trouve le bloc ciblé wxc
        var lgPrev=0;
        


        var lgPrev= Essaim.prototype.trouverPrecedent(id_drop,this);
        //var actu= id_drop;
        if(lgNext>0)
        {
            
          
            for (var i = 0; i < lgNext; i++) { //on fait faire au bloc droppé lgNext descentes vers le bas.
                
                if(next){
                    next = next.nextElementSibling;

                    console.log('Un bloc suivant a été trouvé ! Changement...');
                    id_drop.parentNode.insertBefore(id_drop, next);
                    var nom = id_drop.id.slice("RidPrBloc_".length,id_drop.id.length);
                
                    var ind = rucheSys.rechercheIndice(nom,rucheSys.listeBlocPrepa);
                
                    var temp = rucheSys.listeBlocPrepa[ind];
                    rucheSys.listeBlocPrepa[ind] = rucheSys.listeBlocPrepa[ind+1];
                    rucheSys.listeBlocPrepa[ind+1] = temp;


                }
                else
                {
                    console.log("Fin du next");
                }

                //On change visuellement la place. 
                      
            }
        }
        
       if (lgPrev) {
            for(var j=0; j< lgPrev;j++)           
            {
                if (previous) {
                    console.log('Un bloc precedent a été trouvé ! Changement...');
                    id_drop.parentNode.insertBefore(id_drop, previous);
                    var nom = id_drop.id.slice("RidPrBloc_".length,id_drop.id.length);
                
                    var ind = rucheSys.rechercheIndice(nom,rucheSys.listeBlocPrepa);
                
                    var temp = rucheSys.listeBlocPrepa[ind];
                    rucheSys.listeBlocPrepa[ind] = rucheSys.listeBlocPrepa[ind-1];
                    rucheSys.listeBlocPrepa[ind-1] = temp;
                    previous = id_drop.previousElementSibling;
                }
                else
                {
                    console.log('Pas de précédent, désolé !');
                }
            }
        }
       
        else
        {
            console.log('Ni suivant, ne précédent !***********************');
        }
           
        });

    /* Fin des modifs */
}

	//---------------------------------//

Variable.prototype.menuChoixTypeAddDiyDom = function(treeId, treeNode)
/*
 * Fonction de callback "addDiyDom" du menu zTree
 * Utilisation du plugin jquery zTree : http://www.ztree.me/
 * Personalisation de l'apparence du noeud de menu zTree
 * parametre(s) :       - treeId : id du menu zTree
 *                      - treeNode : noeud du menu
 */
{
    var spaceWidth = 20; // ajoute des espaces à chaque niveau si le noeud n'est pas de niveau 0
    var switchObj = $("#" + treeNode.tId + "_switch"), icoObj = $("#" + treeNode.tId + "_ico");
    switchObj.remove();
    icoObj.before(switchObj);
    
    if (treeNode.level > 0) {
        var spaceStr = "<span style='display: inline-block;width:" + (spaceWidth * treeNode.level)+ "px'></span>";
        switchObj.before(spaceStr);
    }
}

Variable.prototype.menuChoixTypeShow = function(parentId)
/*
 * Montre le menu déroulant du choix de type de variable (le fait apparaître).
 * parametre(s) :       - parentId : id de l'élément en dessous duquel le menu apparaît
 */
{
    var parentObj = $("#"+parentId);
    var menuOffset = parentObj.offset();
    $("#menuChoixType").parent().css({left:menuOffset.left + "px", top:menuOffset.top + parentObj.outerHeight() + "px"}).slideDown("fast");
    
    // le prochain click n'importe où fera disparaître le menu
    $("body").bind("mousedown", Variable.prototype.menuChoixTypeClicBodyCache);
}

Variable.prototype.menuChoixTypeHide = function()
/*
 * Cache tous les menus déroulants (les fait disparaître).
 */
{
    $("[id^=divMenuChoixType]").fadeOut("fast");
    $("body").unbind("mousedown", Variable.prototype.menuChoixTypeClicBodyCache);
}


Variable.prototype.menuChoixTypeToggle = function(parentId)
/*
 * Bascule l'affichage du menu déroulant du choix de type de variable
 * (le fait apparaître s'il est caché, le cache s'il est visible).
 * parametre(s) :       - parentId : id de l'élément en dessous duquel le menu apparaît
 */
{
    var menuChoixTypeVar = $("#menuChoixType");
    if (menuChoixTypeVar.is(":visible")) {
        Variable.prototype.menuChoixTypeHide();
    } else {
        Variable.prototype.menuChoixTypeShow(parentId);
    }
}

Variable.prototype.menuChoixTypeClicBodyCache = function(event)
/*
 * Cache un menu déroulant sur un click en dehors du menu.
 */
{
    // Laisse le menu si clic dedans ou sur le bouton
    if ( !(typeof $(event.target).parents(".menuContent")[0] != 'undefined' || $(event.target)[0].class == "Rcl_Bouton_Choix_Type_Var")) {
        Variable.prototype.menuChoixTypeHide(this);
    }
}

Variable.prototype.menuChoixTypePreClickMenu = function(treeId, treeNode)
/*
 * Fonction de callback "beforeClick" des menus déroulants
 * Utilisation du plugin jquery zTree : http://www.ztree.me/
 * parametre(s) :       - treeId : id du menu zTree
 *                      - treeNode : noeud du menu
 * Fonction virtuelle, doit être surchargée dans la classe fille
 */
{
    if (treeNode.isParent) {
        var zTree = $.fn.zTree.getZTreeObj(treeId);
        zTree.expandNode(treeNode);
    }
    return true;
}


Variable.prototype.menuChoixTypeClickMenu = function(event, treeId, treeNode, clickFlag)
/*
 * Fonction de callback "onClick" des menus déroulants
 * Utilisation du plugin jquery zTree : http://www.ztree.me/
 * parametre(s) :       - treeId : id du menu zTree
 *                      - treeNode : noeud du menu
 *                      - clickFlag : le noeud est sélectionné ou non (si checkbox activé). Ne nous sert pas ici
 */
{
//    console.log("click sur élément "+treeNode.id+" de menu "+treeId+", clickFlag = "+clickFlag);
    
    // Si le noeud a des enfants, ne fait rien (c'est un noeud parent, généralement une catégorie)
    if (treeNode.isParent) {
        return;
    }
    
    // cache le menu lorsqu'on a cliqué
    Variable.prototype.menuChoixTypeHide();
    
    // récupère la variable dernièrement cliquée
    var nom = rucheSys.id_dernierMenuClic.slice("RidPrBloc_Choix_Type_Variable_".length,rucheSys.id_dernierMenuClic.length);
    var indice = rucheSys.rechercheIndice(nom, rucheSys.listeVariables);
    
    $("#RidPrBloc_Nom_Type_Variable_"+nom).html(treeNode.name);
    
    if (treeNode.idTypeVar<0) {
        // Variable de type de base
        switch(treeNode.name){
                
            case "Entier":
                rucheSys.listeVariables[indice].format = new Integer();
                break;
                
            case "Réel":
                rucheSys.listeVariables[indice].format = new Float();
                break;
                
            case "Matrice":
                rucheSys.listeVariables[indice].format = new  Matrix();
                break;
                
            case "Complexe":
                rucheSys.listeVariables[indice].format = new Complex();
                break;
                
            case "Texte":
                rucheSys.listeVariables[indice].format = new Text();
                break;
                
            case "Fonction":
                rucheSys.listeVariables[indice].format = new Function();
                break;
                
            case "Autre...":
                rucheSys.listeVariables[indice].format = new Autre(nom);
                break;
                
                
            default: 
        }
        
        rucheSys.listeVariables[indice].format.creerBloc(nom);
    } else {
        // Variable de type "objet" complexe
        // Crée une nouvelle variable du bon type
        rucheSys.listeVariables[indice].format = new rucheSys.listeTypeVariable[treeNode.idTypeVar](nom);
        // Crée le bloc correspondant au type
        rucheSys.listeVariables[indice].format.creerBloc(nom);
        // Crée l'aide si besoin
        rucheSys.listeVariables[indice].format.creerAide(nom);
    }
}


    //---------------------------------//

Variable.prototype.aideInit = function(idPrecElem)
/*
 * Construction de la partie "aide" du bloc variable.
 * Cette aide vient normalement en dernière position, après les éléments
 * du bloc. Mais les classes filles peuvent mettre l'aide
 * où bon leur semble. Voir exemple dans le type de variable "dessinflydraw".
 * parametre(s) :   - idPrecElem : id de l'élément devant lequel on met le bouton d'aide
 * sortie :         - element DIV contenant l'aide
 */
{
    /* Bouton d'aide */
    if (this.format.aUneAide==true) {
        var buttonAide = document.createElement('button');
        buttonAide.id = "aideVar"+this.nom;
        buttonAide.className = "Rcl_Button_Help_Close";
        buttonAide.addEventListener('click', function (event)
                                    {
                                    var divAideNom = buttonAide.id.slice("aideVar".length,buttonAide.id.length);
                                    if (buttonAide.className == "Rcl_Button_Help_Open") {
                                    buttonAide.className = "Rcl_Button_Help_Close";
                                    $("#divAideVar"+divAideNom).toggleClass("Rcl_Help_Closed",true);
                                    //            buttonAide.parentNode.parentNode.className = "Rcl_Bloc_Essaim Rcl_Bloc Rcl_Closed";
                                    }
                                    else
                                    {
                                    buttonAide.className = "Rcl_Button_Help_Open";
                                    $("#divAideVar"+divAideNom).toggleClass("Rcl_Help_Closed",false);
                                    //            buttonAide.parentNode.parentNode.className = "";
                                    //            buttonAide.parentNode.parentNode.className = "Rcl_Bloc_Essaim Rcl_Bloc";
                                    };
                                    },
                                    true);
        // insère le bouton avant l'élément donné en entrée
        $("#"+idPrecElem).before(buttonAide);
    }
    
    
    var divAideVar = $("<div>", {
                    id: "divAideVar"+this.nom,
                    class: "Rcl_Help_Variable Rcl_Help_Closed",
                    });
    divAideVar.css("overflow","hidden");   // pour empêcher les éléments flottants
    // (le menu) de dépasser du div
    return divAideVar[0];
}

Variable.prototype.aideMenuInit = function(zNodes,elementsAide)
/*
 * Construction de la liste (menu) des éléments d'aide.
 * Utilisation du plugin jquery zTree : http://www.ztree.me/
 * parametre(s) :       - zNodes : liste des noeuds cliquables (objet JSON).
 *                                      leur id doivent être dans l'ordre 1,2,..N
 *                      - elementsAide : tableau des chaines (html) contenant les aides.
 *                                      l'ordre est le même que les noeuds zNodes
 *                                      (l'id du noeud est donné par la clé "idAide" du noeud)
 */
{
    // Initialisation des paramètres du menu zTree
    var curMenu = null, zTree_Menu = null;
    var settings = {
    view: {
				showLine: false,
				showIcon: false,
				selectedMulti: false,
				dblClickExpand: false,
				addDiyDom: this.aideAddDiyDom
    },
    data: {
				simpleData: {
                enable: true
                }
    },
    callback: {
				beforeClick: this.aidePreClickMenu,
                onClick:this.aideClickMenu
    }
    };
    
    // Si pas de liste en entrée, fabrique une liste de test
    if (typeof zNodes =='undefined')
    {
        zNodes = [
                  {idAide:1, id:1, pId:0, name:"Fonction f( .. )", open: true},
                  {idAide:2, id:2, pId:1, name:"Et nous ?"},
                  {idAide:3, id:3, pId:1, name:"Lumière dans la nuit"},
                  {idAide:4, id:4, pId:3, name:"Tilt !!!!"},
                  {idAide:5, id:5, pId:3, name:"Deuxième aide"},
                  {idAide:6, id:6, pId:5, name:"Première instance"},
                  {idAide:7, id:7, pId:1, name:"Fin..."},
                  {idAide:8, id:8, pId:1, name:"Fin 2..."},
                  {idAide:9, id:9, pId:1, name:"Fin 3..."},
                  {idAide:10, id:10, pId:1, name:"Et puis zut, pas la fin !"},
                  {idAide:11, id:11, pId:1, name:"shuffle( .. )"},
                  {idAide:12, id:12, pId:1, name:"random()"},
                  ];
    }
    
    this.zNodesAide = zNodes;
    
    if (typeof elementsAide=='undefined')
    {
        this.elementsAide = [];
        for (var i=0; i<zNodes.length; i++)
        {
            var chaineAide = "<div class=\"Rcl_Help_Title\"> Aide sur "+zNodes[i].name+"</div>";
            chaineAide += "<div>Test d'aide, l'identificateur de l'item est : "+zNodes[i].id+"</div>";
            chaineAide += "<div>Test d'aide, l'identificateur du parent de l'item est : "+zNodes[i].pId+"</div>";
            this.elementsAide.push(chaineAide);
        }
    }
    else
    {
        this.elementsAide = elementsAide;
    }
    
    // Fabrication du menu zTree
    
    var treeObj = $("<ul>", {
                    id: "aideMenuVar"+this.nom,
                    class: "ztree"
                    });
    var divAideVar = $("#divAideVar"+this.nom);
    divAideVar.prepend(treeObj);
    
    $.fn.zTree.init(treeObj, settings, this.zNodesAide);
    zTree_Menu = $.fn.zTree.getZTreeObj("aideMenuVar"+this.nom);
    curMenu = zTree_Menu.getNodes()[0];
    zTree_Menu.selectNode(curMenu);
    
    treeObj.hover(function () {
                  if (!treeObj.hasClass("showIcon")) {
                  treeObj.addClass("showIcon");
                  }
                  }, function() {
                  treeObj.removeClass("showIcon");
                  });
    
    // Affichage du premier élément
    divAideVar.append(this.elementsAide[0]);
    
}


Variable.prototype.aideAddDiyDom = function(treeId, treeNode)
/*
 * Fonction de callback "addDiyDom" du menu zTree
 * Utilisation du plugin jquery zTree : http://www.ztree.me/
 * Personalisation de l'apparence du noeud de menu zTree
 * parametre(s) :       - treeId : id du menu zTree
 *                      - treeNode : noeud du menu
 */
{
    var spaceWidth = 20; // ajoute des espaces à chaque niveau si le noeud n'est pas de niveau 0
    var switchObj = $("#" + treeNode.tId + "_switch"), icoObj = $("#" + treeNode.tId + "_ico");
    switchObj.remove();
    icoObj.before(switchObj);
    
    if (treeNode.level > 0) {
        var spaceStr = "<span style='display: inline-block;width:" + (spaceWidth * treeNode.level)+ "px'></span>";
        switchObj.before(spaceStr);
    }
}

Variable.prototype.aidePreClickMenu = function(treeId, treeNode)
/*
 * Fonction de callback "beforeClick" du menu zTree
 * Utilisation du plugin jquery zTree : http://www.ztree.me/
 * Extension des menus qui ont des fils si on clique SUR L'ITEM
 * et pas seulement sur le triangle
 * parametre(s) :       - treeId : id du menu zTree
 *                      - treeNode : noeud du menu
 */
{
    if (treeNode.isParent) {
        var zTree = $.fn.zTree.getZTreeObj(treeId);
        zTree.expandNode(treeNode);
    }
    return true;
}

Variable.prototype.aideClickMenu = function(event, treeId, treeNode, clickFlag)
/*
 * Fonction de callback "onClick" du menu zTree
 * Utilisation du plugin jquery zTree : http://www.ztree.me/
 * Affiche l'aide si clique sur le menu
 * parametre(s) :       - treeId : id du menu zTree
 *                      - treeNode : noeud du menu
 */
{
    //    console.log("click sur élément "+treeNode.id+" de menu "+treeId);
    var nomVariable = treeId.slice("aideMenuVar".length,treeId.length);
    var ind = rucheSys.rechercheIndice(nomVariable,rucheSys.listeBlocPrepa);
    var variable = rucheSys.listeBlocPrepa[ind];
    $("#"+treeId).nextAll().remove();
    $("#"+treeId).parent().append(variable.elementsAide[treeNode.idAide-1]);
}

    //----------------------------//


Variable.prototype.charge = function(elem)
	/*
	 * Fonction qui permet de charger la variable en fonction de son type.
	 * Paramètre : - elem : objet JSON contenant l'objet Variable à charger.
	 */
	{
		var indice = rucheSys.rechercheIndice(elem.nom, rucheSys.listeVariables);
		var element_select = $("#RidPrBloc_Nom_Type_Variable_"+this.nom);
		if (elem.format != null) {
			switch(elem.format.nom){

				case "integer":
					rucheSys.listeVariables[indice].format = new Integer();
					element_select.html("Entier");
					break;

				case "real":
					rucheSys.listeVariables[indice].format = new Float();
					element_select.html("Réel");
					break;

				case "matrix":
					rucheSys.listeVariables[indice].format = new  Matrix();
					element_select.html("Matrice");
					break;

				case "complex":
					rucheSys.listeVariables[indice].format = new Complex();
					element_select.html("Complexe");
					break;

				case "text":
					rucheSys.listeVariables[indice].format = new Text();
					element_select.html("Texte");
					break;

				case "function":
					rucheSys.listeVariables[indice].format = new Function();
					element_select.html("Fonction");
					break;

				case "autre":
					rucheSys.listeVariables[indice].format = new Autre(elem.nom);
					element_select.html("Autre");

					break;

				default: 
					console.log("Erreur d'initialisation d'une variable");
				}
			this.format.creerBloc(elem.nom,elem.format.valeur);
		}


	}

	//-----------------------------------//

Variable.prototype.recupDonnees = function()
	/*
	 * Fonction qui permet de récupérer la valeur donnée à notre variable.
	 *
	 */
	{
		this.valeur = document.getElementById("RidPrBloc_Content_"+this.nom).value;		
	}


	//---------------------------------//


Variable.prototype.toOEF = function()
	/*
	 * Fonction qui permet de générer le code OEF de la variable.
	 *
	 */
	{

		if (this.format == null) {
			return "*** Vous n'avez pas donné de type à votre variable : "+this.nom+". ***\n";
		}
		else if (this.format.proto == "base_var") {
			
			indice = rucheSys.rechercheIndice("RidPrBloc_Content_"+this.nom,rucheSys.listeEditeur);

			rucheSys.listeEditeur[indice].recupDonneesVar();

            var editeurVersOEF = rucheSys.listeEditeur[indice].toOEF();
			if (editeurVersOEF == "" || editeurVersOEF == "undefined")
			{
				return "*** Vous n'avez pas attribué de valeur à votre variable : "+this.nom+". ***\n";
			}
			
			if (this.format.nom == "autre")
			{
				var typ = this.format.recupTyp();
				var result = "\\" + typ + "{ " + this.nom +" = "+editeurVersOEF+" } \n";
                return result;
			} 
			else
			{
				var result = "\\" + this.format.nom + "{ " + this.nom +" = "+editeurVersOEF+" } \n";
				return result;
			}
			
		}
        else return this.format.toOEF();
	}