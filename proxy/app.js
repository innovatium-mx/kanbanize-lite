const multer = require('multer');
const cors =require('cors');
const express = require('express');

const app = express();
const port = process.env.PORT || 4000;

const user = require('./routes/user');
const board = require('./routes/board');

////////////////
app.use(cors());
app.use(multer().array());
/////////////////

app.use(express.json());

app.use('/',user);
app.use('/',board);

//Función callback -> función que se ejecuta como respuesta a un evento o acción
app.listen(port, () =>{
    console.log(`Servidor iniciado en el puerto ${port}`);
})
