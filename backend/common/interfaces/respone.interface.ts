
export interface IMetaResponse {
    status: number,
    success: boolean
}
export interface IDataResponse {
    message: string,
    data?: unknown
}
export interface IErrorResponse {
    message: string,
    context?: unknown
}

export interface ISuccessResponse<T = unknown> {
    meta: IMetaResponse;
    message: string;
    data?: T;
}
export interface IFailuresResponse {
    meta: IMetaResponse,
    error?: IErrorResponse
}