import Bus from "../models/bus.js";
import User from "../models/user.js";
import Ticket from "../models/ticket.js";

import { v4 as uuidv4 } from 'uuid';

export const getTickets = async (req, res) => {
    try {
        const { userId } = req.params;
        if (!userId) {
            return res.status(400).json({ error: 'User ID is required' });
        }
        const tickets = await Ticket.find({ userId }).populate('bus', 'busId from to departureTime arrivalTime price company busType').sort({ bookedAt: -1 });

        res.status(200).json({
            success: true,
            data: tickets || []
        });
    }
    catch (error) {
        console.error('Error fetching tickets:', error);
        res.status(500).json({ error: 'Failed to fetch tickets' });
    }
}

export const bookTicket = async (req, res) => {
    try {
        const { userId, busId, date, seatNumbers } = req.body;
        if (!userId || !busId || !date || !seatNumbers || seatNumbers.length === 0) {
            return res.status(400).json({ error: 'User ID, Bus ID, Date and Seat Numbers are required' });
        }
        const bus = await Bus.findOne({ busId });
        if (!bus) {
            return res.status(404).json({ error: 'Bus not found' });
        }
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        const unavailableSeats = seatNumbers.filter((seatNum) =>
            bus.seats.some((row) => {
                row.some((seat) => seat.seat_id === seatNum && seat.booked)
            })
        )
        if (unavailableSeats.length > 0) {
            return res.status(400).json({ error: 'Some selected seats are already booked' });
        }
        const totalFare = seatNumbers.length * bus.price;
        const newTicket = new Ticket({
            user: user._id,
            bus: bus._id,
            date,
            total_fare: totalFare,
            seatNumbers,
            pnr: uuidv4().slice(0, 10).toUpperCase(),
        })
        await newTicket.save();
        bus.seats.forEach((row) => {
            row?.forEach((seat) => {
                if (seatNumbers.includes(seat.seat_id)) {
                    seat.booked = true;
                }
            })
        })
        await bus.save();
        res.status(201).json({
            success: true,
            data: newTicket
        });
    } catch (error) {
        console.error('Error booking ticket:', error);
        res.status(500).json({ error: 'Failed to book ticket' });
    }
}
