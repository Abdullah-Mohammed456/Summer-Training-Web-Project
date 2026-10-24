import type { FirebaseIdentity } from '../auth/firebase-token.ts';

declare global {
  namespace Express {
    interface Request {
      identity?: FirebaseIdentity;
    }
  }
}

export {};
