import { pool } from "../config/db.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = '76348734687346874363443434343443333333333';

export const registerUser = async (user) => {
    try {
        const [existingUser] = await pool.query('SELECT * FROM users WHERE email = ?', [user.email]);
        if (existingUser.length > 0) {
            return { success: false, message: 'User already exists' };
        }
        
        const hashedPassword = await bcrypt.hash(user.password, 10);
        const query = `INSERT INTO users (name, email, mobile, password, userType) VALUES (?, ?, ?, ?,?)`;
        const values = [user.username, user.email, user.mobile, hashedPassword,user.userType];
        await pool.query(query, values);
        return { success: true, message: 'User registered successfully' };
    } catch (error) {
        console.error("Registration error:", error);
        return { success: false, message: 'Registration failed. Please try again later.' };
    }
};

export const loginUser = async (email, password) => {
    try {
        const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
        if (rows.length === 0) {
            return { success: false, message: 'User not found' };
        }
        
        const user = rows[0];
        const passwordMatch = await bcrypt.compare(password, user.password);
        
        if (!passwordMatch) {
            return { success: false, message: 'Incorrect password' };
        }
        
        const token = jwt.sign(
            { id: user.id, email: user.email, userType:user.userType },
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        console.log("Generated token:", token);
        
        return { 
            success: true, 
            message: 'Login successful', 
            token, 
            user: { id: user.id, email: user.email, userType:user.userType } 
        };
    } catch (error) {
        console.error("Login error:", error);
        return { success: false, message: 'Login failed. Please try again later.' };
    }
};

export const getUserFromToken = async (token) => {
    try {
        const trimmedToken = token.trim();
        console.log("Received token:", trimmedToken);

        const decoded = jwt.verify(trimmedToken, JWT_SECRET);
        console.log("Decoded token:", decoded);

        const [rows] = await pool.query('SELECT id, name, email, mobile, userType FROM users WHERE id = ?', [decoded.id]);

        if (rows.length === 0) {
            return { success: false, message: 'User not found' };
        }

        const user = rows[0];
        return { success: true, user };
    } catch (error) {
        console.error("Token verification error:", error);
        return { success: false, message: 'Invalid or expired token' };
    }
};