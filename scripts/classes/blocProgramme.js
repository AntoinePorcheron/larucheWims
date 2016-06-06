/*
 * Classe parente pour tous les blocs de programme
 * Un BlocProgramme est un ensemble d'instructions sous forme de bloc
 * Il peut être déplacé dans la partie "préparation"
 * TODO : également dans la partie analyse
 * Il faut faire dériver un bloc programme spécifique comme
 *    - définition de variable
 *    - boucle, si/alors, etc...
 *    - essaim
 *    - ...
 */

BlocProgramme = function(num)
{
    //--------- ATTRIBUTS ---------//
    
    this.nom = "BlocProgramme"+num;    // nom de ce BlocProgramme
    this.numero = num;          // numéro de cet BlocProgramme parmi les BlocProgrammes de l'exercice
    this.proto = "BlocProgramme";      // nature de la classe parente
};

BlocProgramme.prototype.proto = "BlocProgramme"; // nature de la classe parente

BlocProgramme.prototype.idParent = "Rid_Prep_Blocs"; // id du parent dans le DOM
BlocProgramme.prototype.idLIPrefixe = "RidPrBloc_"; // prefixe de l'id du <LI> de ce bloc dans le DOM
BlocProgramme.prototype.idDIVPrefixe = "RidPrBloc_Interne_"; // prefixe de l'id du <DIV> de ce bloc dans le DOM
BlocProgramme.prototype.idEntetePrefixe = "RidPrBloc_Entete_"; // prefixe de l'id du <DIV> de ce bloc dans le DOM
BlocProgramme.prototype.liBloc = null;
BlocProgramme.prototype.divBloc = null;
BlocProgramme.prototype.divEntete = null;

    //--------- METHODES ----------//
        

