/**
 * @author WMXPY
 * @namespace Core
 * @description Core
 */

import Axios, { AxiosRequestConfig, AxiosResponse } from "axios";

export abstract class BarktlerCore {

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    protected constructor() {
    }

    protected async _sendRequest<T extends any = any>(request: AxiosRequestConfig): Promise<T> {

        const response: AxiosResponse<T> = await Axios(request);
        const data: T = response.data;

        return data;
    }

    protected async _sendRequestRaw<T extends any = any>(request: AxiosRequestConfig): Promise<AxiosResponse<T>> {

        const response: AxiosResponse<T> = await Axios(request);

        return response;
    }
}
