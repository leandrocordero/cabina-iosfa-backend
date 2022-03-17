const jwt = require('jsonwebtoken');
const { comprobarJwt } = require('../helpers/jwt');

const socketControler = async( socket, io )=>{

const socketToken = socket.handshake.query['x-token'];

const [valido, uid, nombre, photoURL] = comprobarJwt(socketToken);

if(!valido){
    console.log("socket no identificado");
    return socket.disconnect();
}

const usuario = {uid, nombre,photoURL,msgStatus:"Online"};

io.emit('nuevo-usuario-conectado', usuario);

socket.on('change-user-status',(data)=>{
    console.log("usuario conectado");
    console.log(data)
   
})


socket.on('disconnect', ()=>{
    console.log(`Usuario Desconectado`)
});



};


const informarRegistro = async (data)=>{
    
    global.io.emit('nuevo-registro-cargado', data);


}




module.exports = {
    informarRegistro,
    socketControler
}