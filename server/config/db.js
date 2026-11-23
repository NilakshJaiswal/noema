import mongoose from 'mongoose';

/**
 * Connect to MongoDB. The API still boots if the DB is unreachable so that the
 * marketing site keeps working in environments without a database; contact
 * submissions will simply fail gracefully until a connection is established.
 */
export async function connectDB(uri) {
  if (!uri) {
    console.warn('[db] MONGODB_URI is not set — contact submissions will not be persisted.');
    return null;
  }

  mongoose.set('strictQuery', true);

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 8000,
    });
    console.log(`[db] MongoDB connected: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (err) {
    console.error('[db] MongoDB connection error:', err.message);
    console.warn('[db] Server will continue running without a database connection.');
    return null;
  }
}

export function dbReady() {
  return mongoose.connection?.readyState === 1;
}
