// Fixed version of resetPassword function
export const resetPassword = async (request, reply) => {
  try {
    const { resetToken } = request.params;
    const { password, passwordConfirm } = request.body;

    const users = await User.find({
      passwordResetExpires: { $gt: Date.now() },
    });

    let user = null;

    for (const potentialUser of users) {
      try {
        const isValidToken = await argon2.verify(
          potentialUser.passwordResetToken,
          resetToken,
        );

        if (isValidToken) {
          user = potentialUser;
          break;
        }
      } catch (err) {
        continue; // skip to the next user if verification fails
      }
    }

    if (!user) {
      return reply.code(400).send({
        status: "error",
        message: "Token is invalid or has expired",
      });
    }
    
    user.password = password;
    user.passwordConfirm = passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;    
    await user.save();

    // Use proper MongoDB ObjectId without toString()
    const userId = user._id;
    
    // Create tokens with userId
    const accessToken = createAccessToken(userId);
    const refreshToken = createRefreshToken(userId);

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    reply.setCookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: "/",
      sameSite: "lax"
    });

    reply.code(200).send({
      status: "success",
      accessToken,
    });
  } catch (err) {
    reply.code(400).send({ status: "error", message: err.message });
  }
};
