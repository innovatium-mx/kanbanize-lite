//import fetch from 'node-fetch';
//let fetch = await import('node-fetch').
const fetch = require('node-fetch');

module.exports.login = (req,res) =>{
    const email = req.body.email;
    const pass = req.body.pass;

    const formData = JSON.stringify({
        "email": email,
        "pass": pass,
    });
    
   fetch(`https://university6y.kanbanize.com/index.php/api/kanbanize/login//format/json`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: formData,
    })
    .then((response) => response.json())
    .then((data) => {
        console.log(data);
        res.json(data);
    })
    .catch((error) => {
        res.send(error);
        });
}
