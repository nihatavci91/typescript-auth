import { Request, Response } from "express";
import { AuthService } from "../services/AuthService.js";
import { AuthenticatedRequest } from "../types/AuthenticatedRequest.js";

export class AuthController {
    constructor(private authService: AuthService) {}

    register = async (req: Request, res: Response) => {
        try {
            const result = await this.authService.register(req.body);

            return res.status(201).json({
                message: "Kayıt başarılı.",
                data: result
            });
        } catch (error) {
            return res.status(400).json({
                message: error instanceof Error ? error.message : "Bir hata oluştu."
            });
        }
    };

    login = async (req: Request, res: Response) => {
        try {
            const result = await this.authService.login(req.body);

            return res.status(200).json({
                message: "Giriş başarılı.",
                data: result
            });
        } catch (error) {
            return res.status(401).json({
                message: error instanceof Error ? error.message : "Bir hata oluştu."
            });
        }
    };

    profile = async (req: AuthenticatedRequest, res: Response) => {
        try {
            if (!req.user) {
                return res.status(401).json({
                    message: "Yetkisiz işlem."
                });
            }

            const result = await this.authService.getProfile(req.user.id);

            return res.status(200).json({
                message: "Profil bilgisi.",
                data: result
            });
        } catch (error) {
            return res.status(404).json({
                message: error instanceof Error ? error.message : "Bir hata oluştu."
            });
        }
    };

    updateProfile = async (req: AuthenticatedRequest, res: Response) => {
        try {
            if (!req.user) {
                return res.status(401).json({
                    message: "Yetkisiz işlem."
                });
            }

            const result = await this.authService.updateProfile(req.user.id, req.body);

            return res.status(200).json({
                message: "Profil bilgileri güncellendi.",
                data: result
            });
        } catch (error) {
            return res.status(400).json({
                message: error instanceof Error ? error.message : "Bir hata oluştu."
            });
        }
    };
}
