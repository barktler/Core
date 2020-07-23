/**
 * @author WMXPY
 * @namespace Core_Driver
 * @description Axios
 */

import { AxiosRequestConfig, AxiosResponse } from "axios";
import { IRequestConfig, IResponseConfig } from "../declare";

export const generateAxiosRequest = <Body>(request: IRequestConfig<Body>): AxiosRequestConfig => {

    return {

        url: request.url,
        method: request.method,
        baseURL: request.baseURL,

        headers: request.headers,
        params: request.params,
        data: request.body,

        timeout: request.timeout,

        responseType: request.responseType,
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
