/*
 * Classe Code Libre (Preparation) :
 * Permet de creer un bloc code libre dans l'onglet pr�paration
 */
function CodeLibrePrepa(numero)
{
	//--------- ATTRIBUTS ---------//


	this.nom = "codeLibre" + numero; // nom de l'�l�ment
	//this.txt = ""; //
	this.proto = "CodeLibre"; // nature de l'�l�ment


	//--------- METHODES ----------//


	this.creerBloc = function()
	/*
	 * Fonction qui permet de cr�r un bloc dans l'onglet pr�paration
	 * sp�cifique pour un �l�ment de type code libre.
	 */
	{
		var bloc_pere = document.getElementById("Rid_Prep_Blocs");
		var liste = document.createElement("LI");
		liste.id = "RidPrBloc_"+this.nom;
		var barre_tache = document.createElement("DIV");
		barre_tache.className = "barre_tache_prepa"; // Pas encore utilis�
		var div_fils = document.createElement("DIV");
		var txt = document.createElement('div');
		
		txt.id = "RidPrBloc_Content_"+this.nom;
		txt.className = "Rcl_Droppable Rcl_Editor";
		txt.style.border = "1px grey solid";
		
		
		var button_latex = document.createElement("button");
		button_latex.id = "Rid_Editor_Button_Latex_"+this.nom;
		button_latex.innerHTML = "latex";
		button_latex.className = "Rcl_Editor_Button_Latex";
		button_latex.onclick=function()
		/*
		 * fonction qui permet de d�finir du code latex depuis le bloc code libre
		 *
		 */
		{
			var nom = "RidPrBloc_Content_"+this.id.slice("Rid_Editor_Button_Latex_".length,this.id.length);
			rucheSys.etiqueterTexteEnLatex(nom);
		}

		var button = document.createElement('button');
		button.id = "Rid_Button_Delete_" + this.nom;
		button.className = "Rcl_Button_Delete"
		button.onclick = function()
		/*
		 * fonction qui permet de supprimer le bloc code libre
		 *
		 */
		{
			var n = liste.id.slice("RidPrBloc_".length,liste.id.length);
			rucheSys.supprInstruction(n,rucheSys.listeBlocPrepa);
		}

		
		/*Button de deplacement vers le haut*/
		
		var buttonHaut = document.createElement('button');
		buttonHaut.id = "Rid_Button_Up_"+this.nom;
		buttonHaut.className = "Rcl_Move_Up_Arrow";
		buttonHaut.addEventListener('click', function (event)
		{
        	var li = buttonHaut.parentNode.parentNode;
        	var previous = li.previousElementSibling;
        	if (previous)
			{
            	li.parentNode.insertBefore(li, previous);
            	var nom = li.id.slice("RidPrBloc_".length,li.id.length);
            	
            	var ind = rucheSys.rechercheIndice(nom,rucheSys.listeBlocPrepa);
            	
            	var temp = rucheSys.listeBlocPrepa[ind];
            	rucheSys.listeBlocPrepa[ind] = rucheSys.listeBlocPrepa[ind-1];
            	rucheSys.listeBlocPrepa[ind-1] = temp;
    		}
    	},
    	true);

		
		/*button de deplacement vers le bas*/
		
		var buttonBas = document.createElement('button');
		buttonBas.id = "Rid_Button_Down_"+this.nom;
		buttonBas.className = "Rcl_Move_Down_Arrow";
		buttonBas.addEventListener('click', function (event)

		{ 
	        var li = buttonBas.parentNode.parentNode;
	        var next = li.nextElementSibling;
	        if (next)
			{
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

		liste.className = "Rcl_Bloc";
		div_fils.className = "Rcl_Bloc_Interne";

		div_fils.appendChild(button);
		div_fils.appendChild(buttonHaut);
		div_fils.appendChild(buttonBas);
		
		/* Barre Var et Latex */
		barre_tache.appendChild(button_latex);
		div_fils.appendChild(barre_tache);
		
		div_fils.appendChild(txt);
		liste.appendChild(div_fils);
		bloc_pere.appendChild(liste);
		
		var editeurVar = new Editeur(txt.id, rucheSys, true); //true = Pas d'�diteur principal
		rucheSys.listeEditeur.push(editeurVar);	
	}


	//---------------------------------//


	/*this.recupDonnes = function()

	{
		this.valeur = document.getElementById("RidPrBloc_Content_"+this.nom).value;
	}*/
	

	//---------------------------------//


	this.toOEF = function()
	/*
	 * Fonction qui permet de g�n�rer le code OEF obtenu grace au bloc " code libre "
	 * retourne une chaine de caract�re contenant le code OEF.
	 */
	{	
		indice = rucheSys.rechercheIndice("RidPrBloc_Content_"+this.nom,rucheSys.listeEditeur);
		rucheSys.listeEditeur[indice].recupDonneesVar();		
		return rucheSys.listeEditeur[indice].toOEF()+"\n";
	}	
}