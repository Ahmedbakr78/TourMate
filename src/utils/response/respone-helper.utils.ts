import { IFailuresResponse, ISuccessResponse } from "../../common/index.js";

export function successResponse<T = unknown>(
    message = 'Your Request is processed successfully',
    status = 200,
    data?: T
): ISuccessResponse<T> {
    return {
        meta: {
            status,
            success: true
        },
        message,
        data
    };
}
export function failedResponse<T>(
    message = 'Your Request is Failed',
    status = 500,
    error?: unknown
): IFailuresResponse {
    return {
        meta: {
            status,
            success: false
        },
        error: {
            message,
            context: error
        }
    }
}