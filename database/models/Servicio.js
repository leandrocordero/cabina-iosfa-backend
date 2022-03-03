const { Schema, model } = require('mongoose');

const ServicioSchema = Schema({

    fecha: {

        type:Date,
        required:true

    },

    nombre: {

        type:String,
        required:true

    },

    color: {

        type:String,
        required:true

    },

    domicilio: {

        type:String,
        required:true

    },


    localidad:{
        type:String,
        required: true
    }
});

ServicioSchema.method('toJSON', function(){

    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;


})
module.exports = model('Servicio',ServicioSchema)
