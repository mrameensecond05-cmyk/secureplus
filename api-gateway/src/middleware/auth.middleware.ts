import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Extend Express Request interface to include user
declare global {
    namespace Express {
        interface Request {
            user?: any;
        }
    }
}

export const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(' ')[1]; // Bearer <token>

        if (!process.env.JWT_SECRET) {
            console.error("JWT_SECRET is not defined set in environment variables");
            return res.sendStatus(500);
        }

        jwt.verify(token, process.env.JWT_SECRET, (err: any, user: any) => {
            if (err) {
                return res.sendStatus(403); // Forbidden (invalid token)
            }

            req.user = user;
            next();
        });
    } else {
        res.sendStatus(401); // Unauthorized (no token)
    }
};
