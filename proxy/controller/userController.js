const fetch = require('node-fetch');

module.exports.login = (req,res) =>{
    const host = req.params.host;
    const email = req.body.email;
    const pass = req.body.pass;
    

    const formData = JSON.stringify({
        "email": email,
        "pass": pass,
    });
    
   fetch(`https://${host}.kanbanize.com/index.php/api/kanbanize/login//format/json`, {
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

module.exports.checkToken = (req,res) =>{
    const host = req.params.host;
    const apikey = req.headers.apikey;
    
   fetch(`https://${host}.kanbanize.com/api/v2/me`, {
            method: "GET",
            headers: {
                "apikey": apikey
            },
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

