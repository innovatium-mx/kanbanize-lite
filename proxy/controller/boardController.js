const fetch = require('node-fetch');

/*function boardDetails(data){
    var boards = [];
    for(var i = 0; i < data.data.length; i++)
    {
        var board_id = data.data[i].board_id   
        fetch(`https://${host}.kanbanize.com/api/v2/boards/${board_id}`, {
            method: "GET",
            headers: {
                "apikey": apikey
            },
        })
        .then((response) => response.json())
        .then((data) => {
            boards.push({"board_id": board_id, "is_archived": data.data.is_archived, "name": data.data.name, "description": data.data.description});
        })  
        .catch((error) => {
            console.log(error);
        });           
    }
    console.log(boards);
    return boards;
}*/

module.exports.boards = async (req,res) =>{
    const host = req.params.host;
    const userid = req.params.userid;
    const apikey = req.headers.apikey;
    
   fetch(`https://${host}.kanbanize.com/api/v2/users/${userid}/boardRoles`, {
            method: "GET",
            headers: {
              "apikey": apikey
            },
    })
    .then((response) => response.json())
    .then((data) => {
        res.json(data.data);
    })  
    .catch((error) => {
        res.send(error);
        });
}