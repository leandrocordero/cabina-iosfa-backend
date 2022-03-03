class Mensaje {
    constructor( uid, nombre, mensaje, msgStatus ) {
        this.uid       = uid;
        this.nombre    = nombre;
        this.mensaje   = mensaje;
        this.msgStatus = msgStatus;
    }
}


class ChatMensajes {

    constructor() {
        this.mensajes = [];
        this.usuarios = {};
    }

    get ultimos10() {
        this.mensajes = this.mensajes.splice(0,10);
        return this.mensajes;
    }

    get usuariosArr() {
        return Object.values( this.usuarios ); // [ {}, {}, {}]
        console.log(this.usuarios)
    }

    enviarMensaje( uid, nombre, mensaje ) {
        this.mensajes.unshift(
            new Mensaje(uid, nombre, mensaje)
        );
    }

    conectarUsuario( usuario ) {
        this.usuarios[usuario.uid] = usuario
    
    }

    desconectarUsuario( uid ) {
        delete this.usuarios[uid];
   
       
    }

    actualizarStatusUsuario( msgStatus ){

        let uid = msgStatus[1];
        let status = msgStatus[0];
 
        this.usuarios[uid].msgStatus = status;
    }

}

module.exports = ChatMensajes;