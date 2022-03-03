const jwt = require('jsonwebtoken');

const generarJwt = (uid, name, photoURL)=>{

    return new Promise((resolve, rejetct)=>{

        const payload = {
            uid,
            name,
            photoURL
        }

        jwt.sign(payload, process.env.SECRET_JWT_SEED, {
            expiresIn: '2h'
        }, (err,token)=>{


            if(err){
                console.log(err);
                rejetct('nose pudo generar el token');

            }

            resolve(token);

        })

    })


}


const comprobarJwt = (socketToken='')=>{


    try {
    
        const {uid, name, photoURL} =  jwt.verify(socketToken, process.env.SECRET_JWT_SEED);
        return [true, uid, name, photoURL]

        
    } catch (error) {
        return [false,null,null]
    }


}

module.exports = {
    generarJwt,
    comprobarJwt
}