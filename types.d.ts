import 'express-session';

declare module 'express-session' {
  interface SessionData {
    user?: { // Adjust based on your user object's structure
      id: string;
      username: string;
      [key: string]: any;  // Any additional properties you might be using
    };
  }
}