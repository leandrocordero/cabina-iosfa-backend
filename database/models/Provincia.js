const { Schema, model } = require('mongoose');

const ProvinciaSchema = Schema({


    categoria: {

        type: String,
        required: true

    },

    centroide_lat: {

        type: String,
        
    },

    
    centroide_lon: {

        type: String,
        
    },

    fuente: {

        type: String,
        
    },

    id: {

        type: String,
        
    },

    iso_id: {

        type: String,
        
    },

    iso_nombre: {

        type: String,
        
    },

    nombre: {

        type: String,
        
    },

    nombre_completo: {

        type: String,
        
    },
});

module.exports = model('Provincias',ProvinciaSchema)