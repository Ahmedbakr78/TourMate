// Mirrors src/utils/response/respone-helper.utils.ts on the backend

export interface IMetaResponse {
  status: number;
  success: boolean;
}

export interface IErrorResponse {
  message: string;
  context?: unknown;
}

export interface ISuccessResponse<T = unknown> {
  meta: IMetaResponse;
  message: string;
  data?: T;
}

export interface IFailuresResponse {
  meta: IMetaResponse;
  error?: IErrorResponse;
}

// Shape returned by mongoose-paginate-v2 (used on users/drivers/guides/places/trips/reviews/notifications lists)
export interface IPaginateResult<T> {
  docs: T[];
  totalDocs: number;
  limit: number;
  page: number;
  totalPages: number;
  pagingCounter: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  prevPage: number | null;
  nextPage: number | null;
}
