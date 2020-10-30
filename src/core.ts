/**
 * @author WMXPY
 * @namespace Core
 * @description Core
 */

import { IInjectConfig, IRequestConfig, IResponseConfig, PendingRequest, RequestDriver } from "@barktler/driver";
import { Pattern } from "@sudoo/pattern";
import { AsyncDataHook } from "@sudoo/processor";
import { RequestVerifyOverrideFunction, ResponseVerifyOverrideFunction } from "./declare";

export type BarktlerMixin = (instance: Barktler) => void;

export abstract class Barktler<RequestBody extends any = any, ResponseData extends any = any> {

    protected static _globalDefaultDriver: RequestDriver | null = null;

    public static hasGlobalDefaultDriver(): boolean {
        return typeof this._globalDefaultDriver === 'function';
    }

    public static useGlobalDefaultDriver(driver: RequestDriver): void {
        this._globalDefaultDriver = driver;
        return;
    }

    public static removeGlobalDefaultDriver(): void {
        this._globalDefaultDriver = null;
        return;
    }

    protected readonly defaultDriver: RequestDriver | null = null;

    private readonly _preHook: AsyncDataHook<IRequestConfig<RequestBody>>;
    private readonly _postHook: AsyncDataHook<IResponseConfig<ResponseData>>;

    private _requestBodyPattern?: Pattern;
    private _responseDataPattern?: Pattern;

    private _preVerifyFailing: RequestVerifyOverrideFunction<RequestBody> | null;
    private _postVerifyFailing: ResponseVerifyOverrideFunction<RequestBody, ResponseData> | null;

    private _driver: RequestDriver | null;

    protected constructor(
        preHook: AsyncDataHook<IRequestConfig<RequestBody>> = AsyncDataHook.create<IRequestConfig<RequestBody>>(),
        postHook: AsyncDataHook<IResponseConfig<ResponseData>> = AsyncDataHook.create<IResponseConfig<ResponseData>>(),
    ) {

        this._preHook = preHook;
        this._postHook = postHook;

        this._preVerifyFailing = null;
        this._postVerifyFailing = null;

        this._driver = null;
    }

    public get preHook(): AsyncDataHook<IRequestConfig<RequestBody>> {
        return this._preHook;
    }
    public get postHook(): AsyncDataHook<IResponseConfig<ResponseData>> {
        return this._postHook;
    }

    public hasDriver(): boolean {

        if (typeof this._getDriver() === 'function') {
            return true;
        }
        return false;
    }

    public useDriver(driver: RequestDriver): this {

        this._driver = driver;
        return this;
    }

    public overridePreVerifyFailing(overrideFunction: RequestVerifyOverrideFunction<RequestBody>): this {

        this._preVerifyFailing = overrideFunction;
        return this;
    }

    public overridePostVerifyFailing(overrideFunction: ResponseVerifyOverrideFunction<RequestBody, ResponseData>): this {

        this._postVerifyFailing = overrideFunction;
        return this;
    }

    protected _declareRequestBodyPattern(pattern: Pattern): this {

        this._requestBodyPattern = pattern;
        return this;
    }

    protected _declareResponseDataPattern(pattern: Pattern): this {

        this._responseDataPattern = pattern;
        return this;
    }

    protected async _requestForData(request: IRequestConfig<RequestBody>): Promise<ResponseData> {

        const response: IResponseConfig<ResponseData> = await this._requestForResponseConfig(request);
        const data: ResponseData = response.data;

        return data;
    }

    protected async _requestForResponseConfig(request: IRequestConfig<RequestBody>): Promise<IResponseConfig<ResponseData>> {

        const pendingRequest: PendingRequest<RequestBody, ResponseData> = await this._requestForPendingRequest(request);

        const response: IResponseConfig<ResponseData> = await pendingRequest.response;
        const injectedResponse: IResponseConfig<ResponseData> = this._inject(response);

        const postVerifyResult: boolean = await this._postHook.verify(injectedResponse);
        if (!postVerifyResult) {
            this._executePostVerify(request, injectedResponse);
        }

        const postProcessedData: IResponseConfig<ResponseData> = await this._postHook.process(injectedResponse);
        await this._postHook.execute(postProcessedData);

        return postProcessedData;
    }

    protected async _requestForPendingRequest(request: IRequestConfig<RequestBody>): Promise<PendingRequest<RequestBody, ResponseData>> {

        const driver: RequestDriver | null = this._getDriver();
        if (!driver) {
            throw new Error('[Barktler] Driver not found');
        }

        const injectedRequest: IRequestConfig<RequestBody> = this._inject(request);
        const preVerifyResult: boolean = await this._preHook.verify(injectedRequest);
        if (!preVerifyResult) {
            this._executePreVerify(injectedRequest);
        }

        const preProcessed: IRequestConfig<RequestBody> = await this._preHook.process(injectedRequest);
        await this._preHook.execute(preProcessed);

        const pendingRequest: PendingRequest<RequestBody, ResponseData> = driver<RequestBody, ResponseData>(preProcessed);

        return pendingRequest;
    }

    private _inject<T extends IInjectConfig>(request: T): T {

        return {
            ...request,
            requestBodyPattern: request.requestBodyPattern ?? this._requestBodyPattern,
            responseDataPattern: request.responseDataPattern ?? this._responseDataPattern,
        };
    }

    private _getDriver(): RequestDriver | null {

        if (this._driver) {
            return this._driver;
        }

        if (this.defaultDriver) {
            return this.defaultDriver;
        }

        if (Barktler._globalDefaultDriver) {
            return Barktler._globalDefaultDriver;
        }

        return null;
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
