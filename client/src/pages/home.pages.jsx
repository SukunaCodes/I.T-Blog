import axios from "axios";
import {useEffect, useState} from "react";
import AnimationWrapper from "../common/page-animation.jsx";
import InPageNavigation, {activeButtonTab} from "../components/inpage-navigation.component.jsx";
import Loader from "../components/loader.component.jsx";
import BlogPostCard from "../components/blog-post-card.component.jsx";
import MinimalTrendingBlogPost from "../components/nobanner-blog-post-component.jsx";
import NoDataMessage from "../components/nodata.component.jsx";
import {filterPaginationData} from "../common/filter-pagination-data.jsx";
import LoadMoreBlogs from "../components/load-more.component.jsx";

const HomePage = () => {

    const blogLatestRoute = '/blog/latest';
    const blogTrendingRoute = '/blog/trending';
    const blogCategoryRoute = '/blog/search';

    let [latestBlog, setLatestBlog] = useState(null);
    let [trendingBlog, setTrendingBlog] = useState(null);
    let [pageState, setPageState] = useState("home");

    let categories = ["programming", "blockchain", "cybersecurity", "tech", "travel", "anime", "demon"];

    const fetchLatestBlogs = ({page = 1}) => {
        axios.post(import.meta.env.VITE_SERVER_DOMAIN + blogLatestRoute, {page})
            .then(async ({data}) => {
                let formatedData = await filterPaginationData({
                    state: latestBlog,
                    data: data.blogs,
                    page,
                    countRoute: "/blog/all-blogs-count"
                })
                console.log(formatedData);
                setLatestBlog(formatedData);
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

    const loadBlogByCategory = (e) => {
        let category = e.target.innerText.toLowerCase();
        setLatestBlog(null);
        if(pageState === category){
            setPageState("home");
            return;
        }
        setPageState(category);
    }

    const fetchBlogsByCategory = ({page = 1}) => {
        axios.post(import.meta.env.VITE_SERVER_DOMAIN + blogCategoryRoute, {tag: pageState, page})
            .then(async ({data}) => {
                let formatedData = await filterPaginationData({
                    state: latestBlog,
                    data: data.blogs,
                    page,
                    countRoute: "/blog/search-blogs-count",
                    data_to_send: {tag: pageState}
                })
                setLatestBlog(formatedData);
            })
            .catch(err => {
                console.log(err);
            })
    }

    useEffect(() => {

        activeButtonTab.current.click();

        if(pageState === "home"){
            fetchLatestBlogs({page: 1});
        }
        else {
            fetchBlogsByCategory({page: 1});
        }
        if(!trendingBlog){
            fetchTrendingBlogs();
        }
    }, [pageState]);

    return (
        <AnimationWrapper>
            <section className="h-cover flex justify-center gap-10">
                {/*latest Blogs -> Left Side*/}
                <div className="w-full">
                    <InPageNavigation routes={[pageState, "trending blogs"]} defaultHidden={["trending blogs"]}>

                        <>
                            {
                                latestBlog === null || !latestBlog.results ?  ( <Loader/> ) :
                                    ( latestBlog.results.length ?
                                        latestBlog.results.map((blog, i) => {
                                            return (<AnimationWrapper key={i} transition={{duration: 1, delay: i * .1}}>
                                                <BlogPostCard content={blog} author={blog.user}/>
                                            </AnimationWrapper>)
                                        }) :
                                        <NoDataMessage message="No Blogs Published"/> )
                            }
                            <LoadMoreBlogs state={latestBlog} fetchDataFun={(pageState === "home" ? fetchLatestBlogs : fetchBlogsByCategory)} />
                        </>

                        <>
                            {
                                trendingBlog === null ? ( <Loader/> ) :
                                    ( trendingBlog.length ?
                                        trendingBlog.map((blog, i) => {
                                            return (<AnimationWrapper key={i} transition={{duration: 1, delay: i * .1}}>
                                                <MinimalTrendingBlogPost content={blog} author={blog.user} index={i}/>
                                            </AnimationWrapper>)
                                        }) :
                                        <NoDataMessage message="No Trending Blogs"/>)
                            }
                        </>

                    </InPageNavigation>
                </div>
                {/*Filters & Trending  -> Right Side*/}
                <div className="min-w-[40%] lg:min-w-[400px] max-w-min border-l border-grey pl-8 pt-3 max-md:hidden">
                    <div className="flex flex-col gap-10">
                        <div>
                            <h1 className="font-medium text-xl mb-8">Stories from all interests</h1>
                            <div className="flex gap-3 flex-wrap">
                                {
                                    categories.map((category, i) => {
                                        return <button className={"tag " + (pageState === category ? "bg-black text-white " : " ")} key={i} onClick={loadBlogByCategory}>
                                            {category}
                                        </button>
                                    })
                                }
                            </div>
                        </div>


                        <div>
                            <h1 className="font-medium text-xl mb-8">Trending <i
                                className="fi fi-rr-arrow-trend-up"></i>
                            </h1>
                            {
                                trendingBlog === null ? <Loader/> :
                                    trendingBlog.length ?
                                        trendingBlog.map((blog, i) => {
                                            return <AnimationWrapper key={i} transition={{duration: 1, delay: i * .1}}>
                                                <MinimalTrendingBlogPost content={blog} author={blog.user} index={i}/>
                                            </AnimationWrapper>
                                        }) :
                                        <NoDataMessage message="No Trending Blogs"/>
                            }
                        </div>
                    </div>
                </div>
            </section>
        </AnimationWrapper>
    )
}
export default HomePage;