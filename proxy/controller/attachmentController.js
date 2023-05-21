const { MongoClient, GridFSBucket, ObjectId } = require('mongodb');
require('dotenv').config();

const uri = `mongodb+srv://${process.env.DBUSER}:${process.env.DBPASSWORD}@${process.env.DBHOSTNAME}/?retryWrites=true&w=majority`;
const client = new MongoClient(uri);

const connect = async () => {
    await client.connect();
    return client.db(process.env.DBNAME);
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
        res.status(500).send('Error thrown when trying to upload the file');
    }
}

module.exports.uploadAttachment = async (req,res) =>{

    try{
        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).send('No files were uploaded.');
        }
        const database = await connect();
        const file = req.files.archivo;
        const bucket = new GridFSBucket(database, { bucketName: 'bucket' });

        const uploadStream = bucket.openUploadStream(file.name, { chunkSizeBytes: 1048576, metadata: { field: 'contentType', value: file.mimetype } });
        const buffer = file.data;

        uploadStream.write(buffer);
        uploadStream.end();

        uploadStream.on('finish', () => {
            res.send(`File uploaded with id ${uploadStream.id}`);
        });  

    }
    catch(error){
        console.error(error);
        res.status(500).send('Error thrown when trying to upload the file');
    }
}