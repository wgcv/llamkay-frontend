import { User } from './user.interface';

export interface Auth {
    refreshToken: string;
    token: string;
    success: boolean;
    provider: string;
    user: User
}