const { Schema, model } = require('mongoose');

const ServicioSchema = Schema({

    color: {
        type:String,
        required:true
    },
    diagnostico:{
        type:String,
        required:false
    },
    domicilio: {
        type:String,
        required:true
    },
    domicilioNormalizado:{
        type:String,
        required:true
    },
    dni: {
        type:Number,
        required:true
    },
    estado:{
        type:String,
        required:true
    },
    fecha: {
        type:Date,
        required:true
    },
    localidad:{
        type:String,
        required: false
    },
    nombre: {
        type:String,
        required:true
    },
    user:{
        type:String,
        required: true
    },
    provincia:{
        type:String,
        required:false
    },
    ubicacion:{
        type:Object,
        required: true
    },
    empresa:{
        type:Object,
        required: true
    },

});

ServicioSchema.method('toJSON', function(){

    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;


})
module.exports = model('Servicio',ServicioSchema)
