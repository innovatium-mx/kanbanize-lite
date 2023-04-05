const fetch = require('node-fetch');

module.exports.boards = async (req,res) =>{
    const host = req.params.host;
    const userid = req.params.userid;
    const apikey = req.headers.apikey;
    var boardsId = [];
    var boards = [];
    
    const response = await  fetch(`https://${host}.kanbanize.com/api/v2/users/${userid}/boardRoles`, {
        method: "GET",
        headers: {
            "apikey": apikey
        },
    })
    const data = await response.json();
    boardsId = data.data;

    await Promise.all(
        boardsId.map(async function(element){
            const response = await  fetch(`https://${host}.kanbanize.com/api/v2/boards/${element.board_id}`, {
                method: "GET",
                headers: {
                    "apikey": apikey
                },
            })
            const data = await response.json();
            boards.push({"board_id": element.board_id,"workspace_id": data.data.workspace_id, "is_archived": data.data.is_archived, "name": data.data.name, "description": data.data.description});
        })
    )
    console.log(boards);
    res.json(boards);
}