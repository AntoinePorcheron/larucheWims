/*
 * Classe Boucle for :
 * Permet de créer un bloc d'instruction de type "boucle for".
*/

function BoucleFor(numero)
{	
	//--------- ATTRIBUTS ---------//


	this.nom = "for" + numero; // nom de l'élément
	this.proto = "BoucleFor"; // nature de la classe

	
	//--------- METHODES ----------//


	this.creerBloc = function()
	/*
	 * Fonction qui permet de créer un bloc dans l'onglet préparation
	 * spécifique pour une instruction de type "boucle for".
	 */
	{

		// Récupération des blocs et créations des nouveaux
		var bloc_pere = document.getElementById("Rid_Prep_Blocs"); 
		var liste = document.createElement("LI");
		var div_fils = document.createElement("DIV");
		liste.id = "RidPrBloc_"+this.nom;
		
		/* Modifications pour le drag and drop */
		//On gère l'envoi
		liste.draggable = true;

		liste.addEventListener('dragstart', function(e) {

        e.dataTransfer.setData('text/plain', liste.id);
        //e.dataTransfer.setDragImage(dragImg, 40, 40); // Une position de 40x40 pixels centrera l'image (de 80x80 pixels) sous le curseur
        
    	});

		//On gère la réception
    	liste.addEventListener('dragover', function(e) {
        e.preventDefault(); // Annule l'interdiction de drop
        console.log('Un élément survole la zone');
    	});

   		liste.addEventListener('drop', function(e) {
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

		var div_forDebut = document.createElement("DIV");
		div_forDebut.id = "forDebut" + this.nom;
		div_forDebut.className = "Rcl_Droppable Rcl_Mini_Editor";
		//div_forDebut.className = "Rcl_Mini_Editor";
		var div_forFin = document.createElement("DIV");
		div_forFin.id = "forFin" + this.nom;
		div_forFin.className = "Rcl_Droppable Rcl_Mini_Editor";
		//div_forFin.className = "Rcl_Mini_Editor";
		var div_forInstruction = document.createElement("DIV");
		div_forInstruction.id = "forInstruction" + this.nom;
		div_forInstruction.className = "Rcl_Droppable";
		var txt = document.createTextNode("Bloc FOR");

		var button = document.createElement('button');
		
		// Bouton pour supprimer le bloc
		button.id = "Rid_Button_Delete_" + this.nom;
		button.className = "Rcl_Button_Delete";
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
				buttonWindow.parentNode.parentNode.className = "Rcl_Bloc Rcl_Closed";
                div_forDebut.className += " Rcl_Mini_Editor_hidden";
                div_forFin.className += " Rcl_Mini_Editor_hidden";
                div_forInstruction.className += " Rcl_Mini_Editor_hidden";
			}
			else
			{
				buttonWindow.className = "";
				buttonWindow.className = "Rcl_Button_Minimize";
				buttonWindow.parentNode.parentNode.className = "";
				buttonWindow.parentNode.parentNode.className = "Rcl_Bloc";
                div_forDebut.className = div_forDebut.className.replace(" Rcl_Mini_Editor_hidden","");
                div_forFin.className = div_forFin.className.replace(" Rcl_Mini_Editor_hidden","");
                div_forInstruction.className = div_forInstruction.className.replace(" Rcl_Mini_Editor_hidden","");
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


		// Buouton d'ajout d'instruction , si l'on veut pouvoir imbriquer plusieurs blocs dans une amélioration future
		/*var buttonInstruction = document.createElement('button');
		buttonInstruction.id = "instr"+this.nom;
		buttonInstruction.className = "Rcl_Button_Delete";*/

		txt_debut = document.createTextNode("\r\nPour");
		txt_fin = document.createTextNode("\r\njusqu'à");
		txt_instruction = document.createTextNode("\r\nInstructions");

		//Ajout des éléments dans le div
		div_fils.appendChild(button);
		div_fils.appendChild(buttonWindow);
		div_fils.appendChild(buttonHaut);
		div_fils.appendChild(buttonBas);		

		div_fils.appendChild(txt_debut);
		div_fils.appendChild(div_forDebut);
		div_fils.appendChild(txt_fin);
		div_fils.appendChild(div_forFin);
		
		div_fils.appendChild(txt_instruction);
		div_fils.appendChild(div_forInstruction);

		liste.className = "Rcl_Bloc";
		div_fils.className = "Rcl_Bloc_Interne";

		liste.appendChild(div_fils);
		bloc_pere.appendChild(liste);

		//Création et ajout des éditeurs dans la liste des éditeurs
		var editeurDebut = new Editeur(div_forDebut.id,rucheSys,true);
		var editeurFin = new Editeur(div_forFin.id,rucheSys,true);
		var editeurInstruction = new Editeur(div_forInstruction.id,rucheSys,true);

		rucheSys.listeEditeur.push(editeurDebut);
		rucheSys.listeEditeur.push(editeurFin);
		rucheSys.listeEditeur.push(editeurInstruction);
	}



	//---------------------------------//


	this.toOEF = function()
	/*
	 * Fonction qui permet de générer le code OEF de l'instruction "for"
	 * retourne une chaine de caractère contenant le code OEF.
	 */
	{

		indice1 = rucheSys.rechercheIndice("forDebut"+this.nom,rucheSys.listeEditeur);
		indice2 = rucheSys.rechercheIndice("forFin"+this.nom,rucheSys.listeEditeur);
		indice3 = rucheSys.rechercheIndice("forInstruction"+this.nom,rucheSys.listeEditeur);
		rucheSys.listeEditeur[indice1].recupDonneesVar();
		rucheSys.listeEditeur[indice2].recupDonneesVar();
		rucheSys.listeEditeur[indice3].recupDonneesVar();

		var br = /<div><br><\/div>/;

		// Retrait du <br> de fin de ligne
		if (br.test(rucheSys.listeEditeur[indice1].enonce_Html) == false)
		{
			rucheSys.listeEditeur[indice1].enonce_Html = rucheSys.listeEditeur[indice1].enonce_Html.slice(0, rucheSys.listeEditeur[indice1].enonce_Html.length-6);
		};
		if (br.test(rucheSys.listeEditeur[indice2].enonce_Html) == false) {
			rucheSys.listeEditeur[indice2].enonce_Html = rucheSys.listeEditeur[indice2].enonce_Html.slice(0, rucheSys.listeEditeur[indice2].enonce_Html.length-6);
		};
		if (br.test(rucheSys.listeEditeur[indice3].enonce_Html) == false) {
			rucheSys.listeEditeur[indice3].enonce_Html = rucheSys.listeEditeur[indice3].enonce_Html.slice(0, rucheSys.listeEditeur[indice3].enonce_Html.length-6);
		};

		return "\\for{"+rucheSys.listeEditeur[indice1].toOEF()+" to "+rucheSys.listeEditeur[indice2].toOEF()+"}\n 	{"+rucheSys.listeEditeur[indice3].toOEF()+"}\n";
	}



}