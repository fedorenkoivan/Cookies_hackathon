import User from "../models/userModel.js";

export const validateLoginInput = (credentials) => {
  const { email, password } = credentials;

  if (!email || !password) {
    return {
      isInputValid: false,
      inputErrorMsg: "Please provide email and password!",
      inputCode: 400,
    };
  }
  return {
    isInputValid: true,
    credErrorMsg: null,
    inputCode: 200,
  };
};

export const validateCredentails = async (credentials) => {
  const { email, password } = credentials;

  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return {
      isCredValid: false,
      credErrorMsg: "Incorrect email or password",
      credCode: 401,
    };
  }

  const isValidPassword = await user.correctPassword(password, user.password);
  if (!isValidPassword) {
    return {
      isCredValid: false,
      credErrorMsg: "Incorrect email or password",
      credCode: 401,
    };
  }

  return {
    isCredValid: true,
    user,
    credErrorMsg: null,
    credCode: 200,
  };
};
