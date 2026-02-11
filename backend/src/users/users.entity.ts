export class User {
  id: number;
  email: string;
  name: string;
  password?: string;
  googleId?: string;
  avatar?: string;
  verified: boolean;
  createdAt: Date;
  updatedAt: Date;
}