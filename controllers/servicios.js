
const { response } = require('express');
const Servicio = require('../database/models/Servicio');
const { find } = require('../database/models/Servicio');
const NodeGeocoder = require('node-geocoder');
const { informarRegistro } = require('../sockets/socketController');
//const Evento = require('../database/models/Evento');

const options = {
    provider: 'google',
    apiKey: process.env.GOOGLE_MAPS_API_KEY,
  };
  
const geocoder = NodeGeocoder(options);

const serviciosController = {

    
      setServicio: async(req,res = 
        response)=>{

        
        //const { fecha, nombre, color, domicilio, localidad } = req.body
        const { uid, empresa } = req;
        servicio = new Servicio( req.body )

        try {
            const ubicacion = await geocoder.reverse({ lat: req.body.ubicacion.lat, lon: req.body.ubicacion.long });
            const { formattedAddress, city, administrativeLevels } = ubicacion[0];

            servicio.domicilioNormalizado = formattedAddress;
            servicio.localidad = city;
            servicio.provincia = administrativeLevels.level1long;
            
            
        } catch (error) {

            console.log(error)
            
        }


        try {
            
            servicio.user = uid;
            servicio.empresa = empresa;

           
            await servicio.save();

            await informarRegistro(servicio)
            
            return res.status(201).json({
                ok: true,
                msg:'Servicio Creado',
                servicio:{
                    id: servicio.id,
                    estado: servicio.estado
                }
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

const servicios = await Servicio.find();



return res.status(200).json({
    ok:"true",
    servicios
})


},

updateService: async(req, res = response)=>{

    const id = req.params.id;
    const uid = req.uid;
    
    try {
        
        const servicio = await Servicio.findById( id );
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

       const estado = req.body.estado;
       const diagnostico = req.body.diagnostico;

       await Servicio.updateOne({ _id: id },{$set: {"estado": estado, "diagnostico": diagnostico}})

        return res.status(200).json({
            ok:"true",
            msg:"Servicio Actualizado",
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