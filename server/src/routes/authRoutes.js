import express from 'express';
import { getUserDetails, login, register } from '../controllers/authController.js';


const router = express.Router();

router.post('/register-user', register);
router.post('/login', login);
router.get('/get-userDetails', getUserDetails);


export default router;