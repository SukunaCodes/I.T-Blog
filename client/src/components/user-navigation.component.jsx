import AnimationWrapper from "../common/page-animation.jsx";
import {Link} from "react-router-dom";
import {useContext} from "react";
import {UserContext} from "../App.jsx";
import {removeFromSession} from "../common/session.jsx";

const UserNavigationPanel = () => {

    const {userAuth: {username}, setUserAuth} = useContext(UserContext);
    const handleUserSignOut = () => {
        // Handle user logout logic
        removeFromSession("user");
        setUserAuth({access_token: null});
    }
    return (
        <AnimationWrapper
            className="absolute right-0 z-50"
            transition={{duration: 0.2}}>
            <div className="bg-white absolute right-0 border border-grey w-60 duration-200">
                <Link to="/editor" className="flex gap-2 link md:hidden pl-8 py-4">
                    <i className="fi fi-rr-drawer-alt"></i>
                    <p>Write</p>
                </Link>

                <Link to={`/user/${username}`} className="pl-8 py-4 link">
                    Profile
                </Link>
                <Link to="/dashboard/blogs" className="pl-8 py-4 link">
                    Dashboard
                </Link>
                <Link to="/settings/edit-profile" className="pl-8 py-4 link">
                    Settings
                </Link>
                <span className="absolute border-t border-grey w-[100%]"></span>

                <button className="text-left p-4 hover:bg-grey w-full pl-8 py-4" onClick={handleUserSignOut}>
                    <h1 className="font-bold text-xl mg-1">Sign Out</h1>
                    <p className="text-dark-grey">{username}</p>
                </button>
            </div>
        </AnimationWrapper>
    )
}

export default UserNavigationPanel;