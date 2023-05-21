const { MongoClient, GridFSBucket, ObjectId } = require('mongodb');
require('dotenv').config();

const uri = `mongodb+srv://${process.env.DBUSER}:${process.env.DBPASSWORD}@${process.env.DBHOSTNAME}/?retryWrites=true&w=majority`;
const client = new MongoClient(uri);

const connect = async () => {
    await client.connect();
    return client.db(process.env.DBNAME);
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