import InputBox from "../components/input.component.jsx";
import googleIcon from "../assets/google.png";
import {Link, Navigate} from "react-router-dom";
import AnimationWrapper from "../common/page-animation.jsx";
import {Toaster, toast} from "react-hot-toast";
import axios from "axios";
import {storeSession} from "../common/session.jsx";
import {useContext, useState} from "react";
import {UserContext} from "../App.jsx";
import {googleAuth} from "../common/firebase.jsx";

const UserAuthForm = ({type}) => {

    let {userAuth: {access_token}, setUserAuth} = useContext(UserContext);
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);


    console.log(access_token);

    // Function to make Requests to the Backend Server
    const userAuthPostServerConnection = async (serverRoute, currentFormData) => {
        let loadingToast = toast.loading("Authenticating");
        try {
            const {data} = await axios.post(
                import.meta.env.VITE_SERVER_DOMAIN + serverRoute,
                currentFormData
            );
            storeSession("user", JSON.stringify(data));
            setUserAuth(data);
            toast.dismiss(loadingToast);
            toast.success("Welcome");
        } catch ({response}) {
            toast.dismiss(loadingToast);
            toast.error(response.data.error);
            throw response.data.error;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        let serverRoute = type === "Login" ? "/auth/signin" : "/auth/signup";

        let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;

        let form = new FormData(formElement);
        let currentFormData = {};

        for (let [key, value] of form.entries()) {
            currentFormData[key] = value;
        }

        let {fullname, email, password} = currentFormData;

        if (fullname) {
            if (fullname.length < 3) {
                return toast.error("Fullname must be at least 3 characters long");
            }
        }
        if (!email.length) {
            return toast.error("Please provide an email");
        }
        if (!emailRegex.test(email)) {
            return toast.error("Invalid email");
        }
        if (!passwordRegex.test(password)) {
            return toast.error(
                "Password should be 6 to 20 characters long with 1 numeric, 1 lowercase, 1 Uppercase letters"
            );
        }
        console.log(currentFormData);

        await userAuthPostServerConnection(serverRoute, currentFormData);
    };

    const handleGoogleAuth = async (e) => {
        e.preventDefault();
        setIsGoogleLoading(true);

        try {
            await googleAuth().then(async (user) => {
                console.log(user);
                let serverRoute = "/auth/google-auth";
                let currentFormData = {
                    access_token: user.accessToken,
                };
                await userAuthPostServerConnection(serverRoute, currentFormData);
            });
        } catch (e) {
            setIsGoogleLoading(false);
            toast.error("Google Authentication Error!");
            return console.log(e);
        } finally {
            setIsGoogleLoading(false);
        }
    }

    return (
        access_token ? <Navigate to="/" /> :
            <AnimationWrapper keyValue={type}>
                <section className="h-cover flex items-center justify-center">
                    <Toaster/>
                    <form id="formElement" className="w-[80%] max-w-[400px]">
                        <h1 className="text-4xl font-gelasio capitalize text-center mb-24">
                            {type === "Login" ? "Welcome Back" : "Join us today"}
                        </h1>

                        {
                            type !== "Login" ?
                                <InputBox
                                    name="fullname"
                                    type="text"
                                    placeholder="Full Name"
                                    icon="fi-rr-user"
                                />
                                : ""
                        }

                        <InputBox
                            name="email"
                            type="email"
                            placeholder="Email Address"
                            icon="fi-rr-envelope"
                        />

                        <InputBox
                            name="password"
                            type="password"
                            placeholder="Password"
                            icon="fi-rr-key"
                        />

                        <button className="btn-dark center mt-14" type="submit" onClick={handleSubmit}>
                            {type}
                        </button>

                        <div className="relative w-full flex items-center gap-2 my-10 opacity-10 text-black font-bold">
                            <hr className="w-1/2 border-black"/>
                            <p>or</p>
                            <hr className="w-1/2 border-black"/>
                        </div>

                        <button className="btn-dark flex items-center justify-center gap-4 w-[70%] center" onClick={handleGoogleAuth} disabled={isGoogleLoading}>
                            <img src={googleIcon} className="w-5" alt="google icon"/>
                            {isGoogleLoading ? (
                                "Loading"
                            ) : (
                                "Continue with Google"
                            )}
                        </button>

                        {
                            type === "Login" ?
                                <p className="mt-6 text-dark-grey text-xl text-center">
                                    Don't have an account?
                                    <Link to="/signup" className="underline text-black text-xl ml-1">
                                        Join us today
                                    </Link>
                                </p>
                                :
                                <p className="mt-6 text-dark-grey text-xl text-center">
                                    Already a member?
                                    <Link to="/login" className="underline text-black text-xl ml-1">
                                        Sign in
                                    </Link>
                                </p>
                        }
                    </form>
                </section>
            </AnimationWrapper>
    )
}

export default UserAuthForm;