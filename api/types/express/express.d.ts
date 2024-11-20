import { User } from '../../database/models/user.model.ts'; 

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}
