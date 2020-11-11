/**
 * @author WMXPY
 * @namespace Core
 * @description Core
 */

import { IInjectConfig, IRequestConfig, IResponseConfig, PendingRequest, RequestDriver } from "@barktler/driver";
import { Pattern } from "@sudoo/pattern";
import { AsyncDataHook } from "@sudoo/processor";
import { RequestVerifyOverrideFunction, ResponseVerifyOverrideFunction } from "./declare";

export type BarktlerMixin<RequestBody extends any = any, ResponseData extends any = any> = (instance: Barktler<RequestBody, ResponseData>) => Barktler<RequestBody, ResponseData> | void;

export abstract class Barktler<RequestBody extends any = any, ResponseData extends any = any> {

    protected static _globalDefaultDriver: RequestDriver | null = null;
    protected static _globalConfigs: Map<string, any> = new Map();

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

    public static setGlobalConfig(key: string, value: any): void {

        this._globalConfigs.set(key, value);
        return;
    }

    public static getGlobalConfig(key: string): any {

        return this._globalConfigs.get(key);
    }

    public static getAllGlobalConfigs(): Record<string, any> {

        const keys: string[] = [...this._globalConfigs.keys()];
        return keys.reduce((result: Record<string, any>, current: string) => {
            return {
                ...result,
                [current]: this._globalConfigs.get(current),
            };
        }, {});
    }

    protected readonly defaultDriver: RequestDriver | null = null;

    private readonly _preHook: AsyncDataHook<IRequestConfig<RequestBody>>;
    private readonly _postHook: AsyncDataHook<IResponseConfig<ResponseData>>;

    private readonly _configs: Map<string, any>;

    private _requestParamsPattern?: Pattern;
    private _requestHeadersPattern?: Pattern;
    private _requestBodyPattern?: Pattern;

    private _responseHeadersPattern?: Pattern;
    private _responseDataPattern?: Pattern;

    private _preVerifyFailing: RequestVerifyOverrideFunction<RequestBody> | null;
    private _postVerifyFailing: ResponseVerifyOverrideFunction<RequestBody, ResponseData> | null;

    private _driver: RequestDriver | null;

    private readonly _mixinStack: Array<BarktlerMixin<RequestBody, ResponseData>>;

    protected constructor(
        preHook: AsyncDataHook<IRequestConfig<RequestBody>> = AsyncDataHook.create<IRequestConfig<RequestBody>>(),
        postHook: AsyncDataHook<IResponseConfig<ResponseData>> = AsyncDataHook.create<IResponseConfig<ResponseData>>(),
    ) {

        this._preHook = preHook;
        this._postHook = postHook;

        this._configs = new Map<string, any>();

        this._preVerifyFailing = null;
        this._postVerifyFailing = null;

        this._driver = null;

        this._mixinStack = [];
    }

    public get preHook(): AsyncDataHook<IRequestConfig<RequestBody>> {
        return this._preHook;
    }
    public get postHook(): AsyncDataHook<IResponseConfig<ResponseData>> {
        return this._postHook;
    }

    public get requestParamsPattern(): Pattern | undefined {
        return this._requestParamsPattern;
    }
    public get requestHeadersPattern(): Pattern | undefined {
        return this._requestHeadersPattern;
    }
    public get requestBodyPattern(): Pattern | undefined {
        return this._requestBodyPattern;
    }
    public get responseHeadersPattern(): Pattern | undefined {
        return this._responseHeadersPattern;
    }
    public get responseDataPattern(): Pattern | undefined {
        return this._responseDataPattern;
    }

    public setConfig(key: string, value: any): this {

        this._configs.set(key, value);
        return this;
    }

    public getConfig(key: string): any {

        return this._configs.get(key);
    }

    public getAllConfigs(): Record<string, any> {

        const keys: string[] = [...this._configs.keys()];
        return keys.reduce((result: Record<string, any>, current: string) => {
            return {
                ...result,
                [current]: this._configs.get(current),
            };
        }, {});
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

    public getMixinStack(): Array<BarktlerMixin<RequestBody, ResponseData>> {

        return this._mixinStack;
    }

    public useMixin(mixin: BarktlerMixin<RequestBody, ResponseData>): Barktler<RequestBody, ResponseData> {

        const result: Barktler<RequestBody, ResponseData> | void = mixin(this);
        this._mixinStack.push(mixin);

        if (result instanceof Barktler) {
            return result;
        }
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

    protected _declareRequestParamsPattern(pattern: Pattern): this {

        this._requestParamsPattern = pattern;
        return this;
    }

    protected _declareRequestHeadersPattern(pattern: Pattern): this {

        this._requestHeadersPattern = pattern;
        return this;
    }

    protected _declareRequestBodyPattern(pattern: Pattern): this {

        this._requestBodyPattern = pattern;
        return this;
    }

    protected _declareResponseHeaderPattern(pattern: Pattern): this {

        this._requestHeadersPattern = pattern;
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

        const postHookResult: IResponseConfig<ResponseData> | null = await this._triggerPostHook(injectedResponse);
        if (!postHookResult) {
            this._executePostVerifyFailing(request, injectedResponse);
            return null as any;
        }

        return postHookResult;
    }

    protected async _requestForPendingRequest(request: IRequestConfig<RequestBody>): Promise<PendingRequest<RequestBody, ResponseData>> {

        const driver: RequestDriver | null = this._getDriver();
        if (!driver) {
            throw new Error('[Barktler] Driver not found');
        }

        const injectedRequest: IRequestConfig<RequestBody> = this._inject(request);

        const preHookResult: IRequestConfig<RequestBody> | null = await this._triggerPreHook(injectedRequest);
        if (!preHookResult) {
            this._executePreVerifyFailing(injectedRequest);
            return null as any;
        }

        const pendingRequest: PendingRequest<RequestBody, ResponseData> = driver<RequestBody, ResponseData>(preHookResult);
        return pendingRequest;
    }

    protected async _triggerPreHook(request: IRequestConfig<RequestBody>): Promise<IRequestConfig<RequestBody> | null> {

        const preVerifyResult: boolean = await this._preHook.verify(request);
        if (!preVerifyResult) {
            return null;
        }

        const preProcessed: IRequestConfig<RequestBody> = await this._preHook.process(request);
        await this._preHook.execute(preProcessed);
        return preProcessed;
    }

    protected async _triggerPostHook(response: IResponseConfig<ResponseData>): Promise<IResponseConfig<ResponseData> | null> {

        const postVerifyResult: boolean = await this._postHook.verify(response);
        if (!postVerifyResult) {
            return null;
        }

        const postProcessedData: IResponseConfig<ResponseData> = await this._postHook.process(response);
        await this._postHook.execute(postProcessedData);
        return postProcessedData;
    }

    private _inject<T extends IInjectConfig>(request: T): T {

        return {

            requestParamsPattern: this._requestParamsPattern,
            requestHeadersPattern: this._requestHeadersPattern,
            requestBodyPattern: this._requestBodyPattern,

            responseHeadersPattern: this._responseHeadersPattern,
            responseDataPattern: this._responseDataPattern,

            ...request,
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

    private _executePreVerifyFailing(request: IRequestConfig<RequestBody>) {

        if (typeof this._preVerifyFailing === 'function') {

            const result: void | Error = this._preVerifyFailing(request);
            if (result instanceof Error) {
                throw result;
            }

            return;
        }

        throw new Error('[Barktler] Pre Verify Failed');
    }

    private _executePostVerifyFailing(request: IRequestConfig<RequestBody>, response: IResponseConfig<ResponseData>) {

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
