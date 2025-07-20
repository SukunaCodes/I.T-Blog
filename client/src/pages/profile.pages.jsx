import {Link, useParams} from "react-router-dom";
import {useContext, useEffect, useState} from "react";
import axios from "axios";
import AnimationWrapper from "../common/page-animation.jsx";
import Loader from "../components/loader.component.jsx";
import {UserContext} from "../App.jsx";
import AboutUser from "../components/about-user.component.jsx";
import {filterPaginationData} from "../common/filter-pagination-data.jsx";
import InPageNavigation from "../components/inpage-navigation.component.jsx";
import BlogPostCard from "../components/blog-post-card.component.jsx";
import NoDataMessage from "../components/nodata.component.jsx";
import LoadMoreBlogs from "../components/load-more.component.jsx";
import PageNotFound from "./404.pages.jsx";

export const profileDataStructure = {
    fullname: "",
    username: "",
    profile_img: "",
    bio: "",

    account_details: {
        total_posts: 0,
        total_reads: 0
    },
    social_links: {},
    createdAt: ""
}


const UserProfilePage = () => {
    let {id: profileId} = useParams();
    let [profile, setProfile] = useState(profileDataStructure);
    let [loading, setLoading] = useState(true);
    let [profileLoaded, setProfileLoaded] = useState("");
    let [blogs, setBlogs] = useState(null);
    let {userAuth: {username}} = useContext(UserContext);

    const userProfileRoute = '/user/profile';
    const blogSearchRoute = '/blog/search';

    let {
        fullname,
        username: profile_username,
        profile_img,
        bio,
        account_details: {total_posts, total_reads},
        social_links,
        createdAt
    } = profile;

    const fetchUserProfile = () => {
        axios.post(import.meta.env.VITE_SERVER_DOMAIN + userProfileRoute, {username: profileId})
            .then(({data: user}) => {
                if (user !== null) {
                    setProfile(user);
                }
                setProfileLoaded(profileId);
                fetchBlogs({user_id: user.id})
                setLoading(false);
            })
            .catch(err => {
                console.log(err);
                setLoading(false);
            })
    }

    const fetchBlogs = async ({page = 1, user_id}) => {
        if (!user_id) {
            console.error("user_id is undefined in fetchBlogs");
            return;
        }

        try {
            const response = await axios.post(import.meta.env.VITE_SERVER_DOMAIN + blogSearchRoute, {
                user: user_id, // Match backend parameter
                page,
            });
            const {data} = response;
            let formatedData = await filterPaginationData({
                state: blogs,
                data: data.blogs,
                page,
                countRoute: "/blog/search-blogs-count",
                data_to_send: {user: user_id},
            });
            if (formatedData) { // Safety check
                formatedData.user_id = user_id; // Set user_id only if formatedData exists
                console.log("Formatted blogs data:", formatedData);
                setBlogs(formatedData);
            } else {
                console.error("formatedData is undefined, using default state");
                setBlogs({...blogs, results: [], user_id}); // Fallback
            }
        } catch (err) {
            console.error("Error fetching blogs:", err.message, err.response?.data);
        }
    }

    const resetStates = () => {
        setProfile(profileDataStructure);
        setLoading(true);
        setProfileLoaded("");
    }

    useEffect(() => {
        if (profileId !== profileLoaded) {
            setBlogs(null);
        }
        if (blogs === null) {
            resetStates();
            fetchUserProfile();
        }

    }, [profileId, blogs]);

    return (
        <AnimationWrapper>
            {
                loading ? <Loader/> :
                    profile_username.length ?
                    <section className="h-cover md:flex flex-row-reverse items-start gap-5 min-[1100px]:gap-12">
                        <div className="flex flex-col max-md:items-center gap-5 min-w-[250px]">

                            <img src={profile_img} alt="User Profile Image"
                                 className="w-48 h-48 bg-grey rounded-full md:w-32 md:h-32"/>
                            <h1 className="text-2xl font-medium">@{profile_username}</h1>
                            <p className="text-xl capitalize h-6">{fullname}</p>
                            <p>{total_posts.toLocaleString()} Blogs - {total_reads.toLocaleString()} Reads</p>

                            <div className="flex gap-4 mt-2">
                                {
                                    profileId === username ?
                                        <Link to="/settings/edit-profile" className="btn-light rounded-md">Edit
                                            Profile</Link>
                                        : ""
                                }
                            </div>

                            <AboutUser className="max-md:hidden" bio={bio} social_links={social_links}
                                       createdAt={createdAt}/>

                        </div>

                        <div className="max-md:mt-12 w-full">
                            <InPageNavigation
                                routes={["Blogs Published", "About"]}
                                defaultHidden={["About"]}
                            >
                                <>
                                    {blogs === null ? (
                                        <Loader />
                                    ) : (
                                        blogs.results.length ?
                                            blogs.results.map((blog, i) => {
                                                return (
                                                    <AnimationWrapper
                                                        transition={{
                                                            duration: 1,
                                                            delay: i * 0.1,
                                                        }}
                                                        key={i}
                                                    >
                                                        <BlogPostCard
                                                            content={blog}
                                                            author={blog.user}
                                                        />
                                                    </AnimationWrapper>
                                                );
                                            })
                                            : <NoDataMessage message="No blogs published" />
                                    )}
                                    <LoadMoreBlogs state={blogs} fetchDataFun={fetchBlogs}/>
                                </>

                                <AboutUser bio={bio} social_links={social_links} createdAt                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  ={createdAt} />

                            </InPageNavigation>
                        </div>
                    </section>
                        : <PageNotFound />
            }

        </AnimationWrapper>

    )
}

export default UserProfilePage;