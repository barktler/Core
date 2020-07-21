/**
 * @author WMXPY
 * @namespace Core
 * @description Core
 */

import { DataProcessor } from "@sudoo/processor";
import Axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { IRequestConfig } from "./declare";

export abstract class BarktlerCore<Request extends any = any, Response extends any = any> {

    private readonly _bodyPreProcessor: DataProcessor<Request>;

    protected constructor() {

        this._bodyPreProcessor = DataProcessor.create<Request>();
    }

    protected async _sendRequest<T extends any = any>(request: IRequestConfig): Promise<T> {

        const response: AxiosResponse<T> = await Axios({
            url: request.url,
            method: request.method,
            baseURL: request.baseURL,
            headers: request.headers,

            data: request.body,
        });
        const data: T = response.data;

        return data;
    }

    protected async _sendRequestRaw<T extends any = any>(request: AxiosRequestConfig): Promise<AxiosResponse<T>> {

        const response: AxiosResponse<T> = await Axios(request);

        return response;
    }
}
