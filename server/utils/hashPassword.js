import argon2 from 'argon2'

export const hashPassword = async (password) => {
    const hashedPassword = await argon2.hash(password, {
        type: argon2.argon2id,
        memoryCost: 65536,
        timeCost: 3,
        parallelism: 1,
        hashLength: 32
    });
    return hashedPassword;
};
