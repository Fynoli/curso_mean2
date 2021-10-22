'use strict'

var User = require('../models/user');
var bcrypt = require('bcrypt-nodejs');
var jwt = require('../services/jwt');

function pruebas(req,res){
    res.status(200).send({
        message: 'Probando controlador'
    });
}

function saveUser(req,res){
    var user = new User();

    var params = req.body;

    console.log(params);

    user.name=params.name;
    user.surname=params.surname;
    user.email=params.email;
    user.role='ROLE_ADMIN';
    user.image='null';

    if(params.password){
        bcrypt.hash(params.password,null,null,function(err,hash){
            user.password = hash;
            if(user.name!=null && user.surname!=null && user.email!=null){
                //guardar el usuario
                user.save((err,userStored)=>{
                    if(err){
                        res.status(500).send({messaje: 'Error al guardar el usuario'});
                    }else{
                        if(!userStored){
                            res.status(404).send({messaje: 'No se ha registrado el usuario'});
                        }else{
                            res.status(200).send({user : userStored});
                        }
                    }
                });
            }else{
                res.status(200).send({messaje: 'Faltan datos'});
            }
        });

    }else{
        res.status(200).send({messaje: 'introduce la contraseña'});
    }
}

function loginUser(req,res){
    var params = req.body;
    var email =params.email;
    var password = params.password;

    User.findOne({email: email.toLowerCase()},function(err,user){
        if(err){
            res.status(500).send({message: 'Error en la petición'});

        }else{
            if(!user){
                res.status(404).send({message: 'El usuario no existe'});
            }else{
                bcrypt.compare(password, user.password, function(err,check){
                    if(check){
                        if(params.gethash){
                            res.status(200).send({token: jwt.createToken(user)});
                        }else{
                            res.status(200).send({user});
                        }
                    }else{
                        res.status(200).send({message: 'Usuario o contraseña incorrecta'});
                    }
                });
            }
        }
    });
}

module.exports = {
    pruebas,
    saveUser,
    loginUser
};