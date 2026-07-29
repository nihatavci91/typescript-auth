import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { AuthenticatedRequest } from "../types/AuthenticatedRequest.js";
import {
    authorizationHeaderSchema,
    tokenPayloadSchema
} from "../validations/tokenValidation.js";

export function authMiddleware(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
) {
    const headerResult = authorizationHeaderSchema.safeParse(
        req.headers.authorization
    );

    if (!headerResult.success) {
        return res.status(401).json({
            message: "Kimlik doğrulama bilgisi geçersiz.",
            errors: headerResult.error.issues.map((issue) => ({
                field: "authorization",
                message: issue.message
            }))
        });
    }

    const token = headerResult.data.replace(/^Bearer\s+/, "");

    try {
        const decoded = jwt.verify(token, env.jwtSecret);
        const payloadResult = tokenPayloadSchema.safeParse(decoded);

        if (!payloadResult.success) {
            return res.status(401).json({
                message: "Token içeriği geçersiz.",
                errors: payloadResult.error.issues.map((issue) => ({
                    field: issue.path.join(".") || "token",
                    message: issue.message
                }))
            });
        }

        req.user = {
            id: payloadResult.data.id,
            email: payloadResult.data.email
        };

        return next();
    } catch {
        return res.status(401).json({
            message: "Geçersiz token."
        });
    }
}
