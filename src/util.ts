/**
 * @author WMXPY
 * @namespace Core
 * @description Util
 */

import { AxiosRequestConfig, AxiosResponse } from "axios";
import { IRequestConfig, IResponseConfig } from "./declare";

export const generateAxiosRequest = <Body>(request: IRequestConfig<Body>): AxiosRequestConfig => {

    return {

        url: request.url,
        method: request.method,
        baseURL: request.baseURL,
        headers: request.headers,

        data: request.body,
    };
};

export const parseAxiosResponse = <Data>(response: AxiosResponse<Data>): IResponseConfig<Data> => {

    return {

        data: response.data,
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
    };
};