BlocProgramme.prototype.initBloc = function()
/*
 * Initialisation d'un BlocProgramme.
 * crée le bloc vide dans l'onglet préparation.
 * crée les boutons de suppression/déplacement/...
 */
{
    var bloc_pere = document.getElementById(this.idParent);
    
    // Création de la ligne dans la liste des blocs
    this.liBloc = $("<li>",{
               id:this.idLIPrefixe+this.nom,
               class:"Rcl_Bloc",
               draggable:"true", //on rajoute ceci pour le drag and drop
               });
    
    // Création du bloc
    this.divBloc = $("<div>",{
                 id:this.idDIVPrefixe+this.nom,
                 class:"Rcl_Bloc_Interne",
                 });
    
    this.divEntete = $("<div>",{
                         id:this.idEntetePrefixe+this.nom,
                         class:"RidPrBloc_Entete_",
                         });
    
    this.divBloc.append(this.divEntete);
    
    
    /* Bouton de suppression */
    var buttonSuppr = document.createElement('button');
    buttonSuppr.id = "Rid_Button_Delete_" + this.nom;
    buttonSuppr.className = "Rcl_Button_Delete";
    buttonSuppr.addEventListener('click', function (event)
    {
        BlocProgramme.supprime.call(this,event); // garde le contexte de la "closure"
    }

    // Bouton pour diminuer / agrandir la fenêtre
    var buttonWindow = document.createElement('button');
    buttonWindow.id ="Rid_Button_MiniMaxi_"+this.nom;
    buttonWindow.className = "Rcl_Button_Minimize";
    buttonWindow.addEventListener('click', function (event)
    {
        BlocProgramme.minimise.call(this,event); // garde le contexte de la "closure"
    },
    true);
    
    /* Bouton de deplacement vers le haut*/
    var buttonHaut = document.createElement('button');
    buttonHaut.id = "Rid_Button_Up_"+this.nom;
    buttonHaut.className = "Rcl_Move_Up_Arrow";
    buttonHaut.addEventListener('click', function (event)
    {
        BlocProgramme.deplaceHaut.call(this,event); // garde le contexte de la "closure"
    },
    true);
    
    /* Bouton de deplacement vers le bas*/
    var buttonBas = document.createElement('button');
    buttonBas.id = "Rid_Button_Down_"+this.nom;
    buttonBas.className = "Rcl_Move_Down_Arrow";
    buttonBas.addEventListener('click', function (event)
    {
        BlocProgramme.deplaceBas.call(this,event); // garde le contexte de la "closure"
    },
    true);
        
    // Fabrication du contenu du bloc
    
    this.divEntete.appendChild(buttonSuppr);
    this.divEntete.appendChild(buttonWindow);
    this.divEntete.appendChild(buttonHaut);
    this.divEntete.appendChild(buttonBas);

    this.liBloc.appendChild(this.divBloc);
    bloc_pere.appendChild(this.liBloc);
}

BlocProgramme.prototype.supprime = function(event)
/*
 * Méthode de suppresion du bloc programme
 * appelée par un click sur le bouton de suppression
 * doit être surchargée dans les objets dérivés
 * appelée avec le contexte de BlocProgramme.prototype.initBloc
 * donc éléments disponibles :
 *     - this.liBloc = element <li> qui contient le bouton
 *     - this.divBloc = element <div> qui contient le bouton
 */
{
    /* Exemple (dans la classe dérivée "Variable") :
     var nomVar = this.liBloc.id.slice("RidPrBloc_".length,this.liBloc.id.length);// On supprime le "RidPrBloc_" devant le nom de la variable
     rucheSys.supprVariable(nomVar);
     var ind = rucheSys.rechercheIndice(nomVar,rucheSys.listeBlocPrepa);
     rucheSys.listeBlocPrepa.splice(ind,1);
     */
}

BlocProgramme.prototype.minimise = function(event)
/*
 * Minimisation du bloc programme
 * appelée par un click sur le bouton "minimisation"
 * doit être surchargée dans les objets dérivés
 * appelée avec le contexte de BlocProgramme.prototype.initBloc
 * donc éléments disponibles :
 *     - this.liBloc = element <li> qui contient le bouton
 *     - this.divBloc = element <div> qui contient le bouton
 */
{
   /* Exemple (dans la classe dérivée "Variable") :
   */
}
                                 

BlocProgramme.prototype.deplaceHaut = function(event)
/*
 * Déplacement du bloc programme vers le haut
 * appelée par un click sur le bouton "haut"
 * doit être surchargée dans les objets dérivés
 * appelée avec le contexte de BlocProgramme.prototype.initBloc
 * donc éléments disponibles :
 *     - this.liBloc = element <li> qui contient le bouton
 *     - this.divBloc = element <div> qui contient le bouton
 */
{
    /* Exemple (dans la classe dérivée "Variable") :
     */
}

BlocProgramme.prototype.deplaceBas = function(event)
/*
 * Déplacement du bloc programme vers le bas
 * appelée par un click sur le bouton "bas"
 * doit être surchargée dans les objets dérivés
 * appelée avec le contexte de BlocProgramme.prototype.initBloc
 * donc éléments disponibles :
 *     - this.liBloc = element <li> qui contient le bouton
 *     - this.divBloc = element <div> qui contient le bouton
 */
{
    /* Exemple (dans la classe dérivée "Variable") :
     */
}

BlocProgramme.prototype.creerBloc = function(dataRecup)
/*
 * Méthode qui permet de créer un bloc programme dans l'onglet préparation
 * fonction générique, ne crée "que" le div cadre,
 * les boutons de suppression, déplacement du bloc, etc...
 * à utiliser dans le bloc programme dérivé
 * dataRecup : contient l'élément éventuel sauvegardé
 */
{
    this.initBloc();
    
    var titreBloc = document.createElement("DIV");
    var txt = document.createTextNode("Bloc programme virtuel");
    titreBloc.appendChild(txt);
    titreBloc.style.textAlign="center";

    this.divBloc.appendChild(titreBloc);
}


BlocProgramme.prototype.detruitBloc = function()
/*
 * Destruction du bloc et de toutes les dépendances (boutons, réponses...)
 *
 * *********** ATTENTION : si d'autres variables sont définies par la classe fille,
 * ***********             les détruire dans celle-ci  ********
 *
 *
 */
{
    rucheSys.supprInstruction(this.nom,rucheSys.listeBlocPrepa);
    this.supprime();
}

//---------------------------------//
    
BlocProgramme.prototype.reduireBloc = function()
{
    console.log(this.nom);
    if(document.getElementById("Rid_Button_MiniMaxi_"+this.nom).className=="Rcl_Button_Minimize")
    {
        document.getElementById("RidPrBloc_"+this.nom).className = "Rcl_Closed";
        document.getElementById("Rid_Button_MiniMaxi_"+this.nom).className="Rcl_Button_Maximize";
        
    }
}

BlocProgramme.prototype.agrandirBloc =function()
{
    if(document.getElementById("Rid_Button_MiniMaxi_"+this.nom).className=="Rcl_Button_Maximize")
        {
            document.getElementById("Rid_Button_MiniMaxi_"+this.nom).className= "Rcl_Button_Minimize";
            document.getElementById("RidPrBloc_"+this.nom).className = "Rcl_Bloc";
        }
}




	//---------------------------------//


BlocProgramme.prototype.toOEF = function()
/*
 * Fonction qui permet de générer le code OEF de l'BlocProgramme, partie préparation
 * retourne une chaine de caractère contenant le code OEF.
 * fonction générique.
 * Voir dans l'BlocProgramme "QCM" l'exemple d'une surcharge de cette fonction
 */
{
    
    // Construit le code OEF
    var codePrepBlocProgramme = "\n// Code envoyé par le bloc programme virtuel "+this.nom+"\n";
    
    return codePrepBlocProgramme;
}

BlocProgramme.prototype.toOEFFromStatement = function(idReponse)
/*
 * Fonction qui permet de générer le code OEF correspondant
 * à l'action du bloc programme dans le statement.
 * paramètre(s) :    - idReponse = "reponseXXX" où XXX est le numéro (donc l'ordre) de la réponse
 * retourne une chaine de caractère contenant le code OEF.
 * fonction générique.
 * fonction surchargée dans les objets dérivés
 */
{
    
    // Construit le code OEF
    
    var codePrepBlocProgramme = "<div>Sortie du bloc programme "+this.nom+" dans l'énoncé</div>";
    
    // Construit le numéro de la réponse gérée par l'BlocProgramme dans l'ordre d'apparition (ordre dans l'analyse)
    var numeroReponse = $("#RidAnBlocRep_"+this.nom).index()+1;
    
    codePrepBlocProgramme += "<div>Le bloc programme "+this.nom+" gère la réponse "+numeroReponse+"</div>";
    
    return codePrepBlocProgramme;
}

BlocProgramme.prototype.toOEFFromAnswer = function()
/*
 * Fonction qui permet de générer le code OEF correspondant
 * à la réponse gérée par l'BlocProgramme dans l'analyse
 * retourne une chaine de caractères contenant le code OEF.
 * fonction générique.
 * Voir dans l'BlocProgramme "QCM" l'exemple d'une surcharge de cette fonction
 */
{
    
    // Construit le code OEF
    
    var codePrepBlocProgramme = "\n// Code OEF de la réponse gérée par le bloc programme "+this.nom+"\n";
//    codePrepBlocProgramme += "answer{}{}{}{}";
    
    return codePrepBlocProgramme;
}

BlocProgramme.prototype.trouverSuivant = function(source,cible)
/* 
* Pour le drag and drop 
* Sert à trouver si le bloc pointé suit le bloc source, et renvoie la longueur à laquelle il se trouve si il est bien suivant.
* Paramètres : 
* - source : Le bloc qu'on drag sur un autre bloc
* - cible : le bloc sur lequel on relache le bloc dragué
*/
{        
    var cpt = 0;
    var next = source;
    var trouve = false;

    while(next != null && !trouve)
    {
        next = next.nextElementSibling;//l'élément suivant le bloc droppé
        cpt++;
        if (next==cible)
         {
            trouve = true;
         }

    }

    //cpt++;

    if (!trouve)
    {
        cpt =0;
    }
    console.log("Le bloc visé et de "+cpt+" bloc après.")

    return cpt;
}

BlocProgramme.prototype.trouverPrecedent = function(source,cible)
/* 
* Pour le drag and drop 
* Sert à trouver si le bloc pointé precede le bloc source, et renvoi le nombre de bloc à laquelle il se trouve si il est bien precedent.
* Paramètres : 
* - source : Le bloc qu'on drag sur un autre bloc
* - cible : le bloc sur lequel on relache le bloc dragué
*/
{        
    var cpt = 0;
    var prev = source;
    var trouve = false;

    while(prev != null && !trouve)
    {
        //next = next.nextElementSibling;//l'élément suivant le bloc droppé
        prev = prev.previousElementSibling;
        cpt++;
        if (prev==cible)
         {
            trouve = true;
         }

    }

    if (!trouve)
    {
        cpt =0;
    }
    console.log("Le bloc visé et de "+cpt+" bloc avant.")

    return cpt;
}
