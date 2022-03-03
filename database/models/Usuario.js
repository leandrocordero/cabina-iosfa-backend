const { Schema, model } = require('mongoose');

const UsuarioSchema = Schema({


    name: {

        type: String,
        required: true

    },

    email: {

        type: String,
        required: true,
        unique: true

    },
    photoURL: {

        type: String,
        
    },

    password:{

        type:String,
        required:true

    }


})

module.exports = model('Usuario',UsuarioSchema)