import jwt from "jsonwebtoken";
//auth middleware to protect routes (admin must be logged in)
export const auth = (req, res, next) => {
    // check if USE_JWT is set to "false" in environment variables7
    // if USE_JWT is set to "false", authentication is disabled
    const useAuthHeader = process.env.USE_JWT !== "false";
    // If authentication is disabled, proceed to the next middleware/route
    if (!useAuthHeader)
        return next();
    // Gets the Authorization header from the HTTP request (typically "Bearer <token>")
    const tokenHeader = req.headers["authorization"];
    // If there is no authorization header, return an error (401: Unauthorized)
    if (!tokenHeader) {
        return res
            .status(401)
            .json({ status: "error", message: "No access without token." });
    }
    // Splits the header and takes the token part (after "Bearer ")
    const token = tokenHeader.split(" ")[1];
    // If the token is missing in the header (incorrect format), return an error
    if (!token) {
        return res
            .status(401)
            .json({ status: "error", message: "Token format invalid." });
    }
    // Ensures that the secret JWT key is set in environment variables (necessary for validating the token)
    if (!process.env.JWT_SECRET) {
        console.error("Missing JWT_SECRET in env");
        return res
            .status(500)
            .json({ status: "error", message: "Server configuration error" });
    }
    try {
        // validates the token with jwt.verify and the secret key
        // If it is valid, the token is decoded
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // Check if the decoded user has the admin role
        if (!decoded || decoded.role !== "admin") {
            return res.status(403).json({
                status: "error",
                message: "Access denied - admin role required.",
            });
        }
        // Stores the decoded user information on the req object, so it is available in the rest of the request
        req.user = decoded;
        // Proceed to the next middleware or route handler
        return next();
    }
    catch (err) {
        // The token could not be validated – it is likely expired or invalid
        console.error("Invalid token:", err);
        return res.status(401).json({
            status: "error",
            message: "Invalid token - please sign in again.",
        });
    }
};
