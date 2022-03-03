const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const cors = require('cors');
const { dbConection } = require('./database/config');
const { socketControler } = require('./sockets/socketController');
const req = require('express/lib/request');
dotenv.config();

//crear server
const app = express();
const PORT = process.env.PORT;

const server = require('http').createServer(app);


const io = require('socket.io')(server, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"]
    }});

    //inicializacion de DB
 dbConection();

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

//escuchar peticiones
server.listen( PORT, ()=>{
  console.log(`CORS - HABILITADO. Servidor http corriendo en puerto ${ PORT }`)}
);

app.use(cors())

//directorio Publico
//app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

//lectura y parseo del body

app.use( express.json() );

app.use('/api/auth', require('./rutes/auth'));
app.use('/api/services',require('./rutes/services'));


/** Para cualquier otra petición */
app.get('*', ( req, res ) => {
  res.sendFile( path.join( __dirname+'/public/index.html' ) );
});


