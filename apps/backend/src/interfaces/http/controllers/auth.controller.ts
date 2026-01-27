import { Request, Response } from 'express';
import { RegisterUserUseCase } from '@/application/use-cases/register-user.use-case';
import { LoginUserUseCase } from '@/application/use-cases/login-user.use-case';
import { RegisterUserSchema, LoginUserSchema } from '@/domain/dtos/auth.dto';
import { UserAlreadyExistsError, InvalidCredentialsError } from '@/domain/errors/custom.errors';

export class AuthController {
  constructor(
    private registerUserUseCase: RegisterUserUseCase,
    private loginUserUseCase: LoginUserUseCase,
  ) {}

  async register(req: Request, res: Response) {
    try {
      // Validate Input
      const dto = RegisterUserSchema.parse(req.body);

      // Execute Use Case
      const user = await this.registerUserUseCase.execute(dto);

      // Return Response
      return res.status(201).json({
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
      });
    } catch (error: any) {
      if (error.name === 'ZodError') {
        return res.status(400).json({ error: error.errors });
      }
      if (error instanceof UserAlreadyExistsError) {
        return res.status(400).json({ error: error.message }); // Or 409 Conflict
      }
      console.error(error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const dto = LoginUserSchema.parse(req.body);
      const result = await this.loginUserUseCase.execute(dto);

      return res.status(200).json(result);
    } catch (error: any) {
      if (error.name === 'ZodError') {
        return res.status(400).json({ error: error.errors });
      }
      if (error instanceof InvalidCredentialsError) {
        return res.status(401).json({ error: error.message });
      }
      console.error(error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}
