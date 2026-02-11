import { User } from '../users/user.entity'; // ajuste depois se necessário

declare global {
  namespace Express {
    interface Request {
      user?: any; // depois você pode tipar melhor
    }
  }
}
