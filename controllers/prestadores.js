const { response } = require('express');
const { find } = require('../database/models/Prestador');
const Prestador = require('../database/models/Prestador');
const Comentario = require('../database/models/Comentario');

const prestadoresController = {

    
      setPrestador: async(req,res = 
        response)=>{

       
        const { nombre, cuit, fechaCreacion } = req.body
        const { uid } = req;

        
        prestador = new Prestador( req.body )

        try {
            
            prestador.user = uid;

            await prestador.save();

            return res.status(201).json({
                ok: true,
                msg:'prestador Creado',
                prestador
            })

        } catch (error) {
            
            console.log(error)
            res.status(500).json({
                ok: false,
                msg: 'Error interno pongase en contacto con el administrador del sitio.'
            })

        }
},
        getPrestadores: async(req, res = response)=>{

const prestadores = await Prestador.find()
                            .populate('user','name');



return res.status(200).json({
    ok:"true",
    prestadores
})


},

getPrestador: async(req, res = response)=>{
    const id = req.params.id;
    
    try {
        
        const prestador = await Prestador.findById( id );

      
        if( !prestador ){

            return res.status(404).json({
                ok: false,
                msg: 'id incorrecto o inexistente'

            })
        }else{
            return res.status(200).json({
                ok:"true",
                msg:"Info Prestador",
                prestador
                
            })
        
        }

    }catch (error) {
        console.log(error)
            return res.status(500).json({
                ok: false,
                msg: 'Error interno pongase en contacto con el administrador del sitio.'
            })

    }

    },

      updatePrestador: async(req, res = response)=>{

            const id = req.params.id;
            const uid = req.uid;
    
    try {
        
        const prestador = await Prestador.findById( id );

      
        if( !prestador ){

            return res.status(404).json({
                ok: false,
                msg: 'id incorrecto o inexistente'

            });
        }

      if( prestador.user.toString() !== uid ){

            return res.status(401).json({
                ok: false,
                mgs:'no tiene privilegios para editar este prestador'
            })

        }

        const nuevoPrestador = {
            ...req.body,
            user: uid
        }

        const prestadorActualizado = await Prestador.findOneAndUpdate(id, nuevoPrestador, {new:true})

        return res.status(200).json({
            ok:"true",
            msg:"Evento Actualizado",
            prestador: prestadorActualizado
        })
    

    } catch (error) {
        console.log(error)
            return res.status(500).json({
                ok: false,
                msg: 'Error interno pongase en contacto con el administrador del sitio.'
            })

    }


    
},

deletePrestador: async(req, res = response)=>{

    const id = req.params.id;
    const uid = req.uid;
    
    try {
        
        const prestador = await Prestador.findById( id );

      
        if( !prestador ){

            return res.status(404).json({
                ok: false,
                msg: 'id incorrecto o inexistente'

            });
        }

      if( prestador.user.toString() !== uid ){

            return res.status(401).json({
                ok: false,
                mgs:'no tiene privilegios para borrar este prestador'
            })

        }

       
        await Prestador.findByIdAndDelete( id )
        return res.status(200).json({
            ok:"true",
            msg:"Prestador Eliminado",
            
        })
    

    } catch (error) {
        console.log(error)
            return res.status(500).json({
                ok: false,
                msg: 'Error interno pongase en contacto con el administrador del sitio.'
            })

    }

 
},

}

module.exports = prestadoresController;