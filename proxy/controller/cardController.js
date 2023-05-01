const fetch = require('node-fetch');

module.exports.cardDetails = async (req,res) =>{
    const host = req.params.host;
    const cardid = req.params.cardid;
    const apikey = req.headers.apikey;
    var users = [];

    try{
        const response1 = await  fetch(`https://${host}.kanbanize.com/api/v2/cards/${cardid}`, {
            method: "GET",
            headers: {
                "apikey": apikey
            },
        })
        if (response1.ok){
            const data1 = await response1.json()
            const cardDetails = data1.data;
            res.json(cardDetails);
        }
        else {
            res.json({"error": response1.status});
        }
    }
    catch(error){
        console.error(error);
        res.json({"error": 500});
    }
};