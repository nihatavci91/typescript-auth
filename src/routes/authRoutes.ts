import { Router } from "express";
import { AuthController } from "../controllers/AuthController.js";
import { AuthService } from "../services/AuthService.js";
import { UserRepository } from "../repositories/UserRepository.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { validateRequest } from "../middlewares/validateRequest.js";
import { loginSchema, registerSchema } from "../validations/authValidation.js";
import { updateProfileSchema } from "../validations/profileValidation.js";

const router = Router();

const userRepository = new UserRepository();
const authService = new AuthService(userRepository);
const authController = new AuthController(authService);

router.post("/register", validateRequest(registerSchema), authController.register);
router.post("/login", validateRequest(loginSchema), authController.login);
router.get("/profile", authMiddleware, authController.profile);
router.put(
    "/profile",
    authMiddleware,
    validateRequest(updateProfileSchema),
    authController.updateProfile
);

export default router;
