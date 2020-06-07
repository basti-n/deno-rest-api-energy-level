export interface Response<T> {
    result?: T,
    success: boolean;
    invalidProperties?: string;
    message?: string;
}