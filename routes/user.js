'use strict'

var express= require('express');
var UserController = require('../controllers/user');

var api = express.Router();
var md_auth = require('../middlewares/authenticated');

var multipart = require('connect-multiparty');//para poder usar archivos. Da acceso a la variable superglobal files
var md_upload = multipart({uploadDir: './uploads/users'});

api.get('/probando-controlador', md_auth.ensureAuth, UserController.pruebas);
api.post('/register', UserController.saveUser);
api.post('/login', UserController.loginUser);
api.put('/update-user/:id', md_auth.ensureAuth, UserController.updateUser);//Si uso dos puntos el parametro es obligatorio, no asi si al final le pongo un ?. Ej: /:id?
api.post('/upload-image-user/:id', [md_auth.ensureAuth,md_upload], UserController.uploadImage);//Los middlewares se colocan como un array en corchetes
api.get('/get-image-user/:imageFile', UserController.getImageFile);

module.exports =api;