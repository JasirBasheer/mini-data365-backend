import express from 'express';
   import mongoose from 'mongoose';
   import cors from 'cors';
   import dotenv from 'dotenv';
   import influencerRoutes from './routes/influencerRoutes.js';

   dotenv.config();

   const app = express();
   app.use(cors());
   app.use(express.json());

   mongoose.connect(process.env.MONGO_URI, {
     useUnifiedTopology: true,
     useNewUrlParser: true,
   }).then(() => console.log('MongoDB connected'))
     .catch(err => console.error(err));

   app.use('/api/influencers', influencerRoutes);
   app.get('/api/health', (req, res) => res.json({ status: 'OK' }));

   const PORT = process.env.PORT || 5000;
   app.listen(PORT, () => console.log(`Server running on port ${PORT}`));