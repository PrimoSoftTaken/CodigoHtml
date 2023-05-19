/* creación de constantes para la invocación del servidor */
const express = require("express");
const {createServer} = require("http");
const realtimeServer = require("./public/javascripts/realtimeServer");

const app = express();
const httpServer = createServer(app);
const cookieParser = require('cookie-parser');

app.use(cookieParser());

const socketIO = require('socket.io');
const http = require('http');
const server = http.createServer(app);

/* definición de ruta y puerto del servidor de pruebas */
app.set("port", process.env.PORT || 8688);

httpServer.listen( app.get("port"),()=>{
    console.log(`Server corriendo en el puerto http://localhost:${app.get("port")}`);
});

/* llamado al servidor de Socket.oi */
realtimeServer(httpServer);

/* Establecer la carpeta pública */
app.use(express.static(__dirname + '/public'));


// IO = se conencta con backend
let io = socketIO(server);

/* establecer las carpetas estáticas */
app.use(express.static(__dirname + '/node_modules/bootstrap/'));
app.use(express.static(__dirname + '/node_modules/jquery/'));
app.use(express.static(__dirname + '/public/'));

/* indicación para la captura de datos con método post */
const { json } = require("express");
app.use(express.urlencoded({extended:false}));
app.use(express.json());

/* EJS como motor de plantillas*/
app.set('view engine','ejs');

/* llamado del enrrutador */
app.use('/', require('./router'));

/* Configuración de Socket.IO*/
io.on('connection', socket => {
  //console.log('Nuevo cliente conectado');

  socket.on('disconnect', () => {
    //console.log('Cliente desconectado');
  });
});  
