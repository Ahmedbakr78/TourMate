import mongoose from 'mongoose';

export async function dbConnection() {
    try {
        await mongoose.connect(process.env.DB_URL_LOCAL as string);
        console.log('Database connected successfully');
    } catch (error) {
        console.error('Error connecting to database:', error);
    }
}