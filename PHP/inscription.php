<!DOCTYPE html>
<html>
<head>
    <meta charset=utf-8 />
    <title>Pictionnary - Inscription</title>
	<link rel="stylesheet" media="screen" href="css/styles.css" >
</head>
<body>

<h2>Inscrivez-vous</h2>
<form class="inscription" action="req_inscription.php" method="post" name="inscription">
    <!-- c'est quoi les attributs action et method ? action renvoie à la page qui va traiter les données envoyées et method donne la façon d'envoyer les données-->
    <!-- qu'y a-t-il d'autre comme possiblité que post pour l'attribut method ? GET-->
    <span class="required_notification">Les champs obligatoires sont indiqués par *</span>
    <ul>
        </li>
        <li>
            <label for="email">E-mail :</label>
            <input type="email" name="email" id="email" autofocus="true" required="true"  placeholder="Entrez votre email"/>
            <!-- quelle est la différence entre les attributs name et id ? -->
            <!-- c'est lequel qui doit être égal à l'attribut for du label ? -->
            <span class="form_hint">Format attendu "name@something.com"</span>
        </li>
        <li>
            <label for="nom">Nom :</label>
            <input type="text" name="nom" id="nom" required placeholder="Entrez votre nom"/>
        </li>
        <li>
            <label for="prenom">Prénom :</label>
            <input type="text" name="prenom" id="prenom" required placeholder="Entrez votre prénom"/>
        </li>
        <li>
            <label for="mdp1">Mot de passe :</label>
            <input type="password" name="password" id="mdp1" pattern=".{6,9}" placeholder="Entrez votre mot de passe" required onkeyup="validateMdp2()" title = "Le mot de passe doit contenir de 6 à 8 caractères alphanumériques.">
            <!-- spécifiez l'expression régulière: le mot de passe doit être composé de 6 à 8 caractères alphanumériques -->
            <!-- quels sont les deux scénarios où l'attribut title sera affiché ? -->
            <!-- encore une fois, quelle est la différence entre name et id pour un input ? name pour le php et id pour css/html/js -->
            <span class="form_hint">De 6 à 8 caractères alphanumériques.</span>
        </li>
        <li>
            <label for="mdp2">Confirmez mot de passe :</label>
            <input type="password" id="mdp2" required placeholder="Confirmer votre mot de passe" onkeyup="validateMdp2()">
            <!-- pourquoi est-ce qu'on a pas mis un attribut name ici ? -->
            <!-- quel scénario justifie qu'on ait ajouté l'écouter validateMdp2() à l'évènement onkeyup de l'input mdp1 ? Si on change le mpd1 quand on se trompe sur celui-ci-->
            <span class="form_hint">Les mots de passes doivent être égaux.</span>
            <script>
                validateMdp2 = function(e) {
                    var mdp1 = document.getElementById('mdp1').value;
                    var mdp2 = document.getElementById('mdp2').value;

                    if (mdp1 != "" && mdp1 == mdp2) {
                        // ici on supprime le message d'erreur personnalisé, et du coup mdp2 devient valide.
                        document.getElementById('mdp2').setCustomValidity('');
                    } else {
                        // ici on ajoute un message d'erreur personnalisé, et du coup mdp2 devient invalide.
                        document.getElementById('mdp2').setCustomValidity('Les mots de passes doivent être égaux.');
                    }
                }
            </script>
        <li>
            <label for="tel">Téléphone :</label>
            <input type="tel" name="tel" id="tel" required placeholder="Entrez votre téléphone"/>
        </li>
        <li>
            <label for="ville">Ville :</label>
            <input type="text" name="ville" id="ville" required placeholder="Entrez votre prénom"/>
        </li>
        <li>
            <label for="birthdate">Date de naissance:</label>
            <input type="date" name="birthdate" id="birthdate" placeholder="JJ/MM/AAAA" required onchange="computeAge()"/>
            <script>
                computeAge = function(e) {
                    try{
                        // j'affiche dans la console quelques objets javascript, ce qui devrait vous aider.
                        console.log(Date.now());
                        console.log(document.getElementById("birthdate"));
                        console.log(document.getElementById("birthdate").valueAsDate);
                        console.log(Date.parse(document.getElementById("birthdate").valueAsDate));
                        console.log(new Date(0).getYear());
                        console.log(new Date(65572346585).getYear());
                        // modifier ici la valeur de l'élément age
                        document.getElementById('age').value =  new Date().getYear() - document.getElementById("birthdate").valueAsDate.getYear();
                    } catch(e) {
                        document.getElementById('age').value = "";
                    }
                }
            </script>
            <span class="form_hint">Format attendu "JJ/MM/AAAA"</span>
        </li>
        <li>
            <label for="age">Age:</label>
            <input type="number" name="age" id="age" disabled/>
            <!-- à quoi sert l'attribut disabled ? -->
            <!-- Cette attribut permet de désactiver un champ, le rendant non modifiable par l'utilisateur -->
        </li>
		<div class="form-group">
			<label for="sexe">Sexe :</label>
			<div>  
				<label> Homme : </label><input value="H" type="radio" name="sexe"/><label> Femme : </label><input value="F" type="radio" name="sexe"/>
			</div>
		</div>
        <li>
            <label for="taille">Taille :</label>
            <input type="range" name="taille" id="taille" value="1" min="0" max="2.50" step="0.01">
        </li>
        <li>
            <label for="couleur">Couleur :</label>
            <input type="color" name="couleur" id="couleur" value="#rrggbb">
        </li>
        <li>
            <label for="website">Website :</label>
            <input type="url" name="website" id="website" required placeholder="Entrez votre site web"/>
        </li>
        <li>
            <label for="profilepicfile">Photo de profil:</label>
            <input type="file" id="profilepicfile" onchange="loadProfilePic(this)"/>
            <!-- l'input profilepic va contenir le chemin vers l'image sur l'ordinateur du client -->
            <!-- on ne veut pas envoyer cette info avec le formulaire, donc il n'y a pas d'attribut name -->
            <span class="form_hint">Choisissez une image.</span>
            <input type="hidden" name="profilepic" id="profilepic"/>
            <!-- l'input profilepic va contenir l'image redimensionnée sous forme d'une data url -->
            <!-- c'est cet input qui sera envoyé avec le formulaire, sous le nom profilepic -->
            <canvas id="preview" width="0" height="0"></canvas>
            <!-- le canvas (nouveauté html5), c'est ici qu'on affichera une visualisation de l'image. -->
            <!-- on pourrait afficher l'image dans un élément img, mais le canvas va nous permettre également
            de la redimensionner, et de l'enregistrer sous forme d'une data url-->
            <script>
                loadProfilePic = function (e) {
                    // on récupère le canvas où on affichera l'image
                    var canvas = document.getElementById("preview");
                    var ctx = canvas.getContext("2d");
                    // on réinitialise le canvas: on l'efface, et déclare sa largeur et hauteur à 0


                    //ctx.setFillColor("white");


                    ctx.fillRect(0,0,canvas.width,canvas.height);
                    canvas.width=0;
                    canvas.height=0;
                    // on récupérer le fichier: le premier (et seul dans ce cas là) de la liste
                    var file = document.getElementById("profilepicfile").files[0];
                    // l'élément img va servir à stocker l'image temporairement
                    var img = document.createElement("img");
                    // l'objet de type FileReader nous permet de lire les données du fichier.
                    var reader = new FileReader();
                    // on prépare la fonction callback qui sera appelée lorsque l'image sera chargée
                    reader.onload = function(e) {
                        //on vérifie qu'on a bien téléchargé une image, grâce au mime type
                        if (!file.type.match(/image.*/)) {
                            // le fichier choisi n'est pas une image: le champs profilepicfile est invalide, et on supprime sa valeur
                            document.getElementById("profilepicfile").setCustomValidity("Il faut télécharger une image.");
                            document.getElementById("profilepicfile").value = "";
                        }
                        else {
                            // le callback sera appelé par la méthode getAsDataURL, donc le paramètre de callback e est une url qui contient
                            // les données de l'image. On modifie donc la source de l'image pour qu'elle soit égale à cette url
                            // on aurait fait différemment si on appelait une autre méthode que getAsDataURL.
                            img.src = e.target.result;
                            // le champs profilepicfile est valide
                            document.getElementById("profilepicfile").setCustomValidity("");
                            var MAX_WIDTH = 96;
                            var MAX_HEIGHT = 96;
                            var width = img.width;
                            var height = img.height;

                            // A FAIRE: si on garde les deux lignes suivantes, on rétrécit l'image mais elle sera déformée
                            // Vous devez supprimer ces lignes, et modifier width et height pour:
                            //    - garder les proportions,
                            //    - et que le maximum de width et height soit égal à 96
                            var ratio = Math.min(MAX_WIDTH / width, MAX_HEIGHT / height);

                            var width = width*ratio;
                            var height = height*ratio;

                            canvas.width = width;
                            canvas.height = height;
                            // on dessine l'image dans le canvas à la position 0,0 (en haut à gauche)
                            // et avec une largeur de width et une hauteur de height
                            ctx.drawImage(img, 0, 0, width, height);
                            // on exporte le contenu du canvas (l'image redimensionnée) sous la forme d'une data url
                            var dataurl = canvas.toDataURL("image/png");
                            // on donne finalement cette dataurl comme valeur au champs profilepic
                            document.getElementById("profilepic").value = dataurl;
                        };
                    }
                    // on charge l'image pour de vrai, lorsque ce sera terminé le callback loadProfilePic sera appelé.
                    reader.readAsDataURL(file);
                }
            </script>
        </li>

        <li>
            <input type="submit" value="Soumettre Formulaire">
        </li>
    </ul>
</form>
</body>
</html>