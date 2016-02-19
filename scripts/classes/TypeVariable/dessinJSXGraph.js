/*
* Types de variables de dessin JSXGraph
* Classe fille de la classe "TypeVariable"
* Un objet "variable" contiendra un objet représentant le type
* Ceci permet de modifier le type d'une variable à la volée
*/

DessinJSXGraph = function(nom){

    // ------ ATTRIBUTS   ----- //

    this.nom = nom;
    this.valeur = "";
    this.proto = "DessinJSXGraph";

    this.parametres = [];
}

DessinJSXGraph.prototype = Object.create(TypeVariable.prototype);
DessinJSXGraph.prototype.constructor = DessinJSXGraph;

DessinJSXGraph.prototype.proto = "DessinJSXGraph";
DessinJSXGraph.prototype.nomAffiche = "dessin JSXGraph";
DessinJSXGraph.prototype.gereDessinEnonce = true;
DessinJSXGraph.prototype.champs = [];
DessinJSXGraph.prototype.aUneAide = false;

DessinJSXGraph.prototype.aide = "Aide sur les dessins JSXGraph";

DessinJSXGraph.prototype.categorieObjet = "Dessin";

DessinJSXGraph.prototype.categorieMatiere = "";

DessinJSXGraph.prototype.categorieSection = "";


//----- METHODES -----//

DessinJSXGraph.prototype.creerBloc = function(nom)
{
    TypeVariable.prototype.creerBloc(nom);

    var divBloc = $("#RidPrBloc_Interne_"+nom);
    divBloc.append("<div>");

    var div_editJSXGraph = document.createElement("DIV");
    div_editJSXGraph.id = "editJSXGraph" + nom;
    div_editJSXGraph.classeName = "Rcl_Droppable";
    /*
    var div_justif = document.createElment("DIV");
    var div_justifi1 = document.createElement("DIV");

    divBloc.append("<span>\r\nLargeur du dessin (en pixels) : <span>");
    divBloc.append(*/

    /*TODO
     *
     * Inclure bloc
     */
}


DessinJSXGraph.prototype.creerAide = function(nom){
    /*Aide jsxgraph*/
}

DessinJSXGraph.prototype.htmlDessinsEnnonce = function(){
    /*TODO*/
    return "<img></img>";
}

DessinJSXGraph.prototype.chargeEtat = function(elem){
    
}

DessinJSXGraph.prototype.recupDonnees = function(){
    
}

DessinJSXGraph.prototype.toOEF = function(){
    /*TODO : Construire le code oef*/
}

DessinJSXGraph.prototype.toOEFFromStatement = function(){
    /*TODO*/
}

$(document).ready(function(){
    rucheSys.initClasseTypeVariable(DessinJSXGraph);
});
