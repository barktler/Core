/**
 * @author WMXPY
 * @namespace Core
 * @description Core
 */

import { IRequestConfig, IResponseConfig, RequestDriver } from "@barktler/driver";
import { AsyncDataHook } from "@sudoo/processor";

export abstract class BarktlerCore<RequestBody extends any = any, ResponseData extends any = any> {

    private readonly _preHook: AsyncDataHook<IRequestConfig<RequestBody>>;
    private readonly _postHook: AsyncDataHook<IResponseConfig<ResponseData>>;

    private _driver: RequestDriver | null = null;

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

        if (!this._driver) {
            throw new Error('[Barktler] Driver not found');
        }

        const preProcessed: IRequestConfig<RequestBody> = await this._preHook.process(request);

        const response: IResponseConfig<ResponseData> = await this._driver<RequestBody, ResponseData>(preProcessed);

        const postProcessedData: IResponseConfig<ResponseData> = await this._postHook.process(response);
        return postProcessedData;
    }
}
