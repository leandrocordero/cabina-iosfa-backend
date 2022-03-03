const jwt = require('jsonwebtoken');
const { comprobarJwt } = require('../helpers/jwt');
const ChatMensajes = require('./chat-mensajes');

const chatMensajes = new ChatMensajes();

const socketControler = async( socket, io )=>{
//console.log(socket.handshake.query['x-token'])

const socketToken = socket.handshake.query['x-token'];

const [valido, uid, nombre, photoURL] = comprobarJwt(socketToken);

if(!valido){
    console.log("socket no identificado");
    return socket.disconnect();
}

 //Agregar Usuario conectado

const usuario = {uid, nombre,photoURL,msgStatus:"Online"};

 chatMensajes.conectarUsuario(usuario);

io.emit('nuevo-usuario-conectado', usuario);
io.emit('usuarios-activos', chatMensajes.usuariosArr);


/*try {
    if(!socketToken){

        return null
    }

    const {uid, name, photoURL} =  jwt.verify(socketToken, process.env.SECRET_JWT_SEED);

    if(!uid){
        return socket.disconect();
    }

    //Agregar Usuario conectado

chatMensajes.conectarUsuario({
    uid,
    name,
    photoURL
});
    
} catch (error) {
    return null
}

io.emit('usuarios-activos', chatMensajes.usuariosArr)



socket.on('disconnect', ()=>{
  
    chatMensajes.desconectarUsuario( uid );
    io.emit('usuarios-activos', chatMensajes.usuariosArr);
    
});


socket.on('set-offline', (payload)=>{
     console.log(`El usuario ${ payload.user } esta offline`)
});


*/

socket.on('change-user-status',(msgStatus)=>{

    chatMensajes.actualizarStatusUsuario(msgStatus)
    io.emit('usuarios-activos', chatMensajes.usuariosArr)
    
})


socket.on('disconnect', ()=>{
    chatMensajes.desconectarUsuario( uid ); 
    console.log(`Usuario Desconectado`)
    io.emit('usuarios-activos', chatMensajes.usuariosArr)
    

});

};




module.exports = {

socketControler,

}