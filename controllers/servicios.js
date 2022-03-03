
const { response } = require('express');
const Servicio = require('../database/models/Servicio');
const { find } = require('../database/models/Servicio');
//const Evento = require('../database/models/Evento');

const serviciosController = {

    
      setServicio: async(req,res = 
        response)=>{

       
        //const { fecha, nombre, color, domicilio, localidad } = req.body
        const { uid } = req;
        servicio = new Servicio( req.body )

        try {
            
            servicio.user = uid;

            await servicio.save();

            return res.status(201).json({
                ok: true,
                msg:'Servicio Creado',
                servicio
            })


        } catch (error) {
            
            console.log(error)
            res.status(500).json({
                ok: false,
                msg: 'Error interno pongase en contacto con el administrador del sitio.'
            })

        }
},
getServicios: async(req, res = response)=>{

const servicios = await Servicio.find()
                            .populate('user','name');



return res.status(200).json({
    ok:"true",
    servicios
})


},

updateService: async(req, res = response)=>{

    const id = req.params.id;
    const uid = req.uid;
    
    try {
        
        const evento = await Servicio.findById( id );

      
        if( !servicio ){

            return res.status(404).json({
                ok: false,
                msg: 'id incorrecto o inexistente'

            });
        }

      if( servicio.user.toString() !== uid ){

            return res.status(401).json({
                ok: false,
                mgs:'no tiene privilegios para editar este evento'
            })

        }

        const nuevoServicio = {
            ...req.body,
            user: uid
        }

        const servicioActualizado = await Servicio.findOneAndUpdate(id, nuevoServicio, {new:true})

        return res.status(200).json({
            ok:"true",
            msg:"Servicio Actualizado",
            servicio: servicioActualizado
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

module.exports = serviciosController;