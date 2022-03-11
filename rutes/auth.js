const { Router } = require('express');
const router = Router();
const { check } = require('express-validator');
const {loguin, createNew, renew, socialLogin, socketAuth} = require('../controllers/auth');
const validarCampos = require('../middlewares/validar-campos');
const { validarJwt } = require('../middlewares/validar-jwt');


//auth routes
router.post('/',
            [
            check('email','el email es campo obligatorio').not().isEmpty(),
            check('email','El email debe tener el formato correcto').isEmail(),
            check('password','El pasword debe tener 6 caracteres o mas').isLength({min: 6}),
            validarCampos
            ],
            loguin )

router.post('/new',
            [check('name','el nombre es campo obligatorio').not().isEmpty(),
             check('email','el email es campo obligatorio').not().isEmpty(),
             check('email','El email debe tener el formato correcto').isEmail(),
             check('password','El pasword debe tener 6 caracteres o mas').isLength({min: 6}),
             check('empresa','la empresa es campo obligatorio').not().isEmpty(),
             validarCampos
             ],
             createNew )

router.get('/renew',[validarJwt], renew )
  
router.post('/socialLogin',
            [check('name','el nombre es campo obligatorio').not().isEmpty(),
             check('email','el email es campo obligatorio').not().isEmpty(),
             check('email','El email debe tener el formato correcto').isEmail(),
             //check('password','El pasword debe tener 6 caracteres o mas').isLength({min: 6, max: 6}),
             validarCampos
             ],
             socialLogin )

 router.get('/checkTwj',[validarJwt],socketAuth);            

module.exports = router;