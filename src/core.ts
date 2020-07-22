/**
 * @author WMXPY
 * @namespace Core
 * @description Core
 */

import { AsyncDataHook } from "@sudoo/processor";
import Axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { IRequestConfig, IResponseConfig } from "./declare";
import { generateAxiosRequest, parseAxiosResponse } from "./util";

export abstract class BarktlerCore<RequestBody extends any = any, ResponseData extends any = any> {

    private readonly _bodyPreHook: AsyncDataHook<RequestBody>;
    private readonly _dataPostHook: AsyncDataHook<ResponseData>;

    protected constructor() {

        this._bodyPreHook = AsyncDataHook.create<RequestBody>();
        this._dataPostHook = AsyncDataHook.create<ResponseData>();
    }

    public get bodyPreProcessor(): AsyncDataHook<RequestBody> {
        return this._bodyPreHook;
    }
    public get dataPostProcessor(): AsyncDataHook<ResponseData> {
        return this._dataPostHook;
    }

    protected async _sendRequest(request: IRequestConfig<RequestBody>): Promise<ResponseData> {

        const response: IResponseConfig<ResponseData> = await this._sendRequestRaw(request);
        const data: ResponseData = response.data;

        return data;
    }

    protected async _sendRequestRaw(request: IRequestConfig<RequestBody>): Promise<IResponseConfig<ResponseData>> {

        const preprocessedBody: RequestBody = await this._bodyPreHook.process(request.body as RequestBody);
        const requestConfig: AxiosRequestConfig = generateAxiosRequest({
            ...request,
            body: preprocessedBody,
        });

        const rawResponse: AxiosResponse<ResponseData> = await Axios(requestConfig);
        const response = parseAxiosResponse<ResponseData>(rawResponse);

        const postProcessedData: ResponseData = await this._dataPostHook.process(response.data);
        return {
            ...response,
            data: postProcessedData,
        }
    }
}
