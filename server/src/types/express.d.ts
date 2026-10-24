import type { AuthIdentity } from '../auth/session.ts';

declare global {
  namespace Express {
    interface Request {
      identity?: AuthIdentity;
    }
  }
}

export {};
