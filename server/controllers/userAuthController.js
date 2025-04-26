import bcrypt from 'bcrypt';
import {formatDataToSend, generateUsername} from "../middlewares/userAuth.js";
import User from "../models/User.js";


let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // regex for email
let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/; // regex for password

/* User Registration Function */
export const register = async (req, res) => {
    const {fullname, email, password} = req.body;

    // Data validation
    if (fullname.length < 3) {
        return res.status(403).json({"error": "Fullname must be at least 3 characters long"})
    }
    if (!email.length) {
        return res.status(403).json({"error": "Please provide an email"})
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

/* User Login Function */
export const login = async (req, res) => {
    try {
        const {email, password} = req.body;
        const normalizedEmail = email.toLowerCase();
        console.log("Querying email -->", normalizedEmail);
        // Find user by email
        const user = await User.findOne({where: {email: normalizedEmail}})

        // Check if user exists
        if (!user) {
            return res.status(403).json({error: "Email not found!"});
        }
        console.log(JSON.stringify(user, null, 2));

        // Verifying password
        await bcrypt.compare(password, user.password, (err, result) => {
            if (err){
                return res.status(403).json({error: "Error occurred while attempting to login. Please try again later."})
            }
            if (!result){
                return res.status(403).json({error: "Incorrect Password!"})
            } else{
                return res.status(200).json({
                    status: 'Login successful!',
                    ...formatDataToSend(user),
                });
            }
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({error: "An unexpected error has occurred."});
    }
}