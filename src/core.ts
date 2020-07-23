/**
 * @author WMXPY
 * @namespace Core
 * @description Core
 */

import { AsyncDataHook } from "@sudoo/processor";
import { IRequestConfig, IResponseConfig, RequestDriver } from "./declare";
import { axiosDriver } from "./driver/axios";

export abstract class BarktlerCore<RequestBody extends any = any, ResponseData extends any = any> {

    private readonly _preHook: AsyncDataHook<IRequestConfig<RequestBody>>;
    private readonly _postHook: AsyncDataHook<IResponseConfig<ResponseData>>;

    private _driver: RequestDriver;

    protected constructor() {

        this._preHook = AsyncDataHook.create<IRequestConfig<RequestBody>>();
        this._postHook = AsyncDataHook.create<IResponseConfig<ResponseData>>();

        this._driver = axiosDriver;
    }

    public get preHook(): AsyncDataHook<IRequestConfig<RequestBody>> {
        return this._preHook;
    }
    public get postHook(): AsyncDataHook<IResponseConfig<ResponseData>> {
        return this._postHook;
    }

    public useDefaultDriver(): this {

        this._driver = axiosDriver;
        return this;
    }

    public useDriver(driver: RequestDriver): this {

        this._driver = driver;
        return this;
    }

    protected async _sendRequest(request: IRequestConfig<RequestBody>): Promise<ResponseData> {

        const response: IResponseConfig<ResponseData> = await this._sendRequestRaw(request);
        const data: ResponseData = response.data;

        return data;
    }

    protected async _sendRequestRaw(request: IRequestConfig<RequestBody>): Promise<IResponseConfig<ResponseData>> {

        const preProcessed: IRequestConfig<RequestBody> = await this._preHook.process(request);

        const response: IResponseConfig<ResponseData> = await this._driver<RequestBody, ResponseData>(preProcessed);

        const postProcessedData: IResponseConfig<ResponseData> = await this._postHook.process(response);
        return postProcessedData;
    }
}
