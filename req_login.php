<?php
    $email=stripslashes($_POST['email']);
    $password=stripslashes($_POST['password']);
    // Connect to server and select database.
    $dbh = new PDO('mysql:host=localhost;dbname=pictionnary', 'test', 'test');
    session_start();
    // ensuite on requ�te � nouveau la base pour l'utilisateur qui vient d'�tre inscrit, et
    $sql = $dbh->query("SELECT u.id, u.email, u.nom, u.prenom, u.couleur, u.profilepic FROM USERS u WHERE u.email='".$email."' AND u.password='".$password."'");
    else {
        // on r�cup�re la ligne qui nous int�resse avec $sql->fetch(),
        // et on enregistre les donn�es dans la session avec $_SESSION["..."]=...
        $result = $sql->fetch(PDO::FETCH_ASSOC);
        $_SESSION["email"] = $result["email"];
        $_SESSION["password"] = $result["password"];
        $_SESSION["nom"] = $result["nom"];
        $_SESSION["prenom"] = $result["prenom"];
        $_SESSION["tel"] = $result["tel"];
        $_SESSION["website"] = $result["website"];
        $_SESSION["sexe"] = $result["sexe"];
        $_SESSION["birthdate"] = $result["birthdate"];
        $_SESSION["ville"] = $result["ville"];
        $_SESSION["taille"] = $result["taille"];
        $_SESSION["couleur"] = $result["couleur"];
        $_SESSION["profilepic"] = $result["profilepic"];
    }
    header("Location: main.php?rowCount=".$sql->rowCount());
?>