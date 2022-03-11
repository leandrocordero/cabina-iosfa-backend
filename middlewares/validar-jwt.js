const { response } = require('express');
const jwt = require('jsonwebtoken');

const validarJwt = (req, res=response, next)=>{

//x-token headers

const token = req.header('x-token');
if(!token){

res.status(401).json({
ok: false,
msg:'no hay token en la petición'

})
}

try {
    
const tokens = jwt.verify(token, process.env.SECRET_JWT_SEED);

const { uid, name, photoURL, status, empresa } = tokens

req.uid = uid;
req.name = name;
req.photoURL = photoURL;
req.empresa = empresa;
req.status = status;

} catch (error) {
    return res.status(401).json({
        ok: false,
        msg:'Token invalido'

    });
}
next();
}

module.exports = {
    validarJwt
}