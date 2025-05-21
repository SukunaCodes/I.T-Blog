import axios from "axios";
import {useEffect, useState} from "react";
import AnimationWrapper from "../common/page-animation.jsx";
import InPageNavigation from "../components/inpage-navigation.component.jsx";
import Loader from "../components/loader.component.jsx";
import BlogPostCard from "../components/blog-post-card.component.jsx";
import MinimalTrendingBlogPost from "../components/nobanner-blog-post-component.jsx";

const HomePage = () => {

    const blogLatestRoute = '/blog/latest';
    const blogTrendingRoute = '/blog/trending';

    let [latestBlog, setLatestBlog] = useState(null);
    let [trendingBlog, setTrendingBlog] = useState(null);

    const fetchLatestBlogs = () => {
        axios.get(import.meta.env.VITE_SERVER_DOMAIN + blogLatestRoute)
            .then(({data}) => {
                setLatestBlog(data.blogs);
            })
            .catch(err => {
                console.log(err);
            })
    }

    const fetchTrendingBlogs = () => {
        axios.get(import.meta.env.VITE_SERVER_DOMAIN + blogTrendingRoute)
            .then(({data}) => {
                setTrendingBlog(data.blogs);
            })
            .catch(err => {
                console.error(err);
            })
    }

    useEffect(() => {
        fetchLatestBlogs();
        fetchTrendingBlogs();
    }, []);

    return (
        <AnimationWrapper>
            <section className="h-cover flex justify-center gap-10">
                {/*latest Blogs -> Left Side*/}
                <div className= "w-full">
                    <InPageNavigation routes={["home", "trending blogs"]} defaultHidden={["trending blogs"]}>

                        <>
                            {
                                latestBlog === null ? <Loader /> :
                                    latestBlog.map((blog, i) => {
                                        return <AnimationWrapper key={i} transition={{duration: 1, delay: i*.1}}>
                                            <BlogPostCard content={blog} author={blog.user}/>
                                        </AnimationWrapper>
                                    })
                            }
                        </>

                        <>
                            {
                                trendingBlog === null ? <Loader /> :
                                    trendingBlog.map((blog, i) => {
                                        return <AnimationWrapper key={i} transition={{duration: 1, delay: i*.1}}>
                                            <MinimalTrendingBlogPost content={blog} author={blog.user} index={i}/>
                                        </AnimationWrapper>
                                    })
                            }
                        </>

                    </InPageNavigation>
                </div>
                {/*Filters & Trending  -> Right Side*/}
                <div></div>
            </section>
        </AnimationWrapper>
    )
}
export default HomePage;