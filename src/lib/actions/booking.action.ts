'use server';

import Booking from '@/database/booking.model';

import connectDB from "@/lib/mongodb";

export const createBooking = async ({ eventId, slug, email }: { eventId: string; slug: string; email: string; }): Promise<{ success: boolean; error?: string }> => {
    try {
        await connectDB();

        await Booking.create({ eventId, slug, email });

        return { success: true };
    } catch (e) {
        console.error('create booking failed', e);

        // Check for duplicate key error (MongoDB code 11000)
        if ((e as any).code === 11000) {
            return {
                success: false,
                error: 'You have already booked this event'

            };
        }

        return {
            success: false,
            error: e instanceof Error ? e.message : 'Unknown error occurred'
        };
    }
}