import mongoose, { Schema, Document, Model } from 'mongoose';

/**
 * TypeScript interface for Event document
 */
export interface IEvent extends Document {
  title: string;
  slug: string;
  description: string;
  overview: string;
  image: string;
  venue: string;
  location: string;
  date: string; // ISO format string
  time: string; // Consistent format string
  mode: string;
  audience: string;
  agenda: string[];
  organizer: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Mongoose schema for Event model
 */
const eventSchema = new Schema<IEvent>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      validate: {
        validator: (value: string) => value.trim().length > 0,
        message: 'Title cannot be empty',
      },
    },
    slug: {
      type: String,
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      validate: {
        validator: (value: string) => value.trim().length > 0,
        message: 'Description cannot be empty',
      },
    },
    overview: {
      type: String,
      required: [true, 'Overview is required'],
      validate: {
        validator: (value: string) => value.trim().length > 0,
        message: 'Overview cannot be empty',
      },
    },
    image: {
      type: String,
      required: [true, 'Image is required'],
      validate: {
        validator: (value: string) => value.trim().length > 0,
        message: 'Image cannot be empty',
      },
    },
    venue: {
      type: String,
      required: [true, 'Venue is required'],
      validate: {
        validator: (value: string) => value.trim().length > 0,
        message: 'Venue cannot be empty',
      },
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      validate: {
        validator: (value: string) => value.trim().length > 0,
        message: 'Location cannot be empty',
      },
    },
    date: {
      type: String,
      required: [true, 'Date is required'],
    },
    time: {
      type: String,
      required: [true, 'Time is required'],
    },
    mode: {
      type: String,
      required: [true, 'Mode is required'],
      enum: {
        values: ['online', 'offline', 'hybrid'],
        message: 'Mode must be one of: online, offline, hybrid',
      },
    },
    audience: {
      type: String,
      required: [true, 'Audience is required'],
      validate: {
        validator: (value: string) => value.trim().length > 0,
        message: 'Audience cannot be empty',
      },
    },
    agenda: {
      type: [String],
      required: [true, 'Agenda is required'],
      validate: {
        validator: (value: string[]) => value.length > 0 && value.every((item) => item.trim().length > 0),
        message: 'Agenda must contain at least one non-empty item',
      },
    },
    organizer: {
      type: String,
      required: [true, 'Organizer is required'],
      validate: {
        validator: (value: string) => value.trim().length > 0,
        message: 'Organizer cannot be empty',
      },
    },
    tags: {
      type: [String],
      required: [true, 'Tags are required'],
      validate: {
        validator: (value: string[]) => value.length > 0 && value.every((item) => item.trim().length > 0),
        message: 'Tags must contain at least one non-empty item',
      },
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

/**
 * Generate URL-friendly slug from title
 * Converts to lowercase, replaces spaces and special chars with hyphens
 */
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces, underscores, and multiple hyphens with single hyphen
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

/**
 * Normalize date string to ISO format
 * Accepts various date formats and converts to ISO string
 */
function normalizeDate(dateString: string): string {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    throw new Error(`Invalid date format: ${dateString}`);
  }
  return date.toISOString().split('T')[0]; // Returns YYYY-MM-DD format
}

/**
 * Normalize time string to consistent format (HH:MM)
 * Handles various time formats and standardizes to 24-hour format
 */
function normalizeTime(timeString: string): string {
  const trimmed = timeString.trim();
  
  // Try to parse as Date to handle various formats
  const testDate = new Date(`2000-01-01 ${trimmed}`);
  if (!isNaN(testDate.getTime())) {
    const hours = testDate.getHours().toString().padStart(2, '0');
    const minutes = testDate.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }
  
  // If parsing fails, try to extract HH:MM pattern
  const timeMatch = trimmed.match(/(\d{1,2}):(\d{2})/);
  if (timeMatch) {
    const hours = parseInt(timeMatch[1], 10).toString().padStart(2, '0');
    const minutes = timeMatch[2];
    return `${hours}:${minutes}`;
  }
  
  // Return as-is if no pattern matches (validation will catch invalid formats)
  return trimmed;
}

/**
 * Pre-save hook: Generate slug from title and normalize date/time
 * Only regenerates slug if title has changed
 */
eventSchema.pre('save', function () {
  // Generate slug only if title is modified or slug doesn't exist
  if (this.isModified('title') || !this.slug) {
    this.slug = generateSlug(this.title);
  }
  
  // Normalize date to ISO format if date is modified
  if (this.isModified('date')) {
    try {
      this.date = normalizeDate(this.date);
    } catch (error) {
      throw error instanceof Error ? error : new Error('Invalid date format');
    }
  }
  
  // Normalize time to consistent format if time is modified
  if (this.isModified('time')) {
    this.time = normalizeTime(this.time);
  }
});

// Create unique index on slug for faster lookups and uniqueness enforcement
eventSchema.index({ slug: 1 }, { unique: true });

/**
 * Event model
 */
const Event: Model<IEvent> = mongoose.models.Event || mongoose.model<IEvent>('Event', eventSchema);

export default Event;

