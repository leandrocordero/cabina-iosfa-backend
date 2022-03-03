
const { response } = require('express');
const { find } = require('../database/models/Evento');
const Evento = require('../database/models/Evento');

const eventsController = {

    
      setEvent: async(req,res = 
        response)=>{

       
        const { title, notes, start, end } = req.body
        const { uid } = req;

        
        evento = new Evento( req.body )

        try {
            
            evento.user = uid;

            await evento.save();

            return res.status(201).json({
                ok: true,
                msg:'Evento Creado',
                evento
            })

        } catch (error) {
            
            console.log(error)
            res.status(500).json({
                ok: false,
                msg: 'Error interno pongase en contacto con el administrador del sitio.'
            })

        }
},
getEvents: async(req, res = response)=>{

const eventos = await Evento.find()
                            .populate('user','name');



return res.status(200).json({
    ok:"true",
    eventos
})


},

updateEvent: async(req, res = response)=>{

    const id = req.params.id;
    const uid = req.uid;
    
    try {
        
        const evento = await Evento.findById( id );

      
        if( !evento ){

            return res.status(404).json({
                ok: false,
                msg: 'id incorrecto o inexistente'

            });
        }

      if( evento.user.toString() !== uid ){

            return res.status(401).json({
                ok: false,
                mgs:'no tiene privilegios para editar este evento'
            })

        }

        const nuevoEvento = {
            ...req.body,
            user: uid
        }

        const eventoActualizado = await Evento.findOneAndUpdate(id, nuevoEvento, {new:true})

        return res.status(200).json({
            ok:"true",
            msg:"Evento Actualizado",
            evento: eventoActualizado
        })
    

    } catch (error) {
        console.log(error)
            return res.status(500).json({
                ok: false,
                msg: 'Error interno pongase en contacto con el administrador del sitio.'
            })

    }


    
},

deleteEvent: async(req, res = response)=>{

    const id = req.params.id;
    const uid = req.uid;
    
    try {
        
        const evento = await Evento.findById( id );

      
        if( !evento ){

            return res.status(404).json({
                ok: false,
                msg: 'id incorrecto o inexistente'

            });
        }

      if( evento.user.toString() !== uid ){

            return res.status(401).json({
                ok: false,
                mgs:'no tiene privilegios para borrar este evento'
            })

        }

       
        await Evento.findByIdAndDelete( id )
        return res.status(200).json({
            ok:"true",
            msg:"Evento Eliminado",
            
        })
    

    } catch (error) {
        console.log(error)
            return res.status(500).json({
                ok: false,
                msg: 'Error interno pongase en contacto con el administrador del sitio.'
            })

    }

 
}

}

module.exports = eventsController;