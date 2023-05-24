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
                    res.json({"status":false, "response": "Error fetching user data"});
                }
            }
            else{
                res.json({"status":false, "response": "Error fetching user data"});
            }
        }
        else {
            res.json({"status":false, "response": "Error fetching user data"});
        }
    }
    catch(error){
        console.error(error);
        res.json({"error": 500});
    }
}