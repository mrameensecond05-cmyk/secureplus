import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/api/', (req, res) => {
    res.json({
        status: 'API Gateway is running',
        services: {
            auth: process.env.AUTH_SERVICE_URL,
            soc: process.env.SOC_SERVICE_URL,
            inventory: process.env.INVENTORY_SERVICE_URL,
            reports: process.env.REPORTS_SERVICE_URL
        },
        timestamp: new Date().toISOString()
    });
});

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
});

// Placeholder for proxy setup
// app.use('/auth', createProxyMiddleware({ target: process.env.AUTH_SERVICE_URL, changeOrigin: true }));

app.listen(PORT, () => {
    console.log(`API Gateway running on port ${PORT}`);
});
