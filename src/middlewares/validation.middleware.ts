import { NextFunction, Request, Response } from "express";
import { ZodType } from "zod";
import { badRequestException } from "../utils/index.js";

type RequestKey = keyof Pick<Request, "body" | "params" | "query" | "headers">;
type SchemaType = Partial<Record<RequestKey, ZodType>>;

type ValidationError = {
    key: RequestKey;
    issues: {
        path: PropertyKey[];
        message: string;
    }[];
};

export const validationMiddleware = (schemas: SchemaType) => {

    return (req: Request, res: Response, next: NextFunction) => {

        const reqKeys: RequestKey[] = [
            "body",
            "params",
            "query",
            "headers"
        ];

        const validationErrors: ValidationError[] = [];

        for (const key of reqKeys) {

            const schema = schemas[key];

            if (!schema) continue;

            const result = schema.safeParse(req[key]);

            if (!result.success) {

                validationErrors.push({
                    key,
                    issues: result.error.issues.map(issue => ({
                        path: issue.path,
                        message: issue.message
                    }))
                });

                continue;
            }

            (req as any)[key] = result.data;

        }

        if (validationErrors.length) {
            throw new badRequestException(
                "Validation failed",
                {
                    validationErrors
                }
            );
        }

        next();

    };

};