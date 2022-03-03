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

            //validar password

            const validPassword = bcrypt.compareSync(password, usuario.password);

            if(!validPassword){

                return res.status(400).json({
                    ok: false,
                    msg: 'Password no valida'

                })
            }
    
            //generar jwt
            const token = await generarJwt(usuario.id, usuario.name, usuario.photoURL);

            res.json({
                ok: true,
                uid: usuario.id,
                name: usuario.name,
                photoURL: usuario.photoURL,
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

                const { email, password, photoURL } = req.body;
                let usuario =  await Usuario.findOne({ email });
            
                if(usuario){

                    return res.status(400).json({

                        ok: false,
                        msg: 'El usuario ya existe con ese correo'

                    });
                }
        
                usuario = new Usuario( {...req.body, photoURL:''} );
                
            //Encriptar password
            
                const salt = bcrypt.genSaltSync();

                usuario.password = bcrypt.hashSync(password, salt);
                
                await usuario.save();

                //generar jwt

                const token = await generarJwt(usuario.id, usuario.name, usuario.photoURL);

                
                res.status(201).json({
                    ok: true,
                    uid: usuario.id,
                    name: usuario.name,
                    token,
                    photoURL   
                    
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

        const token = await generarJwt(req.uid, req.name, req.photoURL);

        res.status(201).json({
            ok: true,
            uid: req.uid,
            name: req.name,
            photoURL: req.photoURL,
            token
               
            
        })



      },

      renew: async(req,res = 
        response)=>{
            
            const uid = req.uid;
            const name = req.name;
            const photoURL = req.photoURL
            
            const token = await generarJwt(uid, name, photoURL)

            res.json({
            ok: true,
            token,
            name,
            uid,
            photoURL
            

         })

        }

    
}


module.exports = authController;