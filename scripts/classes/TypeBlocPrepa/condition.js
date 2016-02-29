/*
 * Classe Condition :
 * Permet de créer un bloc d'instruction de type "condition if".
*/

function Condition(numero)
{
	//--------- ATTRIBUTS ---------//


	this.nom = "condition" + numero; // nom de l'élément
	this.proto = "Condition";	// nature de l'élément


	//--------- METHODES ---------//


	this.creerBloc = function()
	/*
	 * Fonction qui permet de créer un bloc dans l'onglet préparation
	 * spécifique pour une instruction de type "condition if".
	 */
	{

		// Récupération des blocs et créations des nouveaux
		var bloc_pere = document.getElementById("Rid_Prep_Blocs");
		var liste = document.createElement("LI");
		var div_fils = document.createElement("DIV");
		liste.id = "RidPrBloc_"+this.nom;

		var div_condition = document.createElement("DIV");
		div_condition.id = "cond" + this.nom;
		div_condition.className = "Rcl_Droppable Rcl_Mini_Editor";
		//div_condition.className += "Rcl_Mini_Editor";
		var div_conditionTrue = document.createElement("DIV");
		div_conditionTrue.id = "condT" + this.nom;
		div_conditionTrue.className = "Rcl_Droppable";
		var div_conditionFalse = document.createElement("DIV");
		div_conditionFalse.id = "condF" + this.nom;
		div_conditionFalse.className = "Rcl_Droppable";
		var txt = document.createTextNode("Bloc IF");

		// Bouton pour supprimer l'instruction if.
		var button = document.createElement('button');
		button.id = "Rid_Button_Delete_" + this.nom;
		button.className = "Rcl_Button_Delete"
		button.onclick = function()
		{
			var n = liste.id.slice("RidPrBloc_".length,liste.id.length);
			rucheSys.supprInstruction(n,rucheSys.listeBlocPrepa);
		}

		
		// Bouton pour diminuer / agrandir la fenêtre
		var buttonWindow = document.createElement('button');
		buttonWindow.className = "Rcl_Button_Minimize";
		buttonWindow.addEventListener('click', function (event)
		{ 
			if (buttonWindow.className == "Rcl_Button_Minimize") 
			{
				buttonWindow.className = "";
				buttonWindow.className = "Rcl_Button_Maximize";
				buttonWindow.parentNode.parentNode.className = "";
				buttonWindow.parentNode.parentNode.className = "Rcl_Bloc Rcl_Closed";
                //cache les zones d'edition
                div_condition.className = "Rcl_Mini_Editor_hidden";
                div_conditionTrue.className = "Rcl_Mini_Editor_hidden";
                div_conditionFalse.className = "Rcl_Mini_Editor_hidden";
			}
			else
			{
				buttonWindow.className = "";
				buttonWindow.className = "Rcl_Button_Minimize";
				buttonWindow.parentNode.parentNode.className = "";
				buttonWindow.parentNode.parentNode.className = "Rcl_Bloc";
                //reaffiche les zones d'edition
                div_condition.className = "Rcl_Droppable Rcl_Mini_Editor";
                div_conditionTrue.className = "Rcl_Droppable";
                div_conditionFalse.className = "Rcl_Droppable";
			};
		}, 
		true);

		
		// Bouton de deplacement vers le haut
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

		
		// Bouton de deplacement vers le bas		
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

		
		txt_cond = document.createTextNode("\r\nSi");
		txt_condT = document.createTextNode("\r\nalors");
		txt_condF = document.createTextNode("\r\nsinon");

		//Ajout des éléments dans le div
		div_fils.appendChild(button);
		div_fils.appendChild(buttonWindow);
		div_fils.appendChild(buttonHaut);
		div_fils.appendChild(buttonBas);

		div_fils.appendChild(txt_cond);
		div_fils.appendChild(div_condition);
		div_fils.appendChild(txt_condT);
		div_fils.appendChild(div_conditionTrue);
		div_fils.appendChild(txt_condF);
		div_fils.appendChild(div_conditionFalse);

		liste.className = "Rcl_Bloc";
		div_fils.className = "Rcl_Bloc_Interne";

		liste.appendChild(div_fils);
		bloc_pere.appendChild(liste);


		//Création et ajout des éditeurs dans la liste des éditeurs
		var editeurCond = new Editeur(div_condition.id,rucheSys,true);
		var editeurCondT = new Editeur(div_conditionTrue.id,rucheSys,true);
		var editeurCondF = new Editeur(div_conditionFalse.id,rucheSys,true);

		rucheSys.listeEditeur.push(editeurCond);
		rucheSys.listeEditeur.push(editeurCondT);
		rucheSys.listeEditeur.push(editeurCondF);
	}

	
	//---------------------------------//


	this.toOEF = function()
	/*
	 * Fonction qui permet de générer le code OEF de l'instruction "if"
	 * retourne une chaine de caractère contenant le code OEF.
	 */
	{
		indice1 = rucheSys.rechercheIndice("cond"+this.nom,rucheSys.listeEditeur);
		indice2 = rucheSys.rechercheIndice("condT"+this.nom,rucheSys.listeEditeur);
		indice3 = rucheSys.rechercheIndice("condF"+this.nom,rucheSys.listeEditeur);
		rucheSys.listeEditeur[indice1].recupDonneesVar();
		rucheSys.listeEditeur[indice2].recupDonneesVar();
		rucheSys.listeEditeur[indice3].recupDonneesVar();

		var br = /<div><br><\/div>/;

		// Retrait du <br> de fin de ligne
		if (br.test(rucheSys.listeEditeur[indice1].enonce_Html) == false)
		{
			rucheSys.listeEditeur[indice1].enonce_Html = rucheSys.listeEditeur[indice1].enonce_Html.slice(0, rucheSys.listeEditeur[indice1].enonce_Html.length-6);
		};
		if (br.test(rucheSys.listeEditeur[indice2].enonce_Html) == false)
		{
			rucheSys.listeEditeur[indice2].enonce_Html = rucheSys.listeEditeur[indice2].enonce_Html.slice(0, rucheSys.listeEditeur[indice2].enonce_Html.length-6);
		};
		if (br.test(rucheSys.listeEditeur[indice3].enonce_Html) == false)
		{
			rucheSys.listeEditeur[indice3].enonce_Html = rucheSys.listeEditeur[indice3].enonce_Html.slice(0, rucheSys.listeEditeur[indice3].enonce_Html.length-6);
		};

		return "\\if{"+rucheSys.listeEditeur[indice1].toOEF()+"}{"+rucheSys.listeEditeur[indice2].toOEF()+"}\n 	{"+rucheSys.listeEditeur[indice3].toOEF()+"}\n";
	}	

}