import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import compressRouter from './routes/compress.js';
import protectRouter from './routes/protect.js';
import unlockRouter from './routes/unlock.js';
import pdfToImagesRouter from './routes/pdfToImages.js';
import { errorHandler } from './middleware/errorHandler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT ?? 3001;

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', phase: 2 });
});

app.use('/api', compressRouter);
app.use('/api', protectRouter);
app.use('/api', unlockRouter);
app.use('/api', pdfToImagesRouter);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
