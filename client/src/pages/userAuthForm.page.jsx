import InputBox from "../components/input.component.jsx";
import googleIcon from "../assets/google.png";
import {Link} from "react-router-dom";
import AnimationWrapper from "../common/page-animation.jsx";

const UserAuthForm = ({type}) => {
    return (
        <AnimationWrapper keyValue={type}>
            <section className="h-cover flex items-center justify-center">
                <form className="w-[80%] max-w-[400px]">
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

                    <button className="btn-dark center mt-14" type="submit">
                        {type}
                    </button>

                    <div className="relative w-full flex items-center gap-2 my-10 opacity-10 text-black font-bold">
                        <hr className="w-1/2 border-black"/>
                        <p>or</p>
                        <hr className="w-1/2 border-black"/>
                    </div>

                    <button className="btn-dark flex items-center justify-center gap-4 w-[70%] center">
                        <img src={googleIcon} className="w-5" alt="google icon"/>
                        Continue with Google
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