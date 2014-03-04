function index(req, res) {
	res.render('index', {user: req.session.user, photo: req.session.photo});
}

function login(req, res) {
	res.render('login');
}

function update(req, res) {
	res.render('update');
}

function signup(req, res) {
	res.render('signup');
}

function upload(req, res) {
	res.render('upload');
}

function showPhoto(req, res) {
	res.render('showPhoto', {photo: req.session.photo});
}