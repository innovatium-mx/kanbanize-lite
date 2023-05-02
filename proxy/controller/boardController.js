const fetch = require('node-fetch');

function FindParents(element, columns){
    var parent_list = [];
    const parent = columns.find(item => item.column_id === element.parent_column_id);
    const parentData = {parent_id: parent.column_id, parent_name: parent.name, parent_section: parent.section, parent_position: parent.position};
    parent_list.push(parentData);
    if(parent.parent_column_id !== null){
        if(Array.isArray(parent.parent_column_id)){
            parent_list = parent_list.concat(parent.parent_column_id);
            return parent_list;
        }
        else{
            parent_list = parent_list.concat(FindParents(parent, columns));
            return parent_list;
        }
    }
    else{
        return parent_list;
    }
}

module.exports.workSpaces = async (req,res) =>{
    const host = req.params.host;
    const apikey = req.headers.apikey;
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
        res.json({"error": 500});
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
        res.json({"error": 500});
    }
}

module.exports.boardDetails = async (req,res) =>{
    const host = req.params.host;
    const boardid = req.params.boardid;
    const apikey = req.headers.apikey;
    var users = [];
    try{
        const response1 = await  fetch(`https://${host}.kanbanize.com/api/v2/boards/${boardid}/workflows`, {
            method: "GET",
            headers: {
                "apikey": apikey
            },
        })
        if (response1.ok){
            const data1 = await response1.json()
            const boardWorkflow = data1.data;
            boardWorkflow.sort(function(a , b){
                return a.position - b.position;
            });
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
                    var columns = [];
                    boardColumns.map( function(element){
                        if(element.workflow_id === workflowid){
                            columns.push(element)
                        }
                    })
                    /*columns.sort(function(a , b){
                        return a.section - b.section;
                    })*/
                    for(var x = 0; x < columns.length; x++){
                        if(columns[x].parent_column_id !== null){
                            columns[x].parent_column_id = FindParents(columns[x], columns);
                        }
                    }
                    /*for(var x = 0, len = columns.length ; x < len ; x++){
                        if(columns[x].parent_column_id !== null){
                            for(var y = 0; y < columns[x].parent_column_id.length; y++){
                                var indexToDelete = -1;
                                const deleteObject = columns.find(function(item, i){
                                    if(item.column_id === columns[x].parent_column_id[y].parent_id){
                                        indexToDelete = i;
                                        return i; 
                                    }
                                });
                                columns.splice(indexToDelete, indexToDelete+1);
                                len = columns.length;
                            }
                        }
                    }*/
                    for(var x = 0; x < columns.length; x++){
                        if(columns[x].parent_column_id !== null){
                            const columnsLength = columns[x].parent_column_id.length;
                            columns[x].order = columns[x].parent_column_id[ columnsLength - 1].parent_section + ((1.0 / (columnsLength + 1.0)) * columns[x].position );
                        }
                        else{
                            columns[x].order = columns[x].section * 1.0;
                        }
                    }
                    columns.sort(function(a , b){
                        return a.order - b.order;
                    });
                    boardWorkflow[i].columns = columns;
                }
                const response3 = await  fetch(`https://${host}.kanbanize.com/api/v2/cards?board_ids=${boardid}&per_page=1000&page=${1}`, {
                    method: "GET",
                    headers: {
                        "apikey": apikey
                    },
                })
                if(response3.ok){
                    const data3 = await response3.json();
                    var boardCards = data3.data.data;
                    const pages = data3.data.pagination.all_pages;
                    if( pages > 1){
                        for(var page = 2; page <= pages; page++){
                            const responseCardPages = await  fetch(`https://${host}.kanbanize.com/api/v2/cards?board_ids=${boardid}&per_page=1000&page=${page}`, {
                                method: "GET",
                                headers: {
                                    "apikey": apikey
                                },
                            }) 
                            if(responseCardPages.ok){
                                const rawCardPages = await responseCardPages.json();
                                boardCards = boardCards.concat(rawCardPages.data.data);
                            }
                            else{
                                res.json({"error": responseCardPages.status});
                            }
                        }
                    }
                    const responseUsers = await  fetch(`https://${host}.kanbanize.com/api/v2/users`, {
                        method: "GET",
                        headers: {
                            "apikey": apikey
                        },
                    })
                    if(responseUsers.ok){
                        const rawUsers = await responseUsers.json();
                        users = rawUsers.data;
                    }
                    else{
                        res.json({"error": responseUsers.status});
                    }
                    for(var x=0; x<boardWorkflow.length;x++){
                        for(var y=0; y<boardWorkflow[x].columns.length;y++){
                            const columnid = boardWorkflow[x].columns[y].column_id;
                            const columnCards = [];
                            boardCards.map( async function(element){
                                if(element.column_id === columnid){
                                    if(element.owner_user_id){
                                        const userObject = users.find(item => item.user_id === element.owner_user_id);
                                        columnCards.push({
                                            "card_id": element.card_id,
                                            "custom_id": element.custom_id,
                                            "title": element.title,
                                            "owner_user_id": element.owner_user_id,
                                            "owner_username": userObject.username,
                                            "owner_avatar": userObject.avatar,
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
                            if(columnCards.length != 0){
                                columnCards.sort(function(a , b){
                                    return a.position - b.position;
                                });
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
        res.json({"error": 500});
    }
}