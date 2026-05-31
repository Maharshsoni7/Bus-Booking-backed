import express from "express";
import { loginOrSignup, refreshAccessToken } from "../controllers/user.js";


const router = express.Router();

router.post('/login', loginOrSignup);
router.post('/refresh', refreshAccessToken);

export default router;