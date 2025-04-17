import Navbar from "./components/navbar.component.jsx"
import {Route, Routes} from "react-router-dom";
import UserAuthForm from "./pages/userAuthForm.page.jsx";

const App = () => {
    return (
        <Routes>
            <Route path="/" element={<Navbar/>}>
                <Route path="login" element={<UserAuthForm type={"Login"}/>}/>
                <Route path="signup" element={<UserAuthForm type={"Sign Up"}/>}/>
            </Route>
        </Routes>
    );
}

export default App;
