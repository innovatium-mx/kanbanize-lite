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
    if (response.ok){
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
                if (response.ok){
                    const data = await response.json();
                    boards.push({"board_id": element.board_id,"workspace_id": data.data.workspace_id, "is_archived": data.data.is_archived, "name": data.data.name, "description": data.data.description});
                }
                else{
                    res.json({"error": response.status});
                }
            })
        )
        console.log(boards);
        res.json(boards);
    }
    else{
        res.json({"error": response.status});
    }
    
}

module.exports.boardDetails = async (req,res) =>{
    const host = req.params.host;
    const boardid = req.params.boardid;
    const apikey = req.headers.apikey;

    //Workflows
    const response1 = await  fetch(`https://${host}.kanbanize.com/api/v2/boards/${boardid}/workflows`, {
        method: "GET",
        headers: {
            "apikey": apikey
        },
    })
    if (response1.ok){
        const data = await response1.json();
        const boardWorflow = data.data;

        /*const response2 = await  fetch(`https://${host}.kanbanize.com/api/v2/boards/${boardid}/columns`, {
            method: "GET",
            headers: {
                "apikey": apikey
            },
        })
        if (response2.ok){
            const data = await response2.json();
            boards.push({"board_id": element.board_id,"workspace_id": data.data.workspace_id, "is_archived": data.data.is_archived, "name": data.data.name, "description": data.data.description});
        }
        else{
            res.json({"error": response2.status});
        }*/
        res.json(boardWorflow);

    }
    else {
        res.json({"error": response1.status});
    }

}