import Navbar from "./components/navbar.component.jsx"
import {Route, Routes} from "react-router-dom";
const App = () => {
    return (
        <Routes>
            <Route path="/" element={<Navbar />} >
                <Route path="signin" element={<h1>Sign In Page </h1>} />
                <Route path="signup" element={<h1>Sign Up Page </h1>} />
            </Route>
        </Routes>
    );
}

export default App;
