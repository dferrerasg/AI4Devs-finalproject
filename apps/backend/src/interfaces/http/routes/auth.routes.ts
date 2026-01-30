import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { PrismaUserRepository } from '@/infrastructure/database/repositories/prisma-user.repository';
import { RegisterUserUseCase } from '@/application/use-cases/register-user.use-case';
import { LoginUserUseCase } from '@/application/use-cases/login-user.use-case';

const router = Router();

// Composition Root (Wiring dependencies)
const userRepository = new PrismaUserRepository();
const registerUserUseCase = new RegisterUserUseCase(userRepository);
const loginUserUseCase = new LoginUserUseCase(userRepository);
const authController = new AuthController(registerUserUseCase, loginUserUseCase);

router.post('/register', (req, res) => authController.register(req, res));
router.post('/login', (req, res) => authController.login(req, res));

export default router;
