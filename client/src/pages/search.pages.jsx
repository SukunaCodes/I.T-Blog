import {useParams} from "react-router-dom";
import InPageNavigation from "../components/inpage-navigation.component.jsx";
import Loader from "../components/loader.component.jsx";
import AnimationWrapper from "../common/page-animation.jsx";
import BlogPostCard from "../components/blog-post-card.component.jsx";
import NoDataMessage from "../components/nodata.component.jsx";
import LoadMoreBlogs from "../components/load-more.component.jsx";
import {useEffect, useState} from "react";
import axios from "axios";
import {filterPaginationData} from "../common/filter-pagination-data.jsx";

const SearchPage = () => {

    let [latestBlog, setLatestBlog] = useState(null);
    let {query} = useParams();

    let searchRoute = '/blog/search';

    const searchBlogs = ({page = 1, create_new_arr = false}) => {
        axios.post(import.meta.env.VITE_SERVER_DOMAIN + searchRoute, {query, page})
            .then(async ({data}) => {
                let formatedData = await filterPaginationData({
                    state: latestBlog,
                    data: data.blogs,
                    page,
                    countRoute: "/blog/search-blogs-count",
                    data_to_send: {query},
                    create_new_arr
                })
                console.log(formatedData);
                setLatestBlog(formatedData);
            })
            .catch(err => {
                console.log(err);
            })
    }

    const resetState = () => {
        setLatestBlog(null);
    }

    useEffect(() => {
        resetState()
        searchBlogs({page: 1, create_new_arr: true});
    }, [query]);

    return (
        <section className="h-cover flex justify-center gap-10">
            <div className="w-full">
                <InPageNavigation routes={
                    [`Search results for "${query}"`, "Accounts Matched"]
                } defaultHidden={["Accounts Matched"]}>
                    <>
                        {
                            latestBlog === null || !latestBlog.results ? (<Loader/>) :
                                (latestBlog.results.length ?
                                    latestBlog.results.map((blog, i) => {
                                        return (<AnimationWrapper key={i} transition={{duration: 1, delay: i * .1}}>
                                            <BlogPostCard content={blog} author={blog.user}/>
                                        </AnimationWrapper>)
                                    }) :
                                    <NoDataMessage message="No Blogs Published"/>)
                        }
                        <LoadMoreBlogs state={latestBlog}
                                       fetchDataFun={searchBlogs}/>
                    </>
                </InPageNavigation>
            </div>
        </section>
    )
}
export default SearchPage;