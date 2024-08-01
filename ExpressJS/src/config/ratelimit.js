import rateLimit from "express-rate-limit";

export const ratelimit = (duration, maxRequests) => {
    return rateLimit({
        windowMs: duration,
        max: maxRequests,
        standardHeaders: true,
        legacyHeaders: false,
        message: {
            status: 429,
            message: "Too many requests, please try again later."
        }
    });
}