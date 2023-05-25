const { MongoClient, GridFSBucket, ObjectId } = require('mongodb');
const fetch = require('node-fetch');
const DBUSER="A01423221"
const DBPASSWORD="KanbanizeLite-JA2023"
const DBHOSTNAME="clusterkanbanizelite.guwfmbn.mongodb.net"
const DBNAME="attachments"

const uri = `mongodb+srv://${DBUSER}:${DBPASSWORD}@${DBHOSTNAME}/?retryWrites=true&w=majority`;
const client = new MongoClient(uri);

const connect = async () => {
    await client.connect();
    return client.db(DBNAME);
}

module.exports.downloadAttachment = async (req,res) =>{

    try{
        const id = req.params.id;

        const database = await connect();
        const bucket = new GridFSBucket(database, { bucketName: 'bucket' });

        const file = {
            name: "",
            contentType: ""
        }

        const cursor = bucket.find({ _id: new ObjectId(id) });
        await cursor.forEach(doc => {
            file.name = doc.filename;
            file.contentType = doc.metadata.value;
        });

        const downloadStream = bucket.openDownloadStream(new ObjectId(id));
        
        downloadStream.on('error', (err) => {
            return res.status(404).send('File not found');
        });

        res.setHeader('Content-Disposition', `attachment; filename="${file.name}"`);
        res.setHeader('Content-Type', file.contentType); // 'application/octet-stream'
        downloadStream.pipe(res);

        downloadStream.on('end', () => {
            client.close();
        });
    }
    catch(error){
        console.error(error);
        res.status(500).send('Error thrown when trying to download the file');
    }
}

module.exports.uploadAttachment = async (req,res) =>{
    const host = req.params.host;
    const cardid = req.params.cardid;
    const apikey = req.headers.apikey;

    try{
        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).send('No files were uploaded.');
        }
        const database = await connect();
        const file = req.files.file;
        const filename = file.name;
        const bucket = new GridFSBucket(database, { bucketName: 'bucket' });

        const uploadStream = bucket.openUploadStream(filename, { chunkSizeBytes: 1048576, metadata: { field: 'contentType', value: file.mimetype } });
        const buffer = file.data;

        uploadStream.write(buffer);
        uploadStream.end();

        uploadStream.on('finish', () => {
            console.log(`File uploaded with id ${uploadStream.id}`);
        });

        const formData = JSON.stringify({
            "file_name": filename,
            "link": `https://fs96h11zh9.execute-api.us-east-1.amazonaws.com/downlodAttachment/${uploadStream.id}`,
            "position": 0
        });

        const response = await  fetch(`https://${host}.kanbanize.com/api/v2/cards/${cardid}/attachments`, {
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
        res.status(500).send('Error thrown when trying to upload the file');
    }
}