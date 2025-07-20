import {generateUploadURL} from "../middlewares/blogEditorUpload.js";

export const upload_url = async (req, res) => {
    try{
        const url = await generateUploadURL();
        return res.status(200).json({uploadURL: url})
    } catch (err){
        console.log(err.message);
        return res.status(500).json({error: err.message})
    }
}
