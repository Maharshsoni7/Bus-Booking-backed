import express from "express";
import { bookTicket, getTickets } from "../controllers/ticket.js";
import verifyToken from "../middleware/verify.js";


const router = express.Router();

router.post('/bookTicket', verifyToken, bookTicket);
router.get('/my-tickets', verifyToken, getTickets);

export default router;