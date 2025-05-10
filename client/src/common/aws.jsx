import axios from "axios";

export const uploadImageToAWS = async (img) => {
    let imgUrl = null;
    const uploadServerRoute = "/blog/upload/get-image-url";

    try {
        // Step 1: Fetch the pre-signed URL from the backend
        const {data: {uploadURL}} = await axios.get(import.meta.env.VITE_SERVER_DOMAIN + uploadServerRoute);

        // Step 2: Upload the image to the pre-signed URL
        await axios({
            method: "PUT",
            url: uploadURL,
            headers: {'Content-Type': 'multipart/form-data'},
            data: img,
        });

        // Step 3: Extract the base URL
        imgUrl = uploadURL.split('?')[0];
    } catch (error) {
        console.error('Error uploading image to AWS:', error.message);
    }

    return imgUrl;
};

/*
export const uploadImageToAWS = async (img) => {

    let imgUrl = null;
    let uploadServerRoute = "/upload/get-image-url";

    await axios.get(import.meta.env.VITE_SERVER_DOMAIN + uploadServerRoute)
        .then(async ({data: {uploadURL}}) => {

            await axios({
                method: "PUT",
                url: uploadURL,
                headers: { 'Content-Type': 'multipart/form-data'},
                data: img,
            })
                .then(() => {
                    imgUrl = uploadURL.split('?')[0]
                })
        })

    return imgUrl;
}*/
