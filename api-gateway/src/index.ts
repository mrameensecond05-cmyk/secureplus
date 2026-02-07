import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { createProxyMiddleware } from 'http-proxy-middleware';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan('combined'));
app.use(express.json());

// Service URLs (from env)
const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL || 'http://auth-service:8001';
const INVENTORY_SERVICE_URL = process.env.INVENTORY_SERVICE_URL || 'http://inventory-service:8002';
const SOC_SERVICE_URL = process.env.SOC_SERVICE_URL || 'http://soc-service:8003';
const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://ai-service:8004';
const REPORTS_SERVICE_URL = process.env.REPORTS_SERVICE_URL || 'http://reports-service:8005';

// Health Check
app.get('/health', (req: Request, res: Response) => {
    res.json({ status: 'active', timestamp: new Date() });
});

// Proxy Routes
// Auth Service
app.use('/api/auth', createProxyMiddleware({
    target: AUTH_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: {
        '^/api/auth': '/api/auth'
    }
}));

// Inventory Service
app.use('/api/inventory', createProxyMiddleware({
    target: INVENTORY_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: {
        '^/api/inventory': '/api/inventory'
    }
}));

// SOC Service
app.use('/api/soc', createProxyMiddleware({
    target: SOC_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: {
        '^/api/soc': '/api/soc'
    }
}));

// AI Service
app.use('/api/ai', createProxyMiddleware({
    target: AI_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: {
        '^/api/ai': '/api/ai'
    }
}));

// Reports Service
app.use('/api/reports', createProxyMiddleware({
    target: REPORTS_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: {
        '^/api/reports': '/api/reports'
    }
}));

// Global Error Handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ status: 'error', message: 'Internal Server Error' });
});

app.listen(PORT, () => {
    console.log(`API Gateway running on port ${PORT}`);
});
