const fetch = require('node-fetch');

module.exports.cardDetails = async (req,res) =>{
    const host = req.params.host;
    const cardid = req.params.cardid;
    const apikey = req.headers.apikey;
    var users = [];
    var comments = [];
    const co_owner__username = [];
    const co_owner__avatar = [];

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
            const responseUsers = await  fetch(`https://${host}.kanbanize.com/api/v2/users`, {
                method: "GET",
                headers: {
                    "apikey": apikey
                },
            });

            const responseComments = await  fetch(`https://${host}.kanbanize.com/api/v2/cards/${cardid}/comments`, {
                method: "GET",
                headers: {
                    "apikey": apikey
                },
            });

            if(responseUsers.ok && responseComments.ok){
                const rawUsers = await responseUsers.json();
                users = rawUsers.data;
                const rawComments = await responseComments.json();
                comments = rawComments.data;
            }
            else{
                res.json({"error": {
                    "UsersStatus" : responseUsers.status,
                    "CommentsStatus": responseComments.status
                }});
            }
            if(cardDetails.owner_user_id){
                const userObject = users.find(item => item.user_id === cardDetails.owner_user_id);
                cardDetails.owner_username = userObject.username;
                cardDetails.owner_avatar = userObject.avatar;
            }
            if(cardDetails.co_owner_ids.length > 0){
                for(var x =0; x < cardDetails.co_owner_ids.length; x++){
                    const coOwnerObject = users.find(item => item.user_id === cardDetails.co_owner_ids[x])
                    co_owner__username.push(coOwnerObject.username);
                    co_owner__avatar.push(coOwnerObject.avatar);
                }
                cardDetails.co_owner_usernames = co_owner__username;
                cardDetails.co_owner_avatars = co_owner__avatar;
            }
            if(comments.length > 0){
                for(var x =0; x < comments.length; x++){
                    const authorObject = users.find(item => item.user_id === comments[x].author.value);
                    comments[x].author.avatar = authorObject.avatar;
                    comments[x].author.username = authorObject.username;
                }
                cardDetails.comments = comments;
            }
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

module.exports.comments = async (req,res) =>{
    const host = req.params.host;
    const cardid = req.params.cardid;
    const apikey = req.headers.apikey;
    try{
         const responseUsers = await  fetch(`https://${host}.kanbanize.com/api/v2/users`, {
            method: "GET",
            headers: {
                "apikey": apikey
            },
        });

        const responseComments = await  fetch(`https://${host}.kanbanize.com/api/v2/cards/${cardid}/comments`, {
            method: "GET",
            headers: {
                "apikey": apikey
            },
        });

        if(responseUsers.ok && responseComments.ok){
            const rawUsers = await responseUsers.json();
            users = rawUsers.data;
            const rawComments = await responseComments.json();
            comments = rawComments.data;
            if(comments.length > 0){
                for(var x =0; x < comments.length; x++){
                    const authorObject = users.find(item => item.user_id === comments[x].author.value);
                    comments[x].author.avatar = authorObject.avatar;
                    comments[x].author.username = authorObject.username;
                }
            }
            res.json(comments);
        }
        else{
            res.json({"error": {
                "UsersStatus" : responseUsers.status,
                "CommentsStatus": responseComments.status
            }});
        }

    }
    catch(error){
        console.error(error);
        res.json({"error": 500});
    }
}

module.exports.addComment= async (req,res) =>{
    const host = req.params.host;
    const cardid = req.params.cardid;
    const apikey = req.headers.apikey;
    const text = req.body.text;
    const formData = JSON.stringify({
        "text": text,
    });
    try{
        const response = await  fetch(`https://${host}.kanbanize.com/api/v2/cards/${cardid}/comments`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "apikey": apikey
            },
            body: formData,
        });
        if(response.ok){
            res.json({"Successful": response.status});
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

module.exports.moveCard = async (req,res) =>{
    const host = req.params.host;
    const cardid = req.params.cardid;
    const column_id = req.body.column_id;
    const apikey = req.headers.apikey;
    const formData = JSON.stringify({
        "column_id": column_id,
    });
    try{
        const response = await  fetch(`https://${host}.kanbanize.com/api/v2/cards/${cardid}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "apikey": apikey
            },
            body: formData,
        });
        if(response.ok){
            res.json({"Successful": response.status});
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

module.exports.addCard = async (req,res) =>{
    const host = req.params.host;
    const apikey = req.headers.apikey;
    const lane_id = req.body.lane_id;
    const column_id = req.body.column_id;
    const title = req.body.title;
    const description = req.body.description;
    const owner_user_id = req.body.owner_user_id;
    const co_owner_ids = req.body.co_owner_ids;
    
    const formData = JSON.stringify({
        "lane_id": lane_id,
        "column_id": column_id,
        "title": title,
        "description": description,
        "co_owner_ids_to_add": co_owner_ids,
        "owner_user_id": owner_user_id
    });
    console.log(formData);
    try{
        const response = await  fetch(`https://${host}.kanbanize.com/api/v2/cards`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "apikey": apikey
            },
            body: formData,
        });
        if(response.ok){
            res.json({"Successful": response.status});
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