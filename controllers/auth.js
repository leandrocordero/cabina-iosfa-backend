const { response } = require('express');
const Usuario = require('../database/models/Usuario');
const bcrypt = require('bcryptjs');
const { generarJwt } = require('../helpers/jwt');

const authController = {

    loguin: async(req,res = response)=>{
        const { email, password } = req.body;
        
        try {
            //chequear si el usuario existe
            const usuario =  await Usuario.findOne({ email });
            
            if(!usuario){

                return res.status(400).json({

                    ok: false,
                    msg: 'El usuario no existe con ese email'

                });
            }

            if(usuario.status === 'INACTIVO'){

                return res.status(400).json({

                    ok: false,
                    msg: 'Cuenta Pendiente de Autorización'

                });
            }

            //validar password

            const validPassword = bcrypt.compareSync(password, usuario.password);

            if(!validPassword){

                return res.status(400).json({
                    ok: false,
                    msg: 'Password no valida'

                })
            }
    
            //generar jwt
            const token = await generarJwt(usuario.id, usuario.name, usuario.photoURL, usuario.empresa, usuario.status );

            res.json({
                ok: true,
                uid: usuario.id,
                user:{name: usuario.name,
                      avatar: usuario.photoURL,
                      empresa: usuario.empresa},
                status: usuario.status,                
                token
            })


        } catch (error) {

            console.log(error)
            res.status(500).json({
                ok: false,
                msg: 'Error interno pongase en contacto con el administrador del sitio.'
            })

            
        }
        
      },

        createNew: async(req,res = response)=>{
        
            try{

                const { email, password } = req.body;
                let usuario =  await Usuario.findOne({ email });
            
                if(usuario){

                    return res.status(400).json({

                        ok: false,
                        msg: 'El usuario ya existe con ese correo'

                    });
                }
        
                usuario = new Usuario( {...req.body, photoURL:'', status:'INACTIVO'} );
                
            //Encriptar password
            
                const salt = bcrypt.genSaltSync();

                usuario.password = bcrypt.hashSync(password, salt);
                
                await usuario.save();

                //generar jwt

                const token = await generarJwt(usuario.id, usuario.name, usuario.photoURL, usuario.empresa, usuario.status);

                
                res.status(201).json({
                    ok: true,
                    uid: usuario.id,
                    user:{name: usuario.name,
                      avatar: usuario.photoURL,
                      empresa: usuario.empresa},
                    status: usuario.status,                
                    token
                   
                })
            }catch(error){
                console.log(error)
                res.status(500).json({
                    ok: false,
                    msg: 'Error interno pongase en contacto con el administrador del sitio.'
                })

            }
           
      },

      socialLogin: async(req, res =response)=>{

        const uid = req.body.uid;
        const name = req.body.name;
        const email = req.body.email;
        const photoURL = req.body.photoURL;

        
        let usuario =  await Usuario.findOne({ email });
        
        if(!usuario){
            
            try{
                
                //crear el usuario
                usuario = new Usuario( { name,email,uid,photoURL } );
                
                //Crear y encriptar password
            
                const pswd = 'asdasdwmeorwmnerono234242rwdfsdf';
                const salt = bcrypt.genSaltSync();

                usuario.password = bcrypt.hashSync(pswd, salt);
                
                await usuario.save();

                //generar jwt

                const token = await generarJwt(usuario.id, usuario.name, usuario.photoURL);

                
                res.status(201).json({
                    ok: true,
                    uid: usuario.id,
                    name: usuario.name,
                    email: usuario.email,
                    photoURL: usuario.photoURL,
                    token   
                    
                })
            }catch(error){
                console.log(error)
                res.status(500).json({
                    ok: false,
                    msg: 'Error interno pongase en contacto con el administrador del sitio.'
                })
            };
            
        }else{
           
            const token = await generarJwt(usuario.id, usuario.name, usuario.photoURL);
                
            res.status(201).json({
                ok: true,
                uid: usuario.id,
                name: usuario.name,
                email: usuario.email,
                photoURL: usuario.photoURL,
                token   
                
            })
        }


      },

      socketAuth: async(req, res=response)=>{

        const token = await generarJwt(req.uid, req.name, req.photoURL, req.empresa, req.status);
        
        res.status(201).json({
            ok: true,
            uid: req.uid,
            user:{name: req.name,
                  avatar: req.photoURL,
                  empresa: req.empresa},
            status: req.status,
            token
                
        })



      },

      renew: async(req,res = 
        response)=>{
            
            const uid = req.uid;
            const name = req.name;
            const photoURL = req.photoURL
            const empresa = req.empresa
            
            const token = await generarJwt(uid, name, photoURL, empresa)

            res.json({
            ok: true,
            token,
            name,
            uid,
            emrepsa,
            photoURL
            

         })

        }

    
}


module.exports = authController;