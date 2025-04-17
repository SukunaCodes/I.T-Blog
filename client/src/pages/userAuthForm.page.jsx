import InputBox from "../components/input.component.jsx";

const UserAuthForm = ({type}) => {
    return (
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
            </form>
        </section>
    )
}

export default UserAuthForm;