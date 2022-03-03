const { Schema, model } = require('mongoose');

const PrestadorSchema = Schema({


    nombre: {

        type: String,
        required: true

    },

    cuit: {

        type: String,
        required: true
        
    },

    fechaCreacion:{

        type:Date,
        required:true

    },

    especialidad:{

        type:Array,
        required:true

    },

    email:{

        type:String,
        required:true

    },

    web:{

        type:String,
        required:true

    },

    telefono:{

        type:String,
        required:true

    },

    whatsapp:{

        type:String,
        required:true

    },

    domicilio:{

        type:String,
        required:true

    },

    copago:{

        type:String,
        required:true

    },

    descuento:{

        type:String,
        required:true

    },

    nivelPrecio:{

        type:String,
        required:true

    },

    zona:{

        type:String,
        required:true

    },


    puntuacion:{

        type:Number,
        required:true

    },
   
    user:{

        type:Schema.Types.ObjectId,
        ref:'Usuario',
        required:true

    }
});

PrestadorSchema.method('toJSON', function(){

    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;


})

module.exports = model('Prestadores',PrestadorSchema)