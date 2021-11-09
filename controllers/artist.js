'use strict'

var path = require('path');
var fs = require('fs');

var artist = require('../models/artist');
var album = require('../models/album');
var song = require('../models/song');

function getArtist(req,res){
    res.status(200).send({message: 'Metodo getartist del controlador artist.js'});

}

module.exports = {
    getArtist
};