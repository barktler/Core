/**
 * @author WMXPY
 * @namespace Core
 * @description Core
 */

import { IRequestConfig, IResponseConfig, RequestDriver } from "@barktler/driver";
import { AsyncDataHook } from "@sudoo/processor";
import { RequestOverrideFunction, ResponseOverrideFunction } from "./declare";

export abstract class BarktlerCore<RequestBody extends any = any, ResponseData extends any = any> {

    private readonly _preHook: AsyncDataHook<IRequestConfig<RequestBody>>;
    private readonly _postHook: AsyncDataHook<IResponseConfig<ResponseData>>;

    private _preVerifyFailing: RequestOverrideFunction<RequestBody> | null;
    private _postVerifyFailing: ResponseOverrideFunction<RequestBody, ResponseData> | null;

    private _driver: RequestDriver | null = null;

    protected constructor() {

        this._preHook = AsyncDataHook.create<IRequestConfig<RequestBody>>();
        this._postHook = AsyncDataHook.create<IResponseConfig<ResponseData>>();

        this._preVerifyFailing = null;
        this._postVerifyFailing = null;
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

    public overridePreVerifyFailing(overrideFunction: RequestOverrideFunction<RequestBody>): this {

        this._preVerifyFailing = overrideFunction;
        return this;
    }

    public overridePostVerifyFailing(overrideFunction: ResponseOverrideFunction<RequestBody, ResponseData>): this {

        this._postVerifyFailing = overrideFunction;
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

        const verifyResult: boolean = await this._preHook.verify(request);
        if (!verifyResult) {
            this._executePreVerify(request);
        }

        const preProcessed: IRequestConfig<RequestBody> = await this._preHook.process(request);

        const response: IResponseConfig<ResponseData> = await this._driver<RequestBody, ResponseData>(preProcessed);

        const postVerifyResult: boolean = await this._postHook.verify(response);
        if (!postVerifyResult) {
            this._executePostVerify(preProcessed, response);
        }

        const postProcessedData: IResponseConfig<ResponseData> = await this._postHook.process(response);
        return postProcessedData;
    }

    private _executePreVerify(request: IRequestConfig<RequestBody>) {

        if (typeof this._preVerifyFailing === 'function') {

            const result: void | Error = this._preVerifyFailing(request);
            if (result instanceof Error) {
                throw result;
            }

            return;
        }

        throw new Error('[Barktler] Pre Verify Failed');
    }

    private _executePostVerify(request: IRequestConfig<RequestBody>, response: IResponseConfig<ResponseData>) {

        if (typeof this._postVerifyFailing === 'function') {

            const result: void | Error = this._postVerifyFailing(request, response);
            if (result instanceof Error) {
                throw result;
            }

            return;
        }

        throw new Error('[Barktler] Post Verify Failed');
    }
}
