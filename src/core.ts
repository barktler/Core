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

    private readonly _bodyHook: AsyncDataHook<RequestBody>;
    private readonly _dataHook: AsyncDataHook<ResponseData>;

    protected constructor() {

        this._bodyHook = AsyncDataHook.create<RequestBody>();
        this._dataHook = AsyncDataHook.create<ResponseData>();
    }

    public get bodyHook(): AsyncDataHook<RequestBody> {
        return this._bodyHook;
    }
    public get dataHook(): AsyncDataHook<ResponseData> {
        return this._dataHook;
    }

    protected async _sendRequest(request: IRequestConfig<RequestBody>): Promise<ResponseData> {

        const response: IResponseConfig<ResponseData> = await this._sendRequestRaw(request);
        const data: ResponseData = response.data;

        return data;
    }

    protected async _sendRequestRaw(request: IRequestConfig<RequestBody>): Promise<IResponseConfig<ResponseData>> {

        const preprocessedBody: RequestBody = await this._bodyHook.process(request.body);
        const requestConfig: AxiosRequestConfig = generateAxiosRequest<RequestBody>({
            ...request,
            body: preprocessedBody,
        });

        const rawResponse: AxiosResponse<ResponseData> = await Axios(requestConfig);
        const response = parseAxiosResponse<ResponseData>(rawResponse);

        const postProcessedData: ResponseData = await this._dataHook.process(response.data);
        return {
            ...response,
            data: postProcessedData,
        }
    }
}
