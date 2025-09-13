export {};

if (typeof window !== 'undefined') {
  throw new Error('This module can only be imported in server components');
}
