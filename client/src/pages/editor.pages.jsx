import {createContext, useContext, useState} from "react";
import {UserContext} from "../App.jsx";
import {Navigate} from "react-router-dom";
import BlogEditor from "../components/blog-editor.component.jsx";
import PublishForm from "../components/publish-form.component.jsx";
import defaultBanner from "../assets/blog banner.png";

const blogStructure = {
    title: '',
    banner: defaultBanner,
    content: [],
    tags: [],
    description: '',
    author: {}
}

export const EditorContext = createContext({});

const Editor = () => {

    const [blog, setBlog] = useState(blogStructure);

    const [editorState, setEditorState] = useState("editor");

    const [textEditor, setTextEditor] = useState({ isReady: false });

    let {userAuth: {access_token}} = useContext(UserContext);

    return (
        <EditorContext.Provider value={{blog, setBlog, editorState, setEditorState, textEditor, setTextEditor}}>
            {
                access_token === null ? <Navigate to='/login' />

            :

            editorState === "editor" ? <BlogEditor /> : <PublishForm />
            }
        </EditorContext.Provider>
    )
}

export default Editor;