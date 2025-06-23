import {Link, useParams} from "react-router-dom";
import {useContext, useEffect, useState} from "react";
import axios from "axios";
import AnimationWrapper from "../common/page-animation.jsx";
import Loader from "../components/loader.component.jsx";
import {UserContext} from "../App.jsx";

export const profileDataStructure = {
    fullname: "",
    username: "",
    profile_img: "",
    bio: "",

    account_details: {
        total_posts: 0,
        total_reads: 0
    },
    social_links: { },
    createdAt: ""
}


const UserProfilePage = () => {
    let {id: profileId} = useParams();
    let [profile, setProfile] = useState(profileDataStructure);
    let [loading, setLoading] = useState(true);
    let {userAuth: {username}} = useContext(UserContext);
    const userProfileRoute = '/user/profile';

    let {fullname, username: profile_username, profile_img, bio, account_details: {total_posts, total_reads}, social_links, createdAt} = profile;

    const fetchUserProfile = () => {
        axios.post(import.meta.env.VITE_SERVER_DOMAIN + userProfileRoute, {username: profileId})
            .then(({data: user}) => {
                console.log(user);
                setProfile(user);
                setLoading(false);
            })
            .catch(err => {
                console.log(err);
                setLoading(false);
            })
    }

    const resetStates = () => {
        setProfile(profileDataStructure);
        setLoading(true);
    }

    useEffect(() => {
        resetStates();
        fetchUserProfile();

    }, [profileId]);

    return(
        <AnimationWrapper>
            {
                loading ? <Loader/> :
                    <section className="h-cover md:flex flex-row-reverse items-start gap-5 min-[1100px]:gap-12">
                        <div className="flex flex-col max-md:items-center gap-5 min-w-[250px]">

                            <img src={profile_img} alt="User Profile Image" className="w-48 h-48 bg-grey rounded-full md:w-32 md:h-32"/>
                            <h1 className="text-2xl font-medium">@{profile_username}</h1>
                            <p className="text-xl capitalize h-6">{fullname}</p>
                            <p>{total_posts.toLocaleString()} Blogs - {total_reads.toLocaleString()} Reads</p>

                            <div className="flex gap-4 mt-2">
                                {
                                    profileId === username ?
                                        <Link to="/settings/edit-profile" className="btn-light rounded-md">Edit Profile</Link>
                                        : ""
                                }
                            </div>

                            <AboutUser />

                        </div>
                    </section>
            }

        </AnimationWrapper>

    )
}

export default UserProfilePage;