import { useState } from "react";
import axios from 'axios';

const phototesting = () => {
    const [file, setFile] = useState();
    const [fileName, setFileName] = useState("");

    const handleChange = (e) => {
        if (e.target.files) {
            setFile(e.target.files[0]);
            setFileName(e.target.files[0].name);
        }
    };

    const handleSubmit = async () =>{
        const formData = new FormData();
        formData.append("file", file);
        formData.append("fileName", fileName);
        const config = {
            headers: {
                "apikey": "2jALdt7HjUSYtRahGU9lsAPJAEPNIKvH6o9NncJS"
            }
        }

        try {
            const res = await axios.post(
                "https://fs96h11zh9.execute-api.us-east-1.amazonaws.com/uploadAttachment/university6y/888",
                formData, config
            );
        } 
        catch (ex) {
            console.log(ex);
        }
        
    }


    return (
        <div>
            <input type="file" name="archivo" onChange={handleChange} />

            <div>{file && `${file.name} - ${file.type}`}</div>

            <button onClick={handleSubmit}>Upload</button>
        </div>
    )

}

export default phototesting;