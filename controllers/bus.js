import Bus from "../models/bus.js";

export const getBuses = async (req, res) => {
    try {
        const { busId } = req.params;
        if (!busId) {
            return res.status(400).json({ error: 'Bus ID is required' });
        }
        const bus = await Bus.findOne({ busId });
        if (!bus) {
            return res.status(404).json({ error: 'Bus not found' });
        }
        res.status(200).json({
            success: true,
            data: {
                busId: bus.busId,
                from: bus.from,
                to: bus.to,
                departureTime: bus.departureTime,
                arrivalTime: bus.arrivalTime,
                duration: bus.duration,
                availableSeats: bus.availableSeats,
                price: bus.price,
                originalPrice: bus.originalPrice,
                company: bus.company,
                busType: bus.busType,
                rating: bus.rating,
                totalReviews: bus.totalReviews,
                badges: bus.badges,
                seats: bus.seats,
            }
        });
    }
    catch (error) {
        console.error('Error fetching buses:', error);
        res.status(500).json({ error: 'Failed to fetch buses' });
    }
}

export const searchBuses = async (req, res) => {
    try {
        const { from, to, departureDate } = req.query;
        if (!from || !to || !departureDate) {
            return res.status(400).json({ error: 'From, To and Departure Date are required' });
        }
        const departureDateStart = new Date(departureDate);
        departureDateStart.setHours(0, 0, 0, 0);
        const departureDateEnd = new Date(departureDate);
        departureDateEnd.setHours(23, 59, 59, 999);

        const buses = await Bus.find({
            from: new Date(from),
            to: new Date(to),
            departureTime: { $gte: departureDateStart, $lte: departureDateEnd },
        });

        res.status(200).json({
            success: true,
            data: buses
        });
    }
    catch (error) {
        console.error('Error searching buses:', error);
        res.status(500).json({ error: 'Failed to search buses' });
    }
}