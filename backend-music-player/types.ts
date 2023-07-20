export interface IToken {
    _id: string,
    fullname: string,
    email: string
}

export interface BodyWithToken {
    token_data: IToken;
}

export interface IResponse<T = unknown> {
    success: boolean,
    data: T
}

export class ErrorResponse extends Error {
    status?: number

    constructor(messsage: string, statusCode: number) {
        super(messsage);
        this.status = statusCode;
    }
}