/**
 * @author WMXPY
 * @namespace Core
 * @description Declare
 */

import { Method } from "axios";

export interface IRequestConfig<Body extends any = any> {

    readonly url: string;
    readonly method: Method;
    readonly baseURL?: string;
    readonly headers?: Record<string, string>;

    readonly body?: Body;
}

export interface IResponseConfig<Data extends any = any> {

    readonly data: Data;
    readonly status: number;
    readonly statusText: string;
    readonly headers: Record<string, string>;
}
