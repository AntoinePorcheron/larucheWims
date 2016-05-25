/*
 * Classe Boucle for :
 * Permet de créer un bloc d'instruction de type "boucle for".
*/

function BoucleFor(numero)
{	
	//--------- ATTRIBUTS ---------//

    
	this.nom = "for" + numero; // nom de l'élément
	this.proto = "BoucleFor"; // nature de la classe
    
    /* On prépare pour le bloc dans bloc */
        
    //this.blocContenu = []; // liste des blocs contenus
    this.hidden = false; // dit si le bloc doit être caché ou non
    this.blocLie=null; //Si il y a un bloc dans le bloc inséré dans le champs instructions
	
	//--------- METHODES ----------//


	this.creerBloc = function()
	/*
	 * Fonction qui permet de créer un bloc dans l'onglet préparation
	 * spécifique pour une instruction de type "boucle for".
	 */
	{
        console.log("Entrée dans creerBloc (spec)");
        
        
        
        
        
		// Récupération des blocs et créations des nouveaux
        
		var bloc_pere = document.getElementById("Rid_Prep_Blocs"); 
		var liste = document.createElement("LI");
		var div_fils = document.createElement("DIV");
        var div_blocDansBloc = document.createElement("DIV");
        var div_appartenanceBloc = document.createElement("DIV");
        var div_blocPossede = document.createElement("DIV");
		liste.id = "RidPrBloc_"+this.nom;
        var posDrag = document.createAttribute("posdrag");
        
        
        posDrag.value=0;
        bloc_pere.setAttributeNode(posDrag);
		
		/* Modifications pour le drag and drop */
		//On gère l'envoi
		liste.draggable = true;

		liste.addEventListener('dragstart', function(e) {
            if(bloc_pere.getAttribute("posdrag")==0){
                    bloc_pere.setAttribute("posdrag",""+e.clientY);
                }
        e.dataTransfer.setData('text/plain', liste.id);
        //e.dataTransfer.setDragImage(dragImg, 40, 40); // Une position de 40x40 pixels centrera l'image (de 80x80 pixels) sous le curseur
        
    	});
        
        // On gère le changement d'apparence entre les deux fonctions. 
    
        liste.addEventListener('dragleave', function(e) {
             //Lorsqu'on sort d'une zone de drop.
            this.style.borderBottom="";     
            this.style.borderTop="";
            console.log('Sortie de zone');
         });
    
		//On gère la réception
        liste.addEventListener('dragover', function(e) {
        e.preventDefault(); // Annule l'interdiction de drop
        if(e!=this)
            {
                console.log("start : "+bloc_pere.getAttribute("posdrag"));
                    console.log("over : "+e.clientY);
                    if(bloc_pere.getAttribute("posdrag")<e.clientY)
                    {
                        this.style.borderBottom="2px dotted red";
                    }
                    else
                    {
                        this.style.borderTop="2px dotted red";
                    }
            }
        });

   		liste.addEventListener('drop', function(e) {
        /*Cette fonction sert à décrire ce qui se passera pour le bloc ciblé ce qui se passera lorsqu'on lachera un objet droppable sur lui */
        
            this.style.borderBottom="";      
            this.style.borderTop="";
            if(bloc_pere.getAttribute("posdrag")!=""+0){
            bloc_pere.setAttribute("posdrag",0);
        }
            
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
        buttonWindow.id="Rid_Button_MiniMaxi_"+this.nom;
		buttonWindow.className = "Rcl_Button_Minimize";
		buttonWindow.addEventListener('click', function (event) 
		{ 
			if (buttonWindow.className == "Rcl_Button_Minimize")
			{
				buttonWindow.className = "";
				buttonWindow.className = "Rcl_Button_Maximize";
				buttonWindow.parentNode.parentNode.className = "Rcl_Closed";
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
        txt_Bloc = document.createTextNode("Glisser un bloc ci-dessous pour l'insérer");
        txt_Appartenance = document.createTextNode("");

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
        div_appartenanceBloc.appendChild(txt_Appartenance);
        div_blocPossede.appendChild(txt_Appartenance);
		div_fils.appendChild(div_forInstruction);
       

		liste.className = "Rcl_Bloc";
		div_fils.className = "Rcl_Bloc_Interne";
		div_blocDansBloc.className = "Rcl_Bloc_Interne";
        div_appartenanceBloc.className = "Rcl_Bloc_Interne_appartenance";
        div_appartenanceBloc.id = "indicAppartenance"+this.nom;
        div_blocPossede.className = "Rcl_Bloc_Interne_estDansBloc";
        div_blocPossede.id = "dansBloc_"+liste.id;
        
		liste.appendChild(div_fils);
        liste.appendChild(div_blocPossede);
        liste.appendChild(div_appartenanceBloc);
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
    
    this.integrerBlocDansBloc = function(idBlocDrop,idEditeur)
    /* Cette méthode permet d'intégrer un bloc dans ce bloc
    INPUT : 
    idEditeur = id de l'éditeur sur lequel l'objet this a été droppé
    */
    {
        
        alert('Dans la fonction blocDansBloc de FOR');
        var nomBlocIntegre = this.nom;
        var BlocIntegre = getElementById("idBlocDrop");
        var codeVisuel; //le code que l'on va intégrer dans le code pour le visuel
        var numBlocRecepteur=idEditeur.replace("forInstructionfor",""); // On garde juste le numéro du bloc si c'est un bloc for
        console.log("Numéro de bloc :",numBlocRecepteur);
        
       // this.blocContenu.push(BlocIntegre);// on ajoute le bloc récupéré au tableau
        
        BlocIntegre.hidden = true; // on rend le blocIntegre invisible.
        
        /*for(var i=0; i< this.blocContenu.length; i++)
            {
                var blocTmp=this.blocContenu[i];
                codeVisuel= codeVisuel+blocTmp.innerHTML.replace(/<button.*<\/button>/,"");
                    
                
            }*/
        
        this.blocLie =BlocIntegre;
        codeVisuel = this.blocLie.innerHTML.replace(/<button.*<\/button>/,"");
        
        document.getElementById("indicAppartenancefor"+list.id).innerHTML=codeVisuel;
        
        
        document.getElementById("dansBloc_"+numBlocRecepteur).innerHTML=txtInfo;
        //BlocIntegre.innerHTML.replace(/<div.*<\/div>,"");
        BlocIntegre.innerHTML=" ";
        
    }
    
    this.setblocLie = function(blocAbsorbe)
    {
        this.blocLie = blocAbsorbe; 
    }
    
    this.reduireBloc = function()
    {
        console.log(this.nom);
        if(document.getElementById("Rid_Button_MiniMaxi_"+this.nom).className=="Rcl_Button_Minimize")
        {
            document.getElementById("RidPrBloc_"+this.nom).className="Rcl_Closed";
            document.getElementById("Rid_Button_MiniMaxi_"+this.nom).className="Rcl_Button_Maximize";
            document.getElementById("forDebut" + this.nom).className += " Rcl_Mini_Editor_hidden";
            document.getElementById("forFin" + this.nom).className += " Rcl_Mini_Editor_hidden";
            document.getElementById("forInstruction" + this.nom).className += " Rcl_Mini_Editor_hidden";
        }
    }
    
    this.agrandirBloc = function()
    {
        if(document.getElementById("Rid_Button_MiniMaxi_"+this.nom).className=="Rcl_Button_Maximize")
        {
            document.getElementById("Rid_Button_MiniMaxi_"+this.nom).className= "Rcl_Button_Minimize";
            document.getElementById("RidPrBloc_"+this.nom).className = "Rcl_Bloc";
            document.getElementById("forDebut" + this.nom).className=document.getElementById("forDebut" + this.nom).className.replace(" Rcl_Mini_Editor_hidden","");
            document.getElementById("forFin" + this.nom).className=document.getElementById("forFin" + this.nom).className.replace(" Rcl_Mini_Editor_hidden","");
            document.getElementById("forInstruction" + this.nom).className=document.getElementById("forInstruction" + this.nom).className.replace(" Rcl_Mini_Editor_hidden","");
        }
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
        
        console.log("FONCTION TO OEF : VALEUR DE BDB = "+this.blocLie);
        if(this.blocLie != null){ // si il y a un bloc inclus on ajoute son toOEF au tout.
            console.log("1er if de OEF");
            return "\\for{"+rucheSys.listeEditeur[indice1].toOEF()+" to "+rucheSys.listeEditeur[indice2].toOEF()+"}\n 	{ 1erif "+this.blocLie.toOEF()+"}\n";
        }
        else {
                console.log("2er if de OEF");
		          return "\\for{"+rucheSys.listeEditeur[indice1].toOEF()+" to "+rucheSys.listeEditeur[indice2].toOEF()+"2eme if}\n 	{"+rucheSys.listeEditeur[indice3].toOEF()+"}\n";
        }
	}
    
    
        
        
        
        
        
        
        
        
        // On va rechercher l'objet bloc auxquel appartient l'éditeur
        
        // On va intégrer le nom du bloc posé sur le bloc qu'on viens de récupérer
        
       // blocCible.div_fils.appendChild(nomBlocIntegre);
        
        // On va maintenant afficher dans le bloc qu'on viens d'insérer un champs tete spécifiant qu'il a été intégré dans un autre bloc
        
        // Et enfin, intégrer l'encapsulation au sein même du code. 
        
    
    this.setIndicAppartenance = function(txtAMaj)
    /* Cette fonction permet d'écrire un nouveau texte indicatif pour montrer quand un bloc for est intégré dans un autre bloc.
    INPUT :
    - txtAMaj : le texte qu'on veux insérer dans la fonction.
    */
    {
        txtAMaj=document.getElementById("indicAppartenance"+this.nom);
    }
    
    



}


