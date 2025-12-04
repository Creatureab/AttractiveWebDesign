'use client';

import { createBooking } from '@/lib/actions/booking.action';
import { useState } from 'react';
import posthog from 'posthog-js';
interface BookEventProps {
    eventId: string;
    slug: string;
}

const BookEvent = ({ eventId, slug }: BookEventProps) => {
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        setError('');

        const result: { success: boolean } = await createBooking({ eventId, slug, email });

        if (result.success) {
            setSubmitted(true);
            posthog.capture('booking_success', {
                event_id: eventId,
                slug,
                email
            });
        } else {
            setError('Booking failed. Try again.');
            posthog.captureException('booking creation Failed')
        }
    };

    return (
        <div id="book-event">
            {submitted ? (
                <p>Thank you for booking your spot!</p>
            ) : (
                <form onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="email">Email Address</label>
                        <input
                            type="email"
                            id="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                        />
                    </div>

                    {error && <p style={{ color: 'red' }}>{error}</p>}

                    <button type="submit">Book Now</button>
                </form>
            )}
        </div>
    );
};

export default BookEvent;
