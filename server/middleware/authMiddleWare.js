import { verifyJwtToken } from "../utils/handleTokens.js";

export const verifyToken = async (request, reply) => {
  try {
    const authHeader = request.headers.authorization;
    const accessToken =
      authHeader && authHeader.startsWith("Bearer ")
        ? authHeader.split(" ")[1]
        : null;

    if (!accessToken) {
      return reply.code(401).send({
        status: "error",
        message: "You are not logged in. Please log in to get access.",
      });
    }

    const decoded = verifyJwtToken(request.server, accessToken, "access_token");
    request.user = { id: decoded.id };

    return;
  } catch (err) {
    console.error(err);
    return reply.code(401).send({
      status: "error",
      message: "Invalid token or token expired",
    });
  }
};
