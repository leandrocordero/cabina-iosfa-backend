const { Schema, model } = require('mongoose');

const ComentraioSchema = Schema({

    fecha: {

        type:Date,
        required:true

    },

    comentario: {

        type:String,
        required:true

    },

    prestadorId: {

        type:Schema.Types.ObjectId,
        ref:'Prestador',
        required:true

    },

    user:{

        type:Schema.Types.ObjectId,
        ref:'Usuario',
        required:true

    },

    name:{
        type:String,
        required: true
    },
    
    photoURL:{
        type:String,
        required: true
    }
   
});

ComentraioSchema.method('toJSON', function(){

    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;


})
module.exports = model('Comentario',ComentraioSchema)
