import { hashPassword } from "../utils/authUtils.js";

export const hashUserPassword = async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await hashPassword(this.password);
  next();
};
