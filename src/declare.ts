/**
 * @author WMXPY
 * @namespace Core
 * @description Declare
 */

import { Method } from "axios";

export interface IRequestConfig<T extends any = any> {

    readonly url: string;
    readonly method: Method;
    readonly baseURL?: string;
    readonly headers?: Record<string, string>;

    readonly body?: T;
}
