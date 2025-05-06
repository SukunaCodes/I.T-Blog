import Embed from "@editorjs/embed";
import List from "@editorjs/list";
import ImageTool from "@editorjs/image";
import Header from "@editorjs/header";
import Quote from "@editorjs/quote";
import Marker from "@editorjs/marker";
import InlineCode from "@editorjs/inline-code";
import {uploadImageToAWS} from "../common/aws.jsx";

const uploadImageByFile = async (file) => {
    try {
        const url = await uploadImageToAWS(file);
        if (url) {
            return {
                success: 1,
                file: {url}
            };
        } else {
            new Error("No URL returned from upload");
        }
    } catch (error) {
        console.error('Error uploading image by file:', error.message);
        return {
            success: 0,
            file: {}
        };
    }
};

const uploadImageByURL = async (url) => {
    try {
        // Validate or process the URL if needed
        if (!url || typeof url !== 'string') {
            new Error("Invalid URL provided");
        }
        return {
            success: 1,
            file: {url}
        };
    } catch (error) {
        console.error('Error uploading image by URL:', error.message);
        return {
            success: 0,
            file: {}
        };
    }
};

export const tools = {
    embed: Embed,
    list: {
        class: List,
        inlineToolbar: true,
    },
    image: {
        class: ImageTool,
        config: {
            uploader: {
                uploadByUrl: uploadImageByURL,
                uploadByFile: uploadImageByFile,
            },
            features: {
                caption: 'optional',
            }
        }
    },
    header: {
        class: Header,
        config: {
            placeholder: "Type Heading...",
            levels: [2, 3],
            defaultLevel: 2
        }
    },
    quote: {
        class: Quote,
        inlineToolbar: true,
    },
    marker: Marker,
    inlineCode: InlineCode
}