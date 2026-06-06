import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Bus from './models/Bus.js';
import { buses, generateSeats,locations, } from './seedData.js';
dotenv.config();

const generateRandomTime = (baseDate) => {
    const hour = Math.floor(Math.random() * 12) + 8; // 8 AM to 7 PM
    const minute = Math.floor(Math.random() * 60);
   
    const date = new Date(baseDate);
    date.setHours(hour, minute, 0, 0);
    return date;

}

async function seedDatabase() { 
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');
        await Bus.deleteMany();
        console.log('Cleared existing bus data');
        const busesToInsert = [];
        for (let i = 0; i < locations.length; i++) { 
            for (let j = i + 1; j < locations.length; j++) {
                // Generate bus data for each location pair
                const from = locations[i];
                const to = locations[j];
                const baseDate = new Date();
                baseDate.setDate(baseDate.getDate() + 1);

                for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
                    const travelDate = new Date(baseDate);
                    travelDate.setDate(baseDate.getDate() + dayOffset);

                    const returnDate = new Date(travelDate);
                    returnDate.setDate(travelDate.getDate() + 1);

                    buses.forEach((bus) => { 
                        const departureTime = generateRandomTime(travelDate);
                        const arrivalTime = new Date(travelDate);
                        busesToInsert.push({
                            busId: `${bus.busId}_${from}_${to}_${dayOffset}`,
                            from,
                            to,
                            departureTime,
                            arrivalTime,
                            duration: Math.ceil((arrivalTime - departureTime) / (1000 * 60)), // Duration in minutes
                            availableSeats: 28,
                            price: bus.price,
                            originalPrice: bus.originalPrice,
                            rating: bus.rating,
                            company: bus.company,
                            busType: bus.busType,
                            totalReviews: bus.totalReviews,
                            badges: bus.badges,
                            seats: generateSeats(),
                        })
                    });

                    buses.forEach((bus) => {
                        const departureTime = generateRandomTime(travelDate);
                        const arrivalTime = new Date(travelDate);
                        busesToInsert.push({
                            busId: `${bus.busId}_${to}_${from}_${dayOffset}`,
                            from: to,
                            to: from,
                            departureTime,
                            arrivalTime,
                            duration: Math.ceil((arrivalTime - departureTime) / (1000 * 60)), // Duration in minutes
                            availableSeats: 28,
                            price: bus.price,
                            originalPrice: bus.originalPrice,
                            rating: bus.rating,
                            company: bus.company,
                            busType: bus.busType,
                            totalReviews: bus.totalReviews,
                            badges: bus.badges,
                            seats: generateSeats(),
                        })
                    });
                    
                }
            }
        }

        await Bus.insertMany(busesToInsert);
        console.log('Database seeded successfully');
    } catch (error) { 
        console.error('Error seeding database:', error);
    } finally {
        mongoose.connection.close();
     }
}
seedDatabase();