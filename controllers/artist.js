'use strict'

var path = require('path');
var fs = require('fs');
var mongoosePaginate=require('mongoose-pagination');

var Artist = require('../models/artist'); //Estas son al final clases que pongo en una variable
var Album = require('../models/album');
var Song = require('../models/song');

function getArtist(req,res){
    var artistId=req.params.id;
    Artist.findById(artistId,(err,artist)=>{
        if(err) {
            res.status(500).send({message: 'Error en la petición'});
        }else if(!artist){
            res.status(404).send({message: 'El artista no existe'});
        }else{
            res.status(200).send({artist});
        }
    });

}

function getArtists(req,res){
    if(req.params.page){
        var page = req.params.page;
    }else{
        var page = 1;//Aunque se defina dentro de un scope se puede usar afuera :P
    }

    var itemsPerPage=3;

    Artist.find().sort('name').paginate(page,itemsPerPage,(err,artists,total)=>{//haber cargado mongoose pagination habilita este metodo aun si la variable no se usa
        if(err){
            res.status(500).send({message: 'Error en la petición'});
        }else  if(!artists){
            res.status(404).send({message: 'no hay artistas'});
        }else{//acá se coloca return para estar mas seguros de que funcione la mayoria de las veces
            return res.status(200).send({
                total_items: total,
                artists:artists
            });
        }
    });
}

function saveArtist(req,res){
    var artist=new Artist();

    var params=req.body;
    artist.name=params.name;
    artist.description = params.description;
    artist.image='null';

    artist.save((err,artistStored) => {
        if(err){
            res.status(500).send({message: 'Error al guardar el artista'});
        }else if(!artistStored){
            res.status(404).send({message: 'El artista no ha sido guardado'});
        }else{
            res.status(200).send({artist: artistStored});
        }
    });
}

function updateArtist(req,res){
    var artistId=req.params.id;
    var update = req.body;

    Artist.findByIdAndUpdate(artistId,update,(err,artistUpdated)=>{
        if(err){
            res.status(500).send({message: 'Error al actualizar el artista'});
        }else if(!artistUpdated){
            res.status(404).send({message: 'El artista no ha sido encontrado'});
        }else{
            res.status(200).send({artist: artistUpdated});//Pongo ese nombre de dato para poder usar una variable con diferente nombre aunque me refiera al mismo tipo
        }
    });
}

module.exports = {
    getArtist,
    saveArtist,
    getArtists,
    updateArtist
};