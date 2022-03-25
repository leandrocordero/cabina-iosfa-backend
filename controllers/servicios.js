
const { response } = require('express');
const Servicio = require('../database/models/Servicio');
const { find } = require('../database/models/Servicio');
const NodeGeocoder = require('node-geocoder');
const { informarRegistro } = require('../sockets/socketController');

const options = {
    provider: 'google',
    apiKey: process.env.GOOGLE_MAPS_API_KEY,
  };
  
const geocoder = NodeGeocoder(options);

const serviciosController = {

    
      setServicio: async(req,res = 
        response)=>{

        
        //const { fecha, nombre, color, domicilio, localidad } = req.body
        const { uid, empresa, fecha } = req;
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
            servicio.fecha = Date(fecha)

            
           
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

const fechaMin = new Date(req.body.fechaMin);
const fechaMax = new Date(req.body.fechaMax);

const servicios = await Servicio.aggregate([{"$match" : { fecha: {"$gte": fechaMin,"$lte":fechaMax} }},{ $sort: { _id:1 } }

]);


return res.status(200).json({
    ok:"true",
    servicios
})


},

getGamStats:async(req, res = response)=>{

    const gam = {
        tomado: null,
        enCurso: null,
        fPresencial: null,
        fTeleasistencia: null,
        cancelado: null
    }

    const empresas = {
        vittal: null,
        gam: null
    }

    const fechaMin = new Date(req.body.fechaMin);
    const fechaMax = new Date(req.body.fechaMax)

    const total = await Servicio.find().count();

    const gamServ = await Servicio.aggregate([{"$match" : { fecha: {"$gte": fechaMin,"$lte":fechaMax}, empresa: "GRUPO AYUDA MEDICA" }},
    {"$group" : {_id:"$estado", count:{$sum:1}}},{ $sort: { _id:1 } }

]);

    gam.tomado = (gamServ.filter(estado => estado._id === 'Tomado')[0]?.count);
    gam.enCurso = (gamServ.filter(estado => estado._id === 'En Curso')[0]?.count);
    gam.fPresencial = (gamServ.filter(estado => estado._id === 'Finalizado Presencial')[0]?.count);
    gam.fTeleasistencia = (gamServ.filter(estado => estado._id === 'Finalizado Teleasistencia')[0]?.count);
    gam.cancelado = (gamServ.filter(estado => estado._id === 'Cancelado')[0]?.count);



    const estado = await Servicio.aggregate([{"$match" : { fecha: {"$gte": fechaMin,"$lte":fechaMax} }},
        {"$group" : {_id:"$estado", count:{$sum:1}}},{ $sort: { _id:1 } }

    ]);

    const empresa = await Servicio.aggregate([{"$match" : { fecha: {"$gte": fechaMin,"$lte":fechaMax}, estado: 'Finalizado Presencial' || 'Finalizado Teleasistencia'  }},
        {"$group" : {_id:"$empresa", count:{$sum:1}}}, { $sort: { _id:1 } }
    ]);

    console.log(empresa)
    empresas.vittal = (empresa.filter(empresa => empresa._id === 'VITTAL')[0]?.count);
    empresas.gam = (empresa.filter(empresa => empresa._id === 'GRUPO AYUDA MEDICA')[0]?.count);



    return res.status(200).json({
        ok:"true",
        total,
        estados: gam,
        empresas
    })
    

},

getVittalStats:async(req, res = response)=>{

    const estados = {
        tomado: null,
        enCurso: null,
        fPresencial: null,
        fTeleasistencia: null,
        cancelado: null
    }

    const vittal = {
        tomado: null,
        enCurso: null,
        fPresencial: null,
        fTeleasistencia: null,
        cancelado: null
    }

    const empresas = {
        vittal: null,
        gam: null
    }

    const fechaMin = new Date(req.body.fechaMin);
    const fechaMax = new Date(req.body.fechaMax)

    const total = await Servicio.find().count();

    const vittalServ = await Servicio.aggregate([{"$match" : { fecha: {"$gte": fechaMin,"$lte":fechaMax}, empresa: "VITTAL" }},
    {"$group" : {_id:"$estado", count:{$sum:1}}},{ $sort: { _id:1 } }

]);

    vittal.tomado = (vittalServ.filter(estado => estado._id === 'Tomado')[0]?.count);
    vittal.enCurso = (vittalServ.filter(estado => estado._id === 'En Curso')[0]?.count);
    vittal.fPresencial = (vittalServ.filter(estado => estado._id === 'Finalizado Presencial')[0]?.count);
    vittal.fTeleasistencia = (vittalServ.filter(estado => estado._id === 'Finalizado Teleasistencia')[0]?.count);
    vittal.cancelado = (vittalServ.filter(estado => estado._id === 'Cancelado')[0]?.count);


    const estado = await Servicio.aggregate([{"$match" : { fecha: {"$gte": fechaMin,"$lte":fechaMax} }},
        {"$group" : {_id:"$estado", count:{$sum:1}}},{ $sort: { _id:1 } }

    ]);

    const empresa = await Servicio.aggregate([{"$match" : { fecha: {"$gte": fechaMin,"$lte":fechaMax} }},
        {"$group" : {_id:"$empresa", count:{$sum:1}}}, { $sort: { _id:1 } }
    ]);

    estados.tomado = (estado.filter(estado => estado._id === 'Tomado')[0]?.count);
    estados.enCurso = (estado.filter(estado => estado._id === 'En Curso')[0]?.count);
    estados.fPresencial = (estado.filter(estado => estado._id === 'Finalizado Presencial')[0]?.count);
    estados.fTeleasistencia = (estado.filter(estado => estado._id === 'Finalizado Teleasistencia')[0]?.count);
    estados.cancelado = (estado.filter(estado => estado._id === 'Cancelado')[0]?.count);

    empresas.vittal = (empresa.filter(empresa => empresa._id === 'VITTAL')[0]?.count);
    empresas.gam = (empresa.filter(empresa => empresa._id === 'GRUPO AYUDA MEDICA')[0]?.count);



    return res.status(200).json({
        ok:"true",
        total,
        vittal,
        estados,
        empresas
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
       await informarRegistro(servicio)
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