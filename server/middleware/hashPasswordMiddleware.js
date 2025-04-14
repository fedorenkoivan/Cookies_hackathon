import { hashPassword } from '../utils/hashPassword.js';

export async function hashUserPassword(next) {
  if (!this.isModified('password')) return next();

  this.password = await hashPassword(this.password);
  this.passwordConfirm = undefined;

  next();
}
