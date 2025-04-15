import Navbar from "./components/navbar.component.jsx"
import {Route, Routes} from "react-router-dom";
const App = () => {
    return (
        <Routes>
            <Route path="/" element={<Navbar />} >
                <Route path="login" element={<h1>Login Page </h1>} />
                <Route path="signup" element={<h1>Sign Up Page </h1>} />
            </Route>
        </Routes>
    );
}

export default App;
