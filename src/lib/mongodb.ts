import mongoose, { Mongoose } from 'mongoose';

/**
 * Global variable to cache the Mongoose connection.
 * In Next.js, during development, the module may be reloaded multiple times,
 * causing multiple connection attempts. This cache prevents that.
 */
declare global {
  // eslint-disable-next-line no-var
  var mongoose: { conn: Mongoose | null; promise: Promise<Mongoose> | null } | undefined;
}

/**
 * Cached connection object to store the Mongoose connection and promise.
 * This ensures we only create one connection per instance.
 */
const cached: { conn: Mongoose | null; promise: Promise<Mongoose> | null } = global.mongoose || {
  conn: null,
  promise: null,
};

// Store the cached object globally to persist across hot reloads in development
if (!global.mongoose) {
  global.mongoose = cached;
}

/**
 * MongoDB connection options for optimal performance and reliability.
 */
const mongooseOptions: mongoose.ConnectOptions = {
  bufferCommands: false, // Disable mongoose buffering
  maxPoolSize: 10, // Maintain up to 10 socket connections
  serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
  socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
  family: 4, // Use IPv4, skip trying IPv6
};

/**
 * Establishes a connection to MongoDB using Mongoose.
 * Uses connection caching to prevent multiple connections during development.
 * 
 * @returns {Promise<Mongoose>} A promise that resolves to the Mongoose instance
 * @throws {Error} If MONGODB_URI is not defined or connection fails
 */
async function connectDB(): Promise<Mongoose> {
  // Get MongoDB URI from environment variables
  const MONGODB_URI: string | undefined = process.env.MONGODB_URI;

  // Validate that MONGODB_URI is provided
  if (!MONGODB_URI) {
    throw new Error(
      'Please define the MONGODB_URI environment variable inside .env.local'
    );
  }

  // If we already have a cached connection, return it
  if (cached.conn) {
    return cached.conn;
  }

  // If we don't have a connection promise yet, create one
  if (!cached.promise) {
    const opts: mongoose.ConnectOptions = {
      ...mongooseOptions,
    };

    // Create the connection promise
    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongooseInstance: Mongoose) => {
      return mongooseInstance;
    });
  }

  try {
    // Wait for the connection to be established
    cached.conn = await cached.promise;
  } catch (error: unknown) {
    // Reset the promise on error so we can retry
    cached.promise = null;
    
    // Provide a more descriptive error message
    if (error instanceof Error) {
      throw new Error(`Failed to connect to MongoDB: ${error.message}`);
    }
    throw error;
  }

  // Return the established connection
  return cached.conn;
}

export default connectDB;

