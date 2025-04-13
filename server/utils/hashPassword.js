import bcrypt from 'bcrypt';

export const hashPassword = async (password) => {
    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS) || 12;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = bcrypt.hash(password, salt);
    return hashedPassword;
};
