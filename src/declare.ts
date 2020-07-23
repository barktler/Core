/**
 * @author WMXPY
 * @namespace Core
 * @description Declare
 */

import { ResponseType } from "axios";

export type Method =
    | "GET"
    | "DELETE"
    | "HEAD"
    | "OPTIONS"
    | "POST"
    | "PUT"
    | "PATCH"
    | "LINK"
    | "UNLINK";

export interface IRequestConfig<Body extends any = any> {

    readonly url: string;
    readonly method: Method;

    readonly headers?: Record<string, string>;
    readonly params?: Record<string, string>;
    readonly body?: Body;

    readonly timeout?: number;

    readonly responseType?: ResponseType;
}

export interface IResponseConfig<Data extends any = any> {

    readonly data: Data;
    readonly status: number;
    readonly statusText: string;

    readonly headers: Record<string, string>;
}

export type RequestDriver = <Body extends any = any, Data extends any = any>(request: IRequestConfig<Body>) => Promise<IResponseConfig<Data>>;
