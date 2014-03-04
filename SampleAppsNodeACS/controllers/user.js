/**
 * @author ShuoLiang
 */

var ACS = require('acs').ACS;
var logger = require('acs').logger;
var sdk = ACS.initACS('Dfi6j299M9pxUMEkJBYy1jbQUbH4CrKX');

//do photo upload with rest
function upload(req, res) {
	var data = {
		photo: req.files.filename,
	};
	sdk.rest('photos/create.json', 'POST', data, function(data){
		logger.debug("######upload######");
		logger.debug(JSON.stringify(data, null, 2));
		if(data && data.meta) {
			if(data.meta.status == 'ok') {
				var photo = data.response.photos[0];
				req.session.photo = photo;
				res.redirect('/showPhoto');
			} else {
				logger.info("upload error: " + data.meta.message);
				res.render('upload', {message: data.meta.message});
			}
		} else {
			logger.error("Upload error, try again later.");
			res.render('upload', {message: "upload error, try again later."});
		}
	}, req, res);
}

function showPhoto(req, res) {
	var data = {
		photo_id: req.body.photo_id,
	};
	sdk.rest('photos/show.json', 'GET', data, function(data){
		logger.debug("######query######");
		logger.debug(JSON.stringify(data, null, 2));
		if(data && data.meta) {
			if(data.meta.status == 'ok') {
				var photo = data.response.photos[0];
				req.session.photo = photo;
				res.redirect('/showPhoto');
			} else {
				logger.info("upload error: " + data.meta.message);
				res.render('upload', {message: data.meta.message});
			}
		} else {
			logger.error("Upload error, try again later.");
			res.render('upload', {message: "upload error, try again later."});
		}
	}, req, res);
}

//create a new user
function signup(req, res) {
	var data = {
		first_name: req.body.first_name,
		last_name: req.body.last_name,
		email: req.body.email,
		password: req.body.password,
		password_confirmation: req.body.password_confirmation
	};
	
	sdk.rest('users/create.json', 'POST', data, function(data) {
		logger.debug("######Create######");
		logger.debug(JSON.stringify(data, null, 2));
		if(data && data.meta) {
			if(data.meta.status == 'ok') {
				var user = data.response.users[0];
				if(user.first_name && user.last_name) {
					user.name = user.first_name + ' ' + user.last_name;
				} else {
					user.name = user.username;
				}
				logger.info('Created user: ' + user.name);
				req.session.user = user;
				res.redirect('/');
			} else {
				logger.info("Create user error: " + data.meta.message);
				res.render('signup', {message: data.meta.message});
			}
		} else {
			logger.error("Create user error, try again later.");
			res.render('signup', {message: "Create user error, try again later."});
		}
	}, req, res);
}

//do user login with rest
function login(req, res) {
	var data = {
		login: req.body.username,
		password: req.body.password
	};
	sdk.rest('users/login.json', 'POST', data, function(data){
		logger.debug("######login######");
		logger.debug(JSON.stringify(data, null, 2));
		if(data && data.meta) {
			if(data.meta.status == 'ok') {
				var user = data.response.users[0];
				if(user.first_name && user.last_name) {
					user.name = user.first_name + ' ' + user.last_name;
				} else {
					user.name = user.username;
				}
				req.session.user = user;
				res.redirect('/');
			} else {
				logger.info("Login error: " + data.meta.message);
				res.render('login', {message: data.meta.message});
			}
		} else {
			logger.error("Login error, try again later.");
			res.render('login', {message: "Login error, try again later."});
		}
	}, req, res);
}

function update(req, res) {
	var data = {
		first_name: req.body.first_name,
		last_name: req.body.last_name,
	};
	sdk.rest('users/update.json', 'PUT', data, function(data) {
		logger.debug("######update######");
		logger.debug(JSON.stringify(data, null, 2));
		if(data && data.meta) {
			if(data.meta.status == 'ok') {
				var user = data.response.users[0];
				if(user.first_name && user.last_name) {
					user.name = user.first_name + ' ' + user.last_name;
				} else {
					user.name = user.username;
				}
				req.session.user = user;
				res.redirect('/');
			} else {
				logger.info("Update user error: " + data.meta.message);
				res.render('update', {message: data.meta.message});
			}
		} else {
			logger.error("Update user error, try again later.");
			res.render('update', {message: "Update user error, try again later."});
		}
	}, req, res);
}

function logout(req, res) {
	sdk.rest('users/logout.json', 'DELETE', null, function(data) {
		logger.debug("######logout######");
		logger.debug(JSON.stringify(data, null, 2));
		if(data && data.meta) {
			if(data.meta.status == 'ok') {
				delete req.session.user;
				res.redirect('/');
			} else {
				logger.info("Logout error: " + data.meta.message);
				res.render('/', {message: data.meta.message});
			}
		} else {
			logger.error("Error to logout, try again later.");
			res.render('/', {message: "Error to logout, try again later."});
		}
	}, req, res);
}

