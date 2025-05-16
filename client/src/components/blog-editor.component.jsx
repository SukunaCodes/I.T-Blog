import {Link, useNavigate} from "react-router-dom";
import logo from "../assets/logo.png"
import AnimationWrapper from "../common/page-animation.jsx";
import defaultBanner from "../assets/blog banner.png";
import {uploadImageToAWS} from "../common/aws.jsx";
import {useContext, useEffect} from "react";
import {Toaster, toast} from "react-hot-toast";
import {EditorContext} from "../pages/editor.pages.jsx";
import EditorJS from "@editorjs/editorjs";
import {tools} from "./tools.component.jsx";
import axios from "axios";
import {UserContext} from "../App.jsx";

const BlogEditor = () => {


    const {blog, blog: {title, banner, content, tags, description}, setBlog, textEditor, setTextEditor, setEditorState} = useContext(EditorContext)

    let createBlogRoute = '/blog/create'
    let {userAuth: {access_token, id}} = useContext(UserContext);
    let navigate = useNavigate();

    //UseEffect to lad EditorJS
    useEffect(() => {
        setTextEditor(new EditorJS({
            holder: "textEditor",
            data: content,
            tools: tools,
            placeholder: "Let\'s start the creative writing journey"
        }))
    }, []);


    const handleBannerUpload = async (e) => {
        const img = e.target.files[0];
        if (img) {
            const loadingToast = toast.loading("Uploading");
            try {
                const url = await uploadImageToAWS(img);
                if (url) {
                    toast.dismiss(loadingToast);
                    toast.success("Image Uploaded");
                    setBlog({...blog, banner: url})
                } else {
                    console.error("No URL returned from upload!");
                }
            } catch (err) {
                toast.dismiss(loadingToast);
                toast.error("Failed to upload image!");
                console.error(err.message);
            }
        }
    }

    const handleBlogTitleKeyDown = (e) => {
        // console.log(e);
        if (e.keyCode === 13){
            e.preventDefault();
        }
    }

    const handleBlogTitleChange = (e) => {
        let input = e.target;

        input.style.height = "auto";
        input.style.height = input.scrollHeight + "px";

        setBlog({...blog, title: input.value})
    }

    const handleBannerError = (e) => {
        let img = e.target;
        console.log('Image load error:', img);
        setBlog({...blog, banner: defaultBanner})
    }

    // Publish Blog Submit Logic
    const handleBlogPublishEvent = () => {
        if (banner === defaultBanner){
            return toast.error('Please upload a banner!')
        }
        if (!title.length){
            return toast.error('Blog Title is Recommended!')
        }
        if (textEditor.isReady){
            textEditor.save().then(data => {
                if (data.blocks.length){
                    setBlog({...blog, content: data});
                    setEditorState("publish")
                } else{
                    return toast.error('Please write something before publishing!')
                }
            })
                .catch((err) => {
                    console.log(err);
                })
        }
    }

    // saveDraft Logic
    const handleSaveBlogDraft = async (e) => {

        if (e.target.className.includes("disable")) {
            return;
        }

        if (!title.length) {
            return toast.error("Require title before saving");
        }

        let loadingToast = toast.loading("Saving your blog");
        e.target.classList.add("disable");

        if(textEditor.isReady){
            textEditor.save().then(async content => {
                let blogDataObj = {title, banner, description, content, tags, authorId: id, draft: true};

                try {

                    await axios.post(import.meta.env.VITE_SERVER_DOMAIN + createBlogRoute, blogDataObj, {
                        headers: {
                            'Authorization': `Bearer ${access_token}`
                        }
                    });

                    e.target.classList.remove("disable");
                    toast.dismiss(loadingToast);
                    toast.success("Draft Saved");

                    setTimeout(() => {
                        navigate("/");
                    }, 3000);
                } catch ({response}) {
                    e.target.classList.remove("disable");
                    toast.dismiss(loadingToast);
                    return toast.error(response.data.error);
                }
            })
        }
    }


    return (

        <>
            <nav className="navbar">
                <Link to="/" className="flex-none w-10">
                    <img src={logo} alt="logo"/>
                </Link>
                <p className="max-md:hidden text-black line-clamp-1 w-full">{title.length ? title : "Untitled Blog"}</p>
                <div className="flex gap-4 ml-auto">
                    <button className="btn-dark py-2" onClick={handleBlogPublishEvent}>
                        Publish
                    </button>

                    <button className="btn-light py-2" onClick={handleSaveBlogDraft}>
                        Save Draft
                    </button>
                </div>
            </nav>

            <Toaster />
            <AnimationWrapper>
                <section>
                    <div className="mx-auto max-w-[900px] w-full">
                        <div className="relative aspect-video hover:opacity-80 bg-white border-4 border-grey">
                            <label htmlFor="uploadBanner">
                                <img src={banner} alt="Default Banner Image" className="z-20" onError={handleBannerError}/>
                                <input id="uploadBanner" type="file" accept=".png, .jpg, .jpeg" hidden onChange={handleBannerUpload}/>
                            </label>
                        </div>
                        <textarea
                            defaultValue={title}
                            placeholder="Blog Title"
                            className="text-4xl font-medtium w-full h-20 outline-none resize-none mt-10 leading-tight placeholder:opacity-40" onKeyDown={handleBlogTitleKeyDown}
                            onChange={handleBlogTitleChange}
                        ></textarea>

                        <hr className="w-full opacity-10 my-5"/>

                        <div id="textEditor" className='font-gelasio'></div>

                    </div>
                </section>
            </AnimationWrapper>

        </>
    )
}
export default BlogEditor;