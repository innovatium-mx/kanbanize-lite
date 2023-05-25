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

module.exports.uploadAttachment = async (req,res) =>{
    const host = req.params.host;
    const cardid = req.params.cardid;
    const apikey = req.headers.apikey;

    try{
        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).send('No files were uploaded.');
        }

        const filedata = req.files.file.data;
        const filename = req.files.file.name;

        // Initialize Firebase
        const firebase = initializeApp(firebaseConfig);
        // Initialize Cloud Storage and get a reference to the service
        const storage = getStorage(firebase);
        //El segundo parámetro de ref es el nombre del archivo
        //Es necesario crear una carpeta con el id del card,
        //por ejemplo: "cardid/"+req.files.archivo.name
        //De otra forma, el archivo se sobreescribirá
        const storageRef = ref(storage, filename);
        const snapshot = await uploadBytes(storageRef, filedata);
        const downloadURL = await getDownloadURL(storageRef);
        console.log('File available at:' + downloadURL);

        const formData = JSON.stringify({
            "text": null,
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
            res.json({"Successful": response.status});
        }
        else{
            res.status(response.status).json({"error": response.status});
        }
    }
    catch(error){
        console.error(error);
        res.status(500).json({"error": "Error thrown when uploading the file"});
    }
}