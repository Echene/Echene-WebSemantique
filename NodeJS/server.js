var express 	= require('express');
var session 	= require('express-session');
var morgan 		= require('morgan'); // Charge le middleware de logging
var favicon 	= require('serve-favicon'); // Charge le middleware de favicon
var logger 		= require('log4js').getLogger('Server');
var mysql 		= require('mysql');
var bodyParser 	= require('body-parser');
var url 		= require('url');
var app 		= express();


// Active le middleware de logging
app.use(morgan('combined')); 

app.use(bodyParser.urlencoded({extended: true}));

// Indique que le dossier /public contient des fichiers statiques (middleware chargé de base)
app.use(express.static(__dirname + '/public'));

// config
app.set('view engine', 'ejs');
app.set('views', 	__dirname + '/public/views');

app.use('/avatars', express.static(__dirname + '/public/img/avatars'));
app.use('/img', 	express.static(__dirname + '/public/img'));
app.use('/css', 	express.static(__dirname + '/public/css'));

app.use('/css', 	express.static(__dirname + '/node_modules/bootstrap/dist/css'));
app.use('/js', 		express.static(__dirname + '/node_modules/bootstrap/dist/js'));
app.use('/js', 		express.static(__dirname + '/node_modules/jquery/dist'));

app.use(session({
    name: 'sessionId',
    secret:'S3CR37'
}));


/* On affiche le formulaire d'enregistrement */

app.get('/', function(req, res){
    res.redirect('/login'), {
        title : "Connexion"
	}
});

app.get('/login', function(req, res){
	var sess = req.session;
	
	if(!sess.email) {
        res.render("login",{session:sess});
    } else {
		res.redirect('/profile');
	}	
});

app.post('/login', function (req, res) {
	
    var email 	 = req.body.email;
    var password = req.body.password; //sha1(req.body.password);

    checkUser(email, password, res, req);
});

app.get('/register', function (req, res) {
	var	sess = req.session;
    res.render('register',{session:sess})
});

app.post('/register', function(req, res) {

    var email 		= req.body.email;
    var password 	= req.body.password;
    var prenom 		= req.body.prenom;
    var nom 		= req.body.nom;
    var tel 		= req.body.tel;
    var website 	= req.body.website;
	var ville 		= req.body.ville;
	var taille 		= req.body.taille;
    var sexe 		= req.body.sexe;
    var birthdate 	= req.body.birthdate;
    var color 		= req.body.couleur;
    var avatar 		= req.body.profilepic;

    var connection = mysql.createConnection({host:'localhost',user:'root',password:'',database:'pictionnary'});

    connection.connect();

    connection.query("INSERT INTO users(email, password, nom, prenom, tel, website, sexe, birthdate, ville, taille, couleur, profilepic) VALUES ('" + email + "', '" + password + "', '" + nom + "', '" + prenom + "', '" + tel + "', '" + website + "', '" + sexe + "', '" + birthdate + "', '" + ville + "', '" + taille + "', '" + color + "', '" + avatar + "')", function(err, rows) {
        if (err)
        { 
            console.log(err);
        }
    });

    connection.end();
	
	res.redirect('/login');

});

app.get('/logout',function(req,res){
	req.session.destroy(function(err) {
	  if(err) {
		console.log(err);
	  } else {
		res.redirect('/login');
	  }
	});
});

/* On affiche le profile  */
app.get('/profile', function (req, res) {
	
    // Récupération de la session
	var sess = req.session;
	
    // Si pas de session, on redirige vers la page de connexion
    if(!sess.email) {
        res.redirect("/login");
    } else {
		res.render("profile",{session:sess});
	}
}); 

app.get('/editProfile', function (req, res) {
	
    // Récupération de la session
	sess = req.session;
	
    // Si pas de session, on redirige vers la page de connexion
    if(!sess.email) {
        res.redirect("/login");
    } else {
		var mysql 		= require('mysql');
		var connection = mysql.createConnection({host:'localhost',user:'root',password:'',database:'pictionnary'});
		connection.connect();
		console.log(sess.email);
		connection.query("SELECT * FROM users WHERE email = '" + sess.email + "'", function (err, result) {
			if(!err) {
				// Récupère les informations de la requête SQL
				for (var i = 0; i < result.length; i++) {
					res.render("editProfile", {
						nom 		  : result[i].nom,
						prenom 	  	  : result[i].prenom,
						tel		 	  : result[i].tel,
						website 	  : result[i].website,
						sexe 		  : result[i].sexe,
						ville 		  : result[i].ville,
						birthdate 	  : result[i].birthdate,
						color		  : result[i].couleur,
					}); 
				}
			} else {
				console.log(err);
			}
		});
	}
}); 

app.get('/paint', function(req, res) {
	
	var sess = req.session;
	
	if(!sess.email) {
        res.redirect("/login");
	} else {
		res.render('paint',{session:sess});
	}

});

app.post('/paint',function(req, res) {
	
	var sess = req.session;
	
	if(!sess.email) {
        res.redirect("/login");
    } else {
		var commandes 	= req.body.drawingCommands;
		var img 		= req.body.picture;
		var reponse		= req.body.reponse;
	
		var connection = mysql.createConnection({host: 'localhost', user: 'root', password: '', database: 'pictionnary'});
		connection.connect();

		connection.query("INSERT INTO drawings (email, commands, images, reponse) VALUES('" + sess.email + "', '" + commandes + "', '"+img + "', '" + reponse + "')", function(err,fields)
		{
			if(err)
			{ 
				console.log(err);
			}
		});
		
		connection.end();
		
		res.redirect("/profile");
	}

});

app.get('/guess', function(req, res) {
	
	var sess = req.session;
	
	var connection = mysql.createConnection({host: 'localhost',user: 'root', password: '', database: 'pictionnary'});

    connection.connect();
	
    connection.query("SELECT commands, reponse FROM drawings ORDER BY RAND() LIMIT 1;", function(err, result)
        {
            if (err)
            { 
                console.log(err);
            } 
            else
            {
                res.render('guess', {session:sess, commandes : result[0].commands, reponse : result[0].reponse});
            }
        });
})

logger.info('server start');
app.listen(8080);

function checkUser(email , password, res, req) {
	
    var connection = mysql.createConnection({host:'localhost',user:'root',password:'',database:'pictionnary'});

    connection.connect();

    connection.query("SELECT *, CONVERT(profilepic USING utf8) as avatar, DATE_FORMAT(birthdate, \"%d-%m-%Y\") AS 'birthdate2' FROM users", function (err, result) {
        if(!err) {
            if (result.length) { // Pour chaque user
				for (var i = 0; i < result.length; i++) {
					if(email == result[i].email && password == result[i].password){

						sess 			= req.session;
						sess.email 		= email;
						sess.nom		= result[i].nom;
						sess.prenom 	= result[i].prenom;
						sess.tel 		= result[i].tel;
						sess.website 	= result[i].website;
						sess.sexe 		= result[i].sexe;
						sess.birthdate 	= result[i].birthdate2;
						sess.age 		= result[i].age;
						sess.color 		= result[i].couleur;
						sess.avatar 	= result[i].avatar;
						
						// Redirection vers le profil
						res.redirect('/profile');
					}
				}
            } else {
				//Redicrection vers la page de login
                res.render('login');
			}
        } else {
			res.render('login');
            logger.error(err);
		}
    });

    connection.end();
}