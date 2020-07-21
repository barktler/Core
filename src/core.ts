/**
 * @author WMXPY
 * @namespace Core
 * @description Core
 */

import { DataProcessor } from "@sudoo/processor";
import Axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { IRequestConfig, IResponseConfig } from "./declare";
import { generateAxiosRequest, parseAxiosResponse } from "./util";

export abstract class BarktlerCore<Request extends any = any, Response extends any = any> {

    private readonly _bodyPreProcessor: DataProcessor<Request>;

    protected constructor() {

        this._bodyPreProcessor = DataProcessor.create<Request>();
    }

    protected async _sendRequest<T extends any = any>(request: IRequestConfig): Promise<T> {

        const response: IResponseConfig<T> = await this._sendRequestRaw(request);
        const data: T = response.data;

        return data;
    }

    protected async _sendRequestRaw<T extends any = any>(request: IRequestConfig): Promise<IResponseConfig<T>> {

        const requestConfig: AxiosRequestConfig = generateAxiosRequest(request);
        const response: AxiosResponse<T> = await Axios(requestConfig);

        return parseAxiosResponse<T>(response);
    }
}
