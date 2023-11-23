const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(express.static('./src/controller/postura_corporal'));

//require('dotenv').config();//Variable de entorno
//const keys = require('./settings/keys');//keys
const puerto = process.env.PORT || 5000;//PUERTO DEL SERVER


//middlewares
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Importa tus rutas
const routes = require('./src/route/index.routes');
app.use('/api', routes);

app.listen(puerto, async () => {
    console.log(`Servidor escuchando en el puerto ${puerto}`);
});
