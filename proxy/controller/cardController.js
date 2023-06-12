const initializeApp = require('firebase/app').initializeApp;
const getStorage = require('firebase/storage').getStorage;
const ref = require('firebase/storage').ref;
const uploadBytes = require('firebase/storage').uploadBytes;
const getDownloadURL = require('firebase/storage').getDownloadURL;
const fetch = require('node-fetch');
const firebaseConfig = {
  //Aquí va la configuración de la aplicación del proyecto
  //Descripcion general>1 app>Engrane>Código al final de la página
  storageBucket: "tc3005bmarco.appspot.com",
};

function generateString(length) {
    const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = ' ';
    const charactersLength = characters.length;
    for ( let i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
}

function removeSubstring(text, startIndex, endIndex) {
  	if (endIndex < startIndex) {
  		startIndex = endIndex;
    }
    var a = text.substring(0, startIndex);
    var b = text.substring(endIndex);
    return a + b;
}

function removeCommentImages(text) {
    //define variaables
    const imageHTML = "<img";
    let cnt = 0;
    let temp = text;
    
    //for to iterate comments
    //for to iterate characters on text
    for (let x = 0 ; x < temp.length; x++) {
        cnt = 0;
        //for to iterate characters on imageHTML
        for (let y = 0; y < imageHTML.length; y++) {
            //if characters match add to cnt
            if (text[x+y] === imageHTML[y]) {
                cnt += 1;
            }
            //if character doesn't match, stops for cycle
            else {
                break;
            }
        }
        //if all characters match, rebuilds text
        if (cnt === imageHTML.length) {
            //for to add character before link
            let src = true;
            let cnt2 = 0;
            let y = x;
            let imageLink = '<a href = "';
            for ( y ; y < text.length; y++) {
                if(text[y] == 's' && text[y+1] == 'r' && text[y+2]=='c' && text[y+3]=='='){
                    break;
                }
            }
            //add link header and reference
            while (text[y + 5 + cnt2] != '"') {
                imageLink += text[y + 5 + cnt2]
                cnt2 += 1;
            }
            imageLink += '" target = "_blank">Image</a>';
            //console.log(`${imageLink}\n`)
            //update test on comment
            text = removeSubstring(text, x, y + 7 + cnt2);
            text= text.slice(0, x) + imageLink + text.slice(x);
            cnt2 = 0;
        }
    }
    return text;
}

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
        res.status(500).json({"error": 500});
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

        if(responseUsers.ok){
            const rawUsers = await responseUsers.json();
            users = rawUsers.data;
            if(responseComments.ok){
                const rawComments = await responseComments.json();
                comments = rawComments.data;
                if(comments.length > 0){
                    for(var x =0; x < comments.length; x++){
                        let tempText = '';
                        try{
                            tempText = removeCommentImages(comments[x].text); 
                        }
                        catch(error){
                            console.error(error);
                            tempText = comments[x].text;
                        }
                        comments[x].text = tempText;
                        const authorObject = users.find(item => item.user_id === comments[x].author.value);
                        comments[x].author.avatar = authorObject.avatar;
                        comments[x].author.username = authorObject.username;
                    }
                }
            }
            else{
                res.status(responseComments.status).json({"error": responseComments.status});
            }
            res.json(comments);
        }
        else{
            res.status(responseComments.status).json({"error" : responseUsers.status});
        }
    }
    catch(error){
        console.error(error);
        res.status(500).json({"error": 500});
    }
}

module.exports.addComment= async (req,res) =>{
    const host = req.params.host;
    const cardid = req.params.cardid;
    const apikey = req.headers.apikey;
    const text = req.body.text === undefined ? null : req.body.text;
    
    try{
        if (!req.files || Object.keys(req.files).length === 0) {
        
            const formData = JSON.stringify({
                "text": text,
            });
            const response = await  fetch(`https://${host}.kanbanize.com/api/v2/cards/${cardid}/comments`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "apikey": apikey
                },
                body: formData,
            });
            if(response.ok){
                res.status(response.status).json({"text": text});
            }
            else{
                res.status(response.status).json({"error": response.status});
            }
        }
        else{
            const filedata = req.files.file.data;
            const filename = generateString(5) + req.files.file.name;

            // Initialize Firebase
            const firebase = initializeApp(firebaseConfig);
            // Initialize Cloud Storage and get a reference to the service
            const storage = getStorage(firebase);
            //El segundo parámetro de ref es el nombre del archivo
            //Es necesario crear una carpeta con el id del card,
            //por ejemplo: "cardid/"+req.files.archivo.name
            //De otra forma, el archivo se sobreescribirá
            const storageRef = ref(storage, `${host}/${cardid}/${filename}`);
            const snapshot = await uploadBytes(storageRef, filedata);
            const downloadURL = await getDownloadURL(storageRef);

            if(downloadURL == '' || downloadURL == undefined || downloadURL == null){
                res.status(400).json({"error": 400})
            }

            const formData = JSON.stringify({
                "text": text,
                "attachments_to_add": [{
                    "file_name": filename,
                    "link": downloadURL,
                }],  
            });

            const response = await  fetch(`https://${host}.kanbanize.com/api/v2/cards/${cardid}/comments`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "apikey": apikey
                },
                body: formData,
            });
            if(response.ok){
                res.status(response.status).json({"text": text, "attachment": {"file_name": filename, "link": downloadURL} });
            }
            else{
                res.status(response.status).json({"error": response.status});
            }
        }
    }
    catch(error){
        console.error(error);
        res.status(500).json({"error": 500});
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
            res.status(response.status).json({"Successful": response.status});
        }
        else{
            res.status(response.status).json({"error": response.status});
        }
    }
    catch(error){
        console.error(error);
        res.status(500).json({"error": 500});
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
            const data = await response.json();
            const card_id = data.data[0].card_id;
            res.status(response.status).json({"card_id": card_id});
        }
        else{
            res.status(response.status).json({"error": response.status});
        }
    }
    catch(error){
        console.error(error);
        res.status(500).json({"error": 500});
    }
}