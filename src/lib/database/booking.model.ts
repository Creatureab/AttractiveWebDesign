<<<<<<< HEAD
import mongoose, { Schema, Document, Model, Types } from 'mongoose';
import Event from './event.model';

/**
 * TypeScript interface for Booking document
 */
=======
import { Schema, model, models, Document, Types } from 'mongoose';
import Event from './event.model';

// TypeScript interface for Booking document
>>>>>>> f23c42b4fbed63c88d636c7d684fffbe35fcc7a9
export interface IBooking extends Document {
  eventId: Types.ObjectId;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

<<<<<<< HEAD
/**
 * Mongoose schema for Booking model
 */
const bookingSchema = new Schema<IBooking>(
=======
const BookingSchema = new Schema<IBooking>(
>>>>>>> f23c42b4fbed63c88d636c7d684fffbe35fcc7a9
  {
    eventId: {
      type: Schema.Types.ObjectId,
      ref: 'Event',
      required: [true, 'Event ID is required'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      validate: {
<<<<<<< HEAD
        validator: (value: string) => {
          // Email validation regex
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          return emailRegex.test(value);
=======
        validator: function (email: string) {
          // RFC 5322 compliant email validation regex
          const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
          return emailRegex.test(email);
>>>>>>> f23c42b4fbed63c88d636c7d684fffbe35fcc7a9
        },
        message: 'Please provide a valid email address',
      },
    },
  },
  {
<<<<<<< HEAD
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

/**
 * Pre-save hook: Verify that the referenced event exists
 * Throws an error if the eventId doesn't correspond to an existing Event
 */
bookingSchema.pre('save', async function () {
  const eventExists = await Event.findById(this.eventId);
  if (!eventExists) {
    throw new Error(`Event with ID ${this.eventId} does not exist`);
  }
});

// Create index on eventId for faster queries when filtering bookings by event
bookingSchema.index({ eventId: 1 });

/**
 * Booking model
 */
const Booking: Model<IBooking> = mongoose.models.Booking || mongoose.model<IBooking>('Booking', bookingSchema);

export default Booking;
=======
    timestamps: true, // Auto-generate createdAt and updatedAt
  }
);

// Pre-save hook to validate events exists before creating booking
BookingSchema.pre('save', async function () {
  const booking = this as IBooking;

  // Only validate eventId if it's new or modified
  if (booking.isModified('eventId') || booking.isNew) {
    try {
      const eventExists = await Event.findById(booking.eventId).select('_id');

      if (!eventExists) {
        throw new Error(`Event with ID ${booking.eventId} does not exist`);
      }
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : 'Invalid event ID format or database error'
      );
    }
  }
});

// Create index on eventId for faster queries
BookingSchema.index({ eventId: 1 });

// Create compound index for common queries (events bookings by date)
BookingSchema.index({ eventId: 1, createdAt: -1 });

// Create index on email for user booking lookups
BookingSchema.index({ email: 1 });

// Enforce one booking per events per email
BookingSchema.index({ eventId: 1, email: 1 }, { unique: true, name: 'uniq_event_email' });
const Booking = models.Booking || model<IBooking>('Booking', BookingSchema);

export default Booking;
>>>>>>> f23c42b4fbed63c88d636c7d684fffbe35fcc7a9
