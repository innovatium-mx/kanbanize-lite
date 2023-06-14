const fetch = require('node-fetch');

module.exports.login = async (req,res) =>{
    const host = req.params.host;
    const email = req.body.email;
    const pass = req.body.pass;

    const formData = JSON.stringify({
        "email": email,
        "pass": pass,
    });

    try{
        const response1 = await fetch(`https://${host}.kanbanize.com/index.php/api/kanbanize/login//format/json`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: formData,
        })
        if (response1.ok) {
            const data1 = await response1.json();
            if(data1.apikey){
                const response2 = await  fetch(`https://${host}.kanbanize.com/api/v2/me`, {
                    method: "GET",
                    headers: {
                        "apikey": data1.apikey
                    },
                })
                if (response2.ok) {
                    const data2 = await response2.json();
                    data1.avatar = data2.data.avatar;
                    res.json(data1);
                }
                else {
                    res.status(response2.status).json({"error": response2.status});
                }
            }
            else{
                res.status(401).json({"error": 401});
            }
        }
        else {
            res.status(response1.status).json({"error": response1.status});
        }
    }
    catch(error){
        console.error(error);
        res.status(500).json({"error": 500});
    }
}