const { Router } = require('express');
const { check } = require('express-validator');
const router = Router();
const { getServicios, setServicio, deleteEvent, updateService } = require('../controllers/servicios');

const { isDate } = require('../helpers/isDate');
const validarCampos = require('../middlewares/validar-campos');
const { validarJwt } = require('../middlewares/validar-jwt');

//event routes

//aplicando middleware a la ruta

router.use( validarJwt)
//crear evento
router.post('/newService',[
    check('fecha','fecha es obligatorio').not().isEmpty(),
    check('fecha','fecha debe tener formato fecha').custom( isDate ),
    check('nombre','nombre es obligatorio').not().isEmpty(),
    check('color','color es obligatorio').not().isEmpty(),
    validarCampos
],setServicio )

//obtener eventos
router.get('/getServices',getServicios )

//actualizar evento
router.put('/updateService/:id',[
    check('id','id es obligatorio').not().isEmpty(),
    validarCampos
],updateService )

//eleminar evento
router.delete('/deleteEvent/:id',deleteEvent )




module.exports = router;