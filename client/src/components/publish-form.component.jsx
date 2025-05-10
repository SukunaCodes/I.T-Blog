import AnimationWrapper from "../common/page-animation.jsx";
import {Toaster, toast} from "react-hot-toast";
import {useContext} from "react";
import {EditorContext} from "../pages/editor.pages.jsx";
import Tag from "./tags.component.jsx";

const PublishForm = () => {
    const characterLimit = 200;
    const tagLimit = 5;

    let {blog, blog: {banner, title, tags, description}, setEditorState, setBlog} = useContext(EditorContext);
    const handleCloseEvent = () => {
        setEditorState("editor")
    }

    const handlePublishBlogTitle = (e) => {
        let input = e.target;
        setBlog({...blog, title: input.value})
    }

    const handleBlogDescriptionKeyDown = (e) => {
        // console.log(e);
        if (e.keyCode === 13){
            e.preventDefault();
        }
    }

    const handleBlogTagsKeyDown = (e) => {
        if(e.keyCode === 13 || e.keyCode ===188){
            e.preventDefault();
            let tag = e.target.value;
            if(tags.length < tagLimit){
                if(!tags.include(tag) && tag.length){
                    setBlog({...blog, tags: [...tags, tag]})
                }
            } else {
                toast.error(`Max of ${tagLimit} tags required!`)
            }
        }
    }


    return (
        <AnimationWrapper>
            <section className= "w-screen min-h-screen grid items-center lg:grid-cols-2 py-16 lg:gap-4">
                <Toaster />
                <button className="w-12 h-12 absolute right-[5vw] z-10 top-[5%] lg:top-[10%]" onClick={handleCloseEvent}>
                    <i className="fi fi-rr-cross"></i>
                </button>

                <div className="max-w-[550px] center">
                    <p className="text-dark-grey mb-10">Preview</p>
                    <div className="w-full aspect-video rounded-lg overflow-hidden bg-grey mt-4">
                        <img src={banner} alt="banner"/>
                    </div>

                    <h1 className="text-4xl font-medium mt-2 leading-tight line-clamp-2">{title}</h1>
                    <p className="font-gelasio line-clamp-2 text-xl leading-7 mt-4">{description}</p>

                    <div className="border-grey lg:border-1 lg:pl-8">
                        <p className="text-dark-grey mb-2 mt-9">Blog Title</p>
                        <input type="text" placeholder="Blog Title" defaultValue={title} className="input-box pl-4"
                               onChange={handlePublishBlogTitle} onKeyDown={handleBlogDescriptionKeyDown}/>

                        <p className="text-dark-grey mb-2 mt-9">Blog Description</p>
                        <textarea maxLength={characterLimit} defaultValue={description}
                                  className="h-40 resize-none leading-7 input-box pl-4"></textarea>
                        <p className="mt-1 text-dark-grey text-sm text-right">{characterLimit - description.length} characters
                            left.</p>

                        <p className="text-dark-grey mb-2 mt-9">Tags - SEO Optimization for your blogs.</p>
                        <div className="relative input-box pl-2 py-2 pb-4">
                            <input type="text" placeholder="Tags"
                                   className="sticky input-box bg-white top-0 left-0 pl-4 mb-3 focus:bg-white"
                                   onKeyDown={handleBlogTagsKeyDown}/>

                            {
                                tags.map((tag, i) => {
                                    return <Tag tag={tag} tagIndex={i} key={i}/>
                                })
                            }
                        </div>
                        <p className="text-dark-grey mt-1 mb-4 text-right">{tagLimit - tags.length} tags remaining.</p>
                        <button className="btn-dark px-8">Publish</button>

                    </div>
                </div>
            </section>
        </AnimationWrapper>
    )
}
export default PublishForm;