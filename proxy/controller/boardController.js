const fetch = require('node-fetch');

module.exports.workSpaces = async (req,res) =>{
    const host = req.params.host;
    const apikey = req.headers.apikey;
    const workspaceid = req.params.workspaceid
    try{
        const response = await  fetch(`https://${host}.kanbanize.com/api/v2/workspaces?if_assigned_to_boards=1&is_archived=0`, {
            method: "GET",
            headers: {
                "apikey": apikey
            },
        })
        if (response.ok){
            const data = await response.json();
            const workSpaces = data.data;
            res.json(workSpaces);
        }
        else{
            res.json({"error": response.status});
        }
    }
    catch(error){
        console.error(error);
        res.json({"error": error});
    }
}

module.exports.boards = async (req,res) =>{
    const host = req.params.host;
    const apikey = req.headers.apikey;
    const workspaceid = req.params.workspaceid
    try{
        const response = await  fetch(`https://${host}.kanbanize.com/api/v2/boards?if_assigned=1&is_archived=0&workspace_ids=${workspaceid}`, {
            method: "GET",
            headers: {
                "apikey": apikey
            },
        })
        if (response.ok){
            const data = await response.json();
            const boards = data.data;
            res.json(boards);
        }
        else{
            res.json({"error": response.status});
        }
    }
    catch(error){
        console.error(error);
        res.json({"error": error});
    }
}

module.exports.boardDetails = async (req,res) =>{
    const host = req.params.host;
    const boardid = req.params.boardid;
    const apikey = req.headers.apikey;
    const usersDetails = [];
    const userIds = []

    try{
        const response1 = await  fetch(`https://${host}.kanbanize.com/api/v2/boards/${boardid}/workflows`, {
            method: "GET",
            headers: {
                "apikey": apikey
            },
        })
        if (response1.ok){
            const data1 = await response1.json();
            const boardWorkflow = data1.data;

            const response2 = await  fetch(`https://${host}.kanbanize.com/api/v2/boards/${boardid}/columns`, {
                method: "GET",
                headers: {
                    "apikey": apikey
                },
            })
            if (response2.ok){
                const data2 = await response2.json();
                const boardColumns = data2.data;
                for(var i=0; i<boardWorkflow.length;i++){
                    const workflowid = boardWorkflow[i].workflow_id;
                    const columns = [];
                    boardColumns.map( function(element){
                        if(element.workflow_id == workflowid){
                            columns.push({
                            "column_id": element.column_id, 
                            "section": element.section, 
                            "parent_column_id": element.parent_column_id,
                            "position": element.position,
                            "name": element.name,
                            "description": element.description,
                            "color": element.color,
                            "limit": element.limit,
                            "cards_per_row": element.cards_per_row,
                            "flow_type": element.flow_type,
                            "card_ordering": element.card_ordering
                            })
                        }
                    })
                    boardWorkflow[i].columns = columns;
                }
                const response3 = await  fetch(`https://${host}.kanbanize.com/api/v2/cards`, {
                    method: "GET",
                    headers: {
                        "apikey": apikey
                    },
                })
                if(response3.ok){
                    const data3 = await response3.json();
                    const cards = data3.data.data;
                    for(var x=0; x<boardWorkflow.length;x++){
                        for(var y=0; y<boardWorkflow[x].columns.length;y++){
                            const columnid = boardWorkflow[x].columns[y].column_id;
                            const columnCards = [];
                            await Promise.all(
                                cards.map( async function(element){
                                    if(element.column_id == columnid){
                                        if(!userIds.includes(element.owner_user_id ) && element.owner_user_id !=  null){
                                            userIds.push(element.owner_user_id);
                                            const owneruserid = element.owner_user_id;
                                            const response4 = await fetch(`https://${host}.kanbanize.com/api/v2/users/${owneruserid}`, {
                                                method: "GET",
                                                headers: {
                                                    "apikey": apikey
                                                },
                                            })
                                            if(response4.ok){
                                                const data4 = await response4.json();
                                                const owneruser = data4.data;
                                                usersDetails.push(owneruser);
                                            }
                                            else{
                                                res.json({"error": response4.status});
                                            }
                                        }
                                        if(element.owner_user_id){
                                            columnCards.push({
                                                "card_id": element.card_id,
                                                "custom_id": element.custom_id,
                                                "title": element.title,
                                                "owner_user_id": element.owner_user_id,
                                                "owner_username": usersDetails[userIds.indexOf(element.owner_user_id)].username,
                                                "owner_avatar": usersDetails[userIds.indexOf(element.owner_user_id)].avatar,
                                                "type_id": element.type_id,
                                                "color": element.color,
                                                "section": element.section,
                                                "lane_id": element.lane_id,
                                                "position": element.position
                                            })
                                        }
                                        else{
                                            columnCards.push({
                                                "card_id": element.card_id,
                                                "custom_id": element.custom_id,
                                                "title": element.title,
                                                "type_id": element.type_id,
                                                "color": element.color,
                                                "section": element.section,
                                                "lane_id": element.lane_id,
                                                "position": element.position
                                            })
                                        }
                                        
                                        
                                    }
                                })
                            )
                            if(columnCards.length != 0){
                                boardWorkflow[x].columns[y].cards = columnCards;
                            }
                        } 
                    }
                    res.json(boardWorkflow);
                }
                else{
                    res.json({"error": response3.status});
                }
            }
            else{
                res.json({"error": response2.status});
            }
        }
        else {
            res.json({"error": response1.status});
        }
    }
    catch(error){
        console.error(error);
        res.json({"error": error});
    }
}