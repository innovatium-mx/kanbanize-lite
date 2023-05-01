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
                const userObject = users.find(function(item, i){
                    if(item.user_id === cardDetails.owner_user_id){
                      index = i;
                      return i;
                    }
                });
                cardDetails.owner_username = userObject.username;
                cardDetails.owner_avatar = userObject.avatar;
            }
            if(cardDetails.co_owner_ids.length > 0){
                for(var x =0; x < cardDetails.co_owner_ids.length; x++){
                    const coOwnerObject = users.find(function(item, i){
                        if(item.user_id === cardDetails.co_owner_ids[x]){
                          index = i;
                          return i;
                        }
                    });
                    co_owner__username.push(coOwnerObject.username);
                    co_owner__avatar.push(coOwnerObject.avatar);
                }
                cardDetails.co_owner_usernames = co_owner__username;
                cardDetails.co_owner_avatars = co_owner__avatar;
            }
            if(comments.length > 0){
                for(var x =0; x < comments.length; x++){
                    const authorObject = users.find(function(item, i){
                        if(item.user_id === comments[x].author.value){
                          index = i;
                          return i;
                        }
                    });
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