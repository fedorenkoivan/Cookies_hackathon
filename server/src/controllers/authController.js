import UserModel from '../models/userModel.js';
import { registerUser, loginUser, getUserFromToken } from '../services/authService.js';

export const register = async (req, res) => {
    const { username, email, mobile, password, userType } = req.body;

    if (!username || !email || !mobile || !password) {
        return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    const user = new UserModel({ username, email, mobile, password, userType });

    try {
        const response = await registerUser(user);
        if (response.success) {
            return res.status(201).json(response);
        } else {
            return res.status(400).json(response);
        }
    } catch (error) {
        console.error('Error in user registration:', error);
        return res.status(500).json({ 
            success: false, 
            message: 'Registration failed. Please try again later.' 
        });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    try {
        const response = await loginUser(email, password);
        
        if (response.success) {
            return res.status(200).json(response);
        } else {
            return res.status(401).json(response);
        }
    } catch (error) {
        console.error('Error in user login:', error);
        return res.status(500).json({ 
            success: false, 
            message: 'Login failed. Please try again later.' 
        });
    }
};

export const getUserDetails = async (req, res) => {
    
    const token = req.headers.authorization?.split(' ')[1];
    console.log(token);

    if (!token) {
        return res.status(401).json({ success: false, message: 'Token not provided' });
    }

    try {
        const response = await getUserFromToken(token);

        if (response.success) {
            return res.status(200).json({ success: true, user: response.user });
        } else {
            return res.status(401).json({ success: false, message: response.message });
        }
    } catch (error) {
        console.error('Error fetching user details:', error);
        return res.status(500).json({ success: false, message: 'Failed to retrieve user details' });
    }
};