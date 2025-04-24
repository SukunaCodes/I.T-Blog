import bcrypt from 'bcrypt';
import {formatDataToSend, generateUsername} from "../Middlewares/userAuth.js";
import User from "../Schema/User.js";


let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // regex for email
let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/; // regex for password

/*User Registration*/
export const register = async (req, res) => {
    const {fullname, email, password} = req.body;

    // Data validation from client frontend
    if (fullname.length < 3) {
        return res.status(403).json({"error": "Fullname must be at least 3 characters long"})
    }
    if (!email.length) {
        res.status(403).json({"error": "Please provide an email"})
    }
    if (!emailRegex.test(email)) {
        return res.status(403).json({"error": "Invalid email"})
    }
    if (!passwordRegex.test(password)) {
        return res.status(403).json({"error": "Password should be 6 to 20 characters long with 1 numeric, 1 lowercase, 1 Uppercase letters"})
    }

    // Hashing the password
    const hashed_password = await bcrypt.hash(password, 10);
    let username = await generateUsername(email);

    // User Creation
    try {
        const user = await User.create({
            fullname,
            email,
            password: hashed_password,
            username,
        });
        return res.status(200).json(formatDataToSend(user))
    } catch (error) {
        if (error.name === "SequelizeUniqueConstraintError") {
            // Handle Unique constraint error (duplicate emails)
            return res.status(400).json({error: "Email already exists!"})
        }
        // Log other errors for debugging
        console.error('Error during signup:', error);
        return res.status(500).json({error: 'Internal server error'});
    }
}