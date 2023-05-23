const cors =require('cors');
const express = require('express');
const fileUpload = require('express-fileupload');

const app = express();
const port = process.env.PORT || 4000;

const user = require('./routes/user');
const board = require('./routes/board');
const card = require('./routes/card')
const attachment = require('./routes/attachment')

////////////////
app.use(cors());
app.use(fileUpload());
/////////////////

app.use(express.json());

app.use('/',user);
app.use('/',board);
app.use('/',card);
app.use('/',attachment);

//Función callback -> función que se ejecuta como respuesta a un evento o acción
app.listen(port, () =>{
    console.log(`Servidor iniciado en el puerto ${port}`);
})
