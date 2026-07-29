import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { AuthenticatedRequest } from "../types/AuthenticatedRequest.js";

export function authMiddleware(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({
            message: "Token bulunamadı."
        });
    }

    const token = authHeader.replace("Bearer ", "");

    try {
        const decoded = jwt.verify(token, env.jwtSecret) as {
            id: number;
            email: string;
        };

        req.user = decoded;

        return next();
    } catch {
        return res.status(401).json({
            message: "Geçersiz token."
        });
    }
}