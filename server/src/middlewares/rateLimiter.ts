import { RateLimiterMemory } from "rate-limiter-flexible";
import { RateLimiterRes } from "rate-limiter-flexible";
import type { Request, Response, NextFunction } from "express";

interface LimiterOptions {
    points: number;
    duration: number;
    blockDuration?: number;
}

export const createMemoryLimiter = ({
    points,
    duration,
    blockDuration,
}: LimiterOptions) =>
    new RateLimiterMemory({
        points,
        duration,
        blockDuration,
    });

export const rateLimit =
    (limiter: any, keyFn?: (req: Request) => string) =>
        async (req: Request, res: Response, next: NextFunction) => {
            try {
                const key = keyFn ? keyFn(req) : req.ip;
                const rateLimiterRes: RateLimiterRes = await limiter.consume(key);

                res.setHeader("X-RateLimit-Limit", limiter.points);
                res.setHeader("X-RateLimit-Remaining", rateLimiterRes.remainingPoints);
                res.setHeader(
                    "Retry-After",
                    Math.ceil(rateLimiterRes.msBeforeNext / 1000)
                );

                next();
            } catch (err: any) {
                if (err instanceof RateLimiterRes) {
                    res.setHeader(
                        "Retry-After",
                        Math.ceil(err.msBeforeNext / 1000)
                    );
                    return res.status(429).json({
                        message: "Too many requests",
                        retryAfterMs: err.msBeforeNext,
                    });
                }
                next(err);
            }
        };
