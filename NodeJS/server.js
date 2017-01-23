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

app.set('trust proxy', 1)
app.use(session({
    name: 'sessionId',
    secret:'S3CR37'
}));

var sess;


/* On affiche le formulaire d'enregistrement */

app.get('/', function(req, res){
    res.redirect('/login'), {
        title : "Connexion"
	}
});

app.get('/login', function(req, res){
	sess = req.session;
	if(!sess.email) {
        res.render("login"), {
			title : "Connexion"
		};
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
		sess = req.session;
    res.render('register', {
        title : "Pictionnary - Inscription"
    })
});

app.post('/register', function(req, res) {

    var email = req.body.email;
    var password = req.body.password;
    var prenom = req.body.prenom;
    var nom = req.body.nom;
    var tel = req.body.tel;
    var website = req.body.website;
	var ville = req.body.ville;
	var taille = req.body.taille;
    var sexe = req.body.sexe;
    var birthdate = req.body.birthdate;
    var color = req.body.couleur;
    var avatar = req.body.profilepic;

    var connection = mysql.createConnection({host:'localhost',user:'root',password:'',database:'pictionnary'});

    connection.connect();

    connection.query("INSERT INTO users(email, password, nom, prenom, tel, website, sexe, birthdate, ville, taille, couleur, profilepic) VALUES ('" + email + "', '" + password + "', '" + nom + "', '" + prenom + "', '" + tel + "', '" + website + "', 'H', '" + birthdate + "', '" + ville + "', '" + taille + "', '" + color + "', '" + avatar + "')", function(err, rows) {
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
		res.redirect('/');
	  }
	});
});

/* On affiche le profile  */
app.get('/profile', function (req, res) {
	
    // Récupération de la session
	sess = req.session;
    // Si pas de session, on redirige vers la page de connexion
    if(!sess.email) {
        res.redirect("login");
    } else {
		var mysql 		= require('mysql');
		var connection = mysql.createConnection({host:'localhost',user:'root',password:'',database:'pictionnary'});
		connection.connect();
		console.log(sess.email);
		connection.query("SELECT * FROM users WHERE email = '" + sess.email + "'", function (err, result) {
			if(!err) {
				// Récupère les informations de la requête SQL
				for (var i = 0; i < result.length; i++) {
					res.render("profile", {
						title 		  : "Pictionnary - Profil",
						nom 		  : result[i].nom,
						prenom 	  	  : result[i].prenom,
						tel 		  : result[i].tel,
						website 	  : result[i].website,
						sexe 		  : result[i].sexe,
						birthdate 	  : result[i].birthdate,
						age 		  : result[i].age,
						color 		  : result[i].couleur,
						avatar 		  : result[i].avatar
					}); 
				}
			} else {
				console.log(err);
			}
		});
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

app.get('/paint', function(req, res)
{
	if(!sess.email) {
        res.redirect("/login");
	} else {
		res.render('paint');
	}

});

app.post('/paint',function(req, res)
{
	sess = req.session;
	
	if(!sess.email) {
        res.redirect("/login");
    } else {
		var draw 		= new Object();
		draw.email 		= sess.email;
		draw.commandes 	= req.body.drawingCommands;
		draw.images 	= req.body.picture;

		sendDrawing(draw);
		res.redirect("/paint");
	}

});

app.get('/guess', function(req, res)
{
    var query  = url.parse(req.url,true).query;
	
	sess = req.session;
	
	var connection = mysql.createConnection({host: 'localhost',user: 'root', password: '', database: 'pictionnary'});

    connection.connect();
	
    connection.query("SELECT commandes FROM drawings WHERE email = '" + sess.email + "' AND id = '" + query['drawid'] + "';", function(err, rows)
        {
            if (err)
            { 
                console.log(err);
            } 
            else
            {
                res.render('guess', { commandes : rows[0].commandes });
            }
        });
})

app.use(function (req, res) { // Répond enfin
    res.send('Hello world!');
});

logger.info('server start');
app.listen(8080);

function checkUser(email , password, res, req) {
	
    var connection = mysql.createConnection({host:'localhost',user:'root',password:'',database:'pictionnary'});

    connection.connect();

    connection.query("SELECT * FROM users WHERE email = '" + email + "' AND password = '" + password + "'", function (err, result) {
        if(!err) {
            if (result.length) { // Si on trouve un résultat
				for (var i = 0; i < result.length; i++) {
					var idUser 	= result[i].id;
					var email 	= result[i].email;

					sess 		= req.session;
					sess.email 	= req.body.email;
					sess.idUser = result[i].id;
					// Redirection vers le profil
					res.redirect('/profile');
				}
            } else {

				//Redicrection vers l'inscription
                res.redirect('/register');
			}
        } else {
            logger.error(err);
		}
    });

    connection.end();
}

function sendDrawing(draw){

    var values = {email : draw.email, commandes : draw.commandes, images : draw.images};
	
	var connection = mysql.createConnection({host: 'localhost', user: 'root', password: '', database: 'pictionnary'});
    connection.connect();
	
    connection.query("INSERT INTO drawings (email, commandes, images) VALUE ?", values, function(err, rows) {
        if (err)
        { 
            console.log(err);
        }
    });
	
	connection.end();
}

function insertUser(info, res) {

    var connection = mysql.createConnection({host: 'localhost', user: 'root', password: '', database: 'pictionnary'});
    connection.connect();

    connection.query("INSERT INTO users VALUES ('" + info.email + "', '" + info.password + "', '" + info.nom + "', '" + info.prenom + "', '" + info.tel + "', '" + info.website + "', '" + info.sexe + "', '" + info.birthdate + "', '" + info.ville + "', '" + info.taille + "', '" + info.couleur + "', '" + info.profilepic + "');", function (err, rows) {
        if(!err) {
            res.redirect('/profile');
        }
        else
            res.redirect('/register');
		}
	);

    connection.end();
}