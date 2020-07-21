/**
 * @author WMXPY
 * @namespace Core
 * @description Core
 */

import { DataProcessor } from "@sudoo/processor";
import Axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { IRequestConfig, IResponseConfig } from "./declare";
import { generateAxiosRequest, parseAxiosResponse } from "./util";

export abstract class BarktlerCore<RequestBody extends any = any, ResponseData extends any = any> {

    private readonly _bodyPreProcessor: DataProcessor<RequestBody>;
    private readonly _dataPostProcessor: DataProcessor<ResponseData>;

    protected constructor() {

        this._bodyPreProcessor = DataProcessor.create<RequestBody>();
        this._dataPostProcessor = DataProcessor.create<ResponseData>();
    }

    public get bodyPreProcessor(): DataProcessor<RequestBody> {
        return this._bodyPreProcessor;
    }
    public get dataPostProcessor(): DataProcessor<ResponseData> {
        return this._dataPostProcessor;
    }

    protected async _sendRequest(request: IRequestConfig<RequestBody>): Promise<ResponseData> {

        const response: IResponseConfig<ResponseData> = await this._sendRequestRaw(request);
        const data: ResponseData = response.data;

        return data;
    }

    protected async _sendRequestRaw(request: IRequestConfig<RequestBody>): Promise<IResponseConfig<ResponseData>> {

        const requestConfig: AxiosRequestConfig = generateAxiosRequest({
            ...request,
            body: this._bodyPreProcessor.process(request.body as RequestBody),
        });
        const rawResponse: AxiosResponse<ResponseData> = await Axios(requestConfig);
        const response = parseAxiosResponse<ResponseData>(rawResponse);

        return {
            ...response,
            data: this._dataPostProcessor.process(response.data),
        }
    }
}
