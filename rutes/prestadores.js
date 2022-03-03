const { Router } = require('express');
const { check } = require('express-validator');
const router = Router();
const { setPrestador, getPrestadores, getPrestador } = require('../controllers/prestadores');
const { setComentario, 
        getComentarios, 
        updateComentarios, 
        deleteComentarios } = require('../controllers/comentarios');

const { isDate } = require('../helpers/isDate');
const validarCampos = require('../middlewares/validar-campos');
const { validarJwt } = require('../middlewares/validar-jwt');
const { createConversation } = require('../controllers/twilio');


router.use(validarJwt)

//crear prestador

router.post('/newPrestador',[
    check('nombre','nombre es obligatorio').not().isEmpty(),
    check('cuit','cuit es obligatoria').not().isEmpty(),
    check('fechaCreacion','Fecha de creacion es obligatoria').custom( isDate ),
    validarCampos
],setPrestador )


router.get('/getPrestadores',[validarCampos],getPrestadores)

router.get('/getPrestador/:id',[validarCampos],getPrestador)

//crear comentario del prestador

router.post('/newComment',[
    /*check('nombre','nombre es obligatorio').not().isEmpty(),
    check('cuit','cuit es obligatoria').not().isEmpty(),
    check('fechaCreacion','Fecha de creacion es obligatoria').custom( isDate ),*/
    validarCampos
],setComentario )

// traer los comentartios.

router.get('/getComments/:id',[validarCampos],getComentarios)

//actualizar comentario
router.put('/updateComentario/:id',[
    /*check('title','titulo es obligatorio').not().isEmpty(),
    check('start','Fecha de inicio es obligatoria').custom( isDate ),
    check('end','Fecha de inicio es obligatoria').custom( isDate ),
    */validarCampos
],updateComentarios )

router.delete('/deleteComentario/:id',[
    /*check('title','titulo es obligatorio').not().isEmpty(),
    check('start','Fecha de inicio es obligatoria').custom( isDate ),
    check('end','Fecha de inicio es obligatoria').custom( isDate ),
    */validarCampos
],deleteComentarios )



router.get('/createConversation', createConversation)


module.exports = router;