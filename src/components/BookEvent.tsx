'use client'

import { useState } from 'react';


const BookEvent = () => {

    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);
    ``
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setTimeout(() => {
            setSubmitted(true);
        }, 1000);
    }

    return (
        <div id="book-event">
            {submitted ? (
                <p>Thank you for booking your spot!</p>
            ) : (
                <form onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor='email'>Email Address</label>
                        <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                        id="email"
                        placeholder="Enter your email"

                    </div>

                    <button type="submit">Book Now</button>
                </form>
            )}

        </div>
    )
}

export default BookEvent;