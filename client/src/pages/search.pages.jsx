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
import UserCard from "../components/user-card.component.jsx";

const SearchPage = () => {

    let [latestBlog, setLatestBlog] = useState(null);
    let [users, setUsers] = useState(null);

    let {query} = useParams();

    let blogSearchRoute = '/blog/search';
    let userSearchRoute = '/user/search';

    const searchBlogs = ({page = 1, create_new_arr = false}) => {
        axios.post(import.meta.env.VITE_SERVER_DOMAIN + blogSearchRoute, {query, page})
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

    const fetchUsers = () => {
        axios.post(import.meta.env.VITE_SERVER_DOMAIN + userSearchRoute, {query})
            .then(({data: {users}}) =>{
                setUsers(users);
            })
    }

    const UserCardWrapper = () => {
        return (
            <>
                {
                    users === null ? <Loader /> :
                        users.length ?
                            users.map((user, i) => {
                                return <AnimationWrapper key={i} transition={{duration: 1, delay: i*0.08}}>
                                    <UserCard user={user}/>
                                </AnimationWrapper>
                            })
                            : <NoDataMessage message="No User Found"/>
                }
            </>
        )
    }

    const resetState = () => {
        setLatestBlog(null);
        setUsers(null);
    }

    useEffect(() => {
        resetState()
        searchBlogs({page: 1, create_new_arr: true});
        fetchUsers();
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

                    <UserCardWrapper />

                </InPageNavigation>
            </div>

            <div className="min-w-[40%] lg:min-w-[350px] max-w-min border-l border-grey pl-8 pt-3 max:md:hidden">
                <h1 className="font-medium text-xl mb-8">User related to search  <i className="fi fi-rr-user mt-1"></i></h1>

                <UserCardWrapper />
            </div>

        </section>
    )
}
export default SearchPage;