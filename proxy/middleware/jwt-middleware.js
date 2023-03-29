
const express = require('express');
const jwt = require('jsonwebtoken');
const middleware = express.Router();
const config = require('../config/jwt');

middleware.use ((req,res,next) =>{
    
    const token = req.headers['x-access-token']

    if (token){
        const decode = jwt.verify(token, config.key, (err, decoded)=>{
            if(err)
                return res.status(403).json({mensaje: "Token inválido"})
            else
                next();
        })
    }
    else{
        return res.status(401).send({mensaje: 'Token no proporcionado'});
    }
    
})

module.exports = middleware; 