import Navbar from "./components/navbar.component.jsx"
import {Route, Routes} from "react-router-dom";
import UserAuthForm from "./pages/userAuthForm.page.jsx";
import {createContext, useEffect, useState} from "react";
import {lookInSession} from "./common/session.jsx";
import Editor from "./pages/editor.pages.jsx";

export const UserContext = createContext({});

const App = () => {

    const [userAuth, setUserAuth] = useState({});

    // Use sessions to keep users logged in (runs once)
    useEffect(() => {
        let userSession = lookInSession("user");
        userSession ? setUserAuth(JSON.parse(userSession)) : setUserAuth({access_token: null})
    }, []);

    return (
        <UserContext.Provider value={{userAuth, setUserAuth}}>
            <Routes>
                <Route path="/" element={<Navbar/>}>
                <Route path="/editor" element={<Editor />}/>
                    <Route path="login" element={<UserAuthForm type={"Login"}/>}/>
                    <Route path="signup" element={<UserAuthForm type={"Sign Up"}/>}/>
                </Route>
            </Routes>
        </UserContext.Provider>
    );
}

export default App;
