import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import connectDB from './config/db.js';
import adminRouter from './routes/adminRoutes.js';
import blogRouter from './routes/blogRoutes.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const startServer = async () => {
  try {
    // ✅ Connect to MongoDB
    await connectDB();
    console.log('✅ MongoDB connected');

    // ✅ CORS config
    app.use(
      cors({
        origin: [
          'http://localhost:5173',
          'http://localhost:5050',
          'https://quickblog-eight.vercel.app',
           process.env.CLIENT_URL,
        ],
        credentials: true,
      })
    );

    // ✅ Body parsers
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    // ✅ Static file serving
    app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

    // ✅ API routes
    app.get('/', (req, res) => res.send('✅ API is working'));
    app.use('/api/admin', adminRouter);
    app.use('/api/blogs', blogRouter); // ✅ changed from /api/blog

    // ✅ Start server
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
      console.log(`📂 Static files served from /uploads`);
    });
  } catch (error) {
    console.error('❌ Server failed to start:', error.message);
    process.exit(1);
  }
};

startServer();
