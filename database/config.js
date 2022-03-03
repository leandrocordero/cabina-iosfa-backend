const mongoose = require('mongoose');

const dbConection = async()=>{

    try{

mongoose.connect(process.env.DB_URL,
    {    useNewUrlParser: true,
         useUnifiedTopology: true,
         useCreateIndex: true
        });

console.log('DB Online')

    }catch{

        console.log(error);
        throw new Error('Error al inicializar base de datos.');
    }


}

module.exports = {dbConection}