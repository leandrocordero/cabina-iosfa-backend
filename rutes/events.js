const { Router } = require('express');
const { check } = require('express-validator');
const router = Router();
const { getEvents, setEvent, updateEvent, deleteEvent } = require('../controllers/events');

const { isDate } = require('../helpers/isDate');
const validarCampos = require('../middlewares/validar-campos');
const { validarJwt } = require('../middlewares/validar-jwt');
const { getCoords } = require('../controllers/geoCoder');

//event routes

//aplicando middleware a la ruta

router.use( validarJwt)
//crear evento
router.post('/newEvent',[
    check('title','titulo es obligatorio').not().isEmpty(),
    check('start','Fecha de inicio es obligatoria').custom( isDate ),
    check('end','Fecha de inicio es obligatoria').custom( isDate ),
    validarCampos
],setEvent )

//obtener eventos
router.get('/getEvents',getEvents )

//actualizar evento
router.put('/updateEvent/:id',[
    check('title','titulo es obligatorio').not().isEmpty(),
    check('start','Fecha de inicio es obligatoria').custom( isDate ),
    check('end','Fecha de inicio es obligatoria').custom( isDate ),
    validarCampos
],updateEvent )

//eleminar evento
router.delete('/deleteEvent/:id',deleteEvent )

router.get('/getCoords',getCoords)



module.exports = router;