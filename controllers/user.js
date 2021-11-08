'use strict'

var fs= require('fs');
var path = require('path');
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

function updateUser(req,res){
    var userId = req.params.id;
    var update = req.body;

    User.findByIdAndUpdate(userId, update, (err, userUpdated) =>{
       if(err){
           res.status(500).send({message: 'Error al actualizar el usuario'});
       } else{
           if(!userUpdated){
               res.status(404).send({message: 'No se ha podiso actualizar el usuario'});
           }
           else{
               res.status(200).send({user: userUpdated});
           }
       }
    });
}

function uploadImage(req,res){
    var userId = req.params.id;
    var file_name = "No subido";

    if(req.files){
        var file_path= req.files.image.path;
        var file_split = file_path.split('/');
        var file_name= file_split[2];//Medio cabeza
        var file_ext= file_name.split('\.')[1];//el punto va encodeado

        if(file_ext == 'png' || file_ext == 'jpg' || file_ext == 'gif'){
            User.findByIdAndUpdate(userId,{image: file_name},(err,userUpdated) => {
                if(err){
                    res.status(500).send({message: 'Error al actualizar el usuario'});
                } else{
                    if(!userUpdated){
                        res.status(404).send({message: 'No se ha podiso actualizar el usuario'});
                    }
                    else{
                        res.status(200).send({user: userUpdated});
                    }
                }
            });
        }else{
            res.status(200).send({message: 'La extension del archivo es invalida'});
        }

        console.log(file_split);
    }else{
        res.status(200).send({message: 'No has subido ninguna imagen'});
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

function getImageFile(req,res){
    var imageFile = req.params.imageFile;
    var file_path= './uploads/users/'+imageFile;
    if(fs.existsSync(file_path)){//La funcion que se usa en el curso está deprecada, esta es mas piola y no lleva callback
        res.sendFile(path.resolve(file_path));
    }else{
        res.status(200).send({message: 'No existe la imagen'});
    }
}

module.exports = {
    pruebas,
    saveUser,
    updateUser,
    loginUser,
    uploadImage,
    getImageFile
};