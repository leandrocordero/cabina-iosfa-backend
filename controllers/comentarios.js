const { response } = require('express');
const { find } = require('../database/models/Comentario');
const Comentario = require('../database/models/Comentario');
const Usuario = require('../database/models/Usuario');
const usuario = require('../database/models/Usuario');


const comentariosController = {

    
getComentarios: async(req, res = response)=>{

const id = req.params.id;

const comentarios = await Comentario.find({"prestadorId": id})
                            
return res.status(200).json({
    ok:"true",
    comentarios
})


},

updateComentarios: async(req, res = response)=>{

    const id = req.params.id;
    const uid = req.uid;

    try {
        
        const comentario = await Comentario.findById( id );

      
        if( !comentario ){

            return res.status(404).json({
                ok: false,
                msg: 'id incorrecto o inexistente'

            });
        }

        console.log(comentario.user)
      if( comentario.user.toString() !== uid ){

            return res.status(401).json({
                ok: false,
                mgs:'no tiene privilegios para editar este prestador'
            })

        }

        const nuevoComentario = {
            ...req.body,
            user: uid
        }

        const comentarioActualizado = await Comentario.findOneAndUpdate(id, nuevoComentario, {new:true})

        return res.status(200).json({
            ok:"true",
            msg:"Evento Actualizado",
            comentarioActualizado
        })
    

    } catch (error) {
        console.log(error)
            return res.status(500).json({
                ok: false,
                msg: 'Error interno pongase en contacto con el administrador del sitio.'
            })

    }


    
},

deleteComentarios: async(req, res = response)=>{

    const id = req.params.id;
    const uid = req.uid;
    
    try {
        
        const comentario = await Comentario.findById( id );

      
        if( !comentario ){

            return res.status(404).json({
                ok: false,
                msg: 'id incorrecto o inexistente'

            });
        }

      if( comentario.user.toString() !== uid ){

            return res.status(401).json({
                ok: false,
                mgs:'no tiene privilegios para borrar este comentario'
            })

        }

       
        await Comentario.findByIdAndDelete( id )
        return res.status(200).json({
            ok:"true",
            msg:"Comentario Eliminado",
            
        })
    

    } catch (error) {
        console.log(error)
            return res.status(500).json({
                ok: false,
                msg: 'Error interno pongase en contacto con el administrador del sitio.'
            })

    }

 
},

setComentario: async(req, res = response)=>{

    const id = req.params.id;
    const prestadorId = req.body.prestadorId;
   
    const { nombre, cuit, fechaCreacion } = req.body
    const { uid } = req;

    comentario = new Comentario( req.body )

    try {
        
        const {name, photoURL} = await Usuario.findById( uid );

        comentario.user = uid;
        comentario.name = name;
        comentario.photoURL = photoURL;
    
        await comentario.save();

        return res.status(201).json({
            ok: true,
            msg:'comentario Creado',
            comentario
        })

    } catch (error) {
        
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Error interno pongase en contacto con el administrador del sitio.'
        })

    }
}

}

module.exports = comentariosController;