import express from "express";
import { getBuses, searchBuses } from "../controllers/bus.js";

const router = express.Router();


router.get('/:busId', getBuses);
router.post('/search', searchBuses);
    

export default router;