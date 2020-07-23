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

    private readonly _preHook: AsyncDataHook<IRequestConfig<RequestBody>>;
    private readonly _postHook: AsyncDataHook<IResponseConfig<ResponseData>>;

    protected constructor() {

        this._preHook = AsyncDataHook.create<IRequestConfig<RequestBody>>();
        this._postHook = AsyncDataHook.create<IResponseConfig<ResponseData>>();
    }

    public get preHook(): AsyncDataHook<IRequestConfig<RequestBody>> {
        return this._preHook;
    }
    public get postHook(): AsyncDataHook<IResponseConfig<ResponseData>> {
        return this._postHook;
    }

    protected async _sendRequest(request: IRequestConfig<RequestBody>): Promise<ResponseData> {

        const response: IResponseConfig<ResponseData> = await this._sendRequestRaw(request);
        const data: ResponseData = response.data;

        return data;
    }

    protected async _sendRequestRaw(request: IRequestConfig<RequestBody>): Promise<IResponseConfig<ResponseData>> {

        const preProcessed: IRequestConfig<RequestBody> = await this._preHook.process(request);
        const requestConfig: AxiosRequestConfig = generateAxiosRequest<RequestBody>(preProcessed);

        const rawResponse: AxiosResponse<ResponseData> = await Axios(requestConfig);
        const response = parseAxiosResponse<ResponseData>(rawResponse);

        const postProcessedData: IResponseConfig<ResponseData> = await this._postHook.process(response);
        return postProcessedData;
    }
}
