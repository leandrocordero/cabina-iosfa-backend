const { Schema, model } = require('mongoose');

const LocalidadSchema = Schema({


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

    departamento_id: {

        type: String,
        
    },

    departamento_nombre: {

        type: String,
        
    },

    fuente: {

        type: String,
        
    },

    id: {

        type: String,
        
    },

    localidad_censal_id: {

        type: String,
        
    },

    localidad_censal_nombre: {

        type: String,
        
    },

    municipio_id: {

        type: String,
        
    },

    municipio_nombre: {

        type: String,
        
    },



    nombre: {

        type: String,
        
    },

    provincia_id: {

        type: String,
        
    },

    provincia_nombre: {

        type: String,
        
    },

});

module.exports = model('Localidades',LocalidadSchema)