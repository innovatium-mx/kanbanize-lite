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
            const responseBoard = await  fetch(`https://${host}.kanbanize.com/api/v2/boards?if_assigned=1&is_archived=0`, {
                method: "GET",
                headers: {
                    "apikey": apikey
                },
            });
            if (responseBoard.ok){
                const rawBoards = await responseBoard.json();
                const boards = rawBoards.data;
                for(var x=0; x < workSpaces.length; x++){
                    const finalBoards = [];
                    for(var y=0; y < boards.length; y++){
                        if(workSpaces[x].workspace_id === boards[y].workspace_id){
                            finalBoards.push(boards[y]);
                        }
                    }
                    if(finalBoards.length > 0){
                        workSpaces[x].boards = finalBoards;
                    }
                }
                res.json(workSpaces);
            }
            else{
                res.json({"error": responseBoard.status});
            }
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
    var boardUsers = [];
    var dataLanes = [];
    var notAssigned = false;
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
                const responseLanes = await  fetch(`https://${host}.kanbanize.com/api/v2/boards/${boardid}/lanes`, {
                    method: "GET",
                    headers: {
                        "apikey": apikey
                    },
                })
                if(responseLanes.ok){
                    const rawDataLanes = await responseLanes.json();
                    dataLanes = rawDataLanes.data;
                }
                else{
                    res.json({"error": responseLanes.status});
                }
                for(var i=0; i<boardWorkflow.length;i++){
                    const workflowid = boardWorkflow[i].workflow_id;
                    var columns = [];
                    const lanes = [];
                    boardColumns.map( function(element){
                        if(element.workflow_id === workflowid){
                            columns.push(element)
                        }
                    })
                    for(var x = 0; x < columns.length; x++){
                        if(columns[x].parent_column_id !== null){
                            columns[x].parent_column_id = FindParents(columns[x], columns);
                        }
                    }
                    columns.map(function(element){
                        if(element.parent_column_id !== null){
                            for(var y = 0; y < element.parent_column_id.length; y++){
                                const indexToDelete = columns.findIndex(ele=> ele.column_id === element.parent_column_id[y].parent_id);
                                if(indexToDelete !== -1){
                                    columns.splice(indexToDelete, 1);
                                }
                            }
                        }
                    })
                    for(var x = 0; x < columns.length; x++){
                        if(columns[x].parent_column_id !== null){
                            const columnsLength = columns[x].parent_column_id.length;
                            columns[x].order = columns[x].parent_column_id[ columnsLength - 1].parent_section + ((1.0 / (columnsLength + 1.0)) * columns[x].position );
                            columns[x].parent_column_id = columns[x].parent_column_id.reverse();
                        }
                        else{
                            columns[x].order = columns[x].section * 1.0;
                        }
                    }
                    columns.sort(function(a , b){
                        return a.order - b.order;
                    });
                    dataLanes.map( function(element){
                        if(element.workflow_id === workflowid){
                            lanes.push(element);
                        }
                    });
                    boardWorkflow[i].lanes = lanes;
                    boardWorkflow[i].columns = columns;
                }
                const response3 = await  fetch(`https://${host}.kanbanize.com/api/v2/cards?board_ids=${boardid}&per_page=1000&page=${1}&fields=card_id,title,description,custom_id,owner_user_id,type_id,size,priority,color,deadline,reporter,created_at,revision,last_modified,in_current_position_since,board_id,workflow_id,column_id,lane_id,section,position,last_column_id,last_lane_id,version_id,archived_at,reason_id,discard_comment,discarded_at,is_blocked,block_reason,current_block_time,current_logged_time,current_cycle_time,child_card_stats,finished_subtask_count,unfinished_subtask_count,comment_count&expand=co_owner_ids,subtasks,linked_cards`, {
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
                            const responseCardPages = await  fetch(`https://${host}.kanbanize.com/api/v2/cards?board_ids=${boardid}&per_page=1000&page=${page}&fields=card_id,title,description,custom_id,owner_user_id,type_id,size,priority,color,deadline,reporter,created_at,revision,last_modified,in_current_position_since,board_id,workflow_id,column_id,lane_id,section,position,last_column_id,last_lane_id,version_id,archived_at,reason_id,discard_comment,discarded_at,is_blocked,block_reason,current_block_time,current_logged_time,current_cycle_time,child_card_stats,finished_subtask_count,unfinished_subtask_count,comment_count&expand=co_owner_ids,subtasks,linked_cards`, {
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
                            const columnlanes = boardWorkflow[x].lanes;
                            const columnCards = [];
                            boardCards.map( async function(element){
                                if(element.column_id === columnid){
                                    const tempCard = element;
                                    let lane_name = "";
                                    let lane_color = "";
                                    if(tempCard.owner_user_id){
                                        const userObject = users.find(item => item.user_id === element.owner_user_id);
                                        tempCard.owner_username = userObject.username;
                                        tempCard.owner_avatar = userObject.avatar;
                                        if(boardUsers.find(item => item.user_id === userObject.user_id) === undefined){
                                            boardUsers.push(userObject);
                                        }
                                    }
                                    else {
                                        notAssigned = true; 
                                    }
                                    if(tempCard.co_owner_ids.length > 0){
                                        const co_owner_usernames = []
                                        const co_owner_avatars = [];
                                        for(var o =0; o < tempCard.co_owner_ids.length; o++){
                                            const coOwnerObject = users.find(item => item.user_id === tempCard.co_owner_ids[o])
                                            co_owner_usernames.push(coOwnerObject.username);
                                            co_owner_avatars.push(coOwnerObject.avatar);
                                        }
                                        tempCard.co_owner_usernames = co_owner_usernames;
                                        tempCard.co_owner_avatars = co_owner_avatars;
                                    }
                                    if(tempCard.lane_id){
                                        columnlanes.map( function (lane) {
                                            if(lane.lane_id === tempCard.lane_id){
                                                lane_name = lane.name;
                                                lane_color = lane.color
                                            }
                                        })
                                    }
                                    if(tempCard.linked_cards.length > 0){
                                        for(var j= 0; j < tempCard.linked_cards.length; j++){
                                            const lccardd = tempCard.linked_cards[j].card_id;
                                            const cardobject = boardCards.find(item => item.card_id === lccardd);
                                            tempCard.linked_cards[j].title = cardobject.title;
                                        }
                                    }
                                    tempCard.lane_name = lane_name;
                                    tempCard.lane_color = lane_color;
                                    columnCards.push(tempCard);
                                }
                            })
                            if(columnCards.length != 0){
                                columnCards.sort(function(a , b){
                                    if(a.lane_id === b.lane_id) {
                                        return a.position - b.position;
                                    }
                                    else {
                                        if(a.lane_id > b.lane_id) {
                                            return 1
                                        }
                                        else {
                                            return -1
                                        }
                                    }
                                });
                                boardWorkflow[x].columns[y].cards = columnCards;
                            }
                            else{
                                boardWorkflow[x].columns[y].cards = [];
                            }
                        }
                        if(notAssigned){
                            boardUsers.push({
                                user_id: null,
                                username: "Not Assigned",
                                realname: "None",
                                avatar: "/None.jpg"
                            })
                        } 
                        boardWorkflow[x].users = boardUsers;
                        boardUsers = [];
                        notAssigned = false;
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
