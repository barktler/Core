/**
 * @author WMXPY
 * @namespace Core
 * @description Pending
 */

import { IResponseConfig, PendingRequest } from "@barktler/driver";
import { TriggerErrorHookFunction, TriggerPostHookFunction } from "./declare";

export class HookedPendingRequest<ResponseData extends any = any> {

    // eslint-disable-next-line @typescript-eslint/no-shadow
    public static create<ResponseData extends any = any>(
        pendingRequest: PendingRequest,
        injectFunction: <T>(config: T) => T,
        triggerPostHook: TriggerPostHookFunction<ResponseData>,
        triggerErrorHook: TriggerErrorHookFunction,
    ): HookedPendingRequest {

        return new HookedPendingRequest(pendingRequest, injectFunction, triggerPostHook, triggerErrorHook);
    }

    private readonly _pendingRequest: PendingRequest;
    private readonly _injectFunction: <T>(config: T) => T;
    private readonly _triggerPostHook: TriggerPostHookFunction<ResponseData>;
    private readonly _triggerErrorHook: TriggerErrorHookFunction;

    private readonly _response: Promise<IResponseConfig<ResponseData> | null>;

    private _originalData: any;
    private _injectedOriginalData: any;

    private constructor(
        pendingRequest: PendingRequest,
        injectFunction: <T>(config: T) => T,
        triggerPostHook: TriggerPostHookFunction<ResponseData>,
        triggerErrorHook: TriggerErrorHookFunction,
    ) {

        this._pendingRequest = pendingRequest;
        this._injectFunction = injectFunction;
        this._triggerPostHook = triggerPostHook;
        this._triggerErrorHook = triggerErrorHook;

        this._response = new Promise<IResponseConfig<ResponseData> | null>((resolve: (data: IResponseConfig<ResponseData> | null) => void, reject: (reason: any) => void) => {

            if (!this._pendingRequest) {
                reject(new Error("[Barktler] Invalid Pending Request"));
            }

            this._pendingRequest.response.then((data: IResponseConfig<ResponseData>) => {

                this._originalData = data;

                if (!data.succeed) {

                    this._triggerErrorHook(data).then((errorNewData: IResponseConfig<ResponseData>) => {

                        reject(errorNewData);
                        return;
                    }).catch((hookErrorReason: any) => {

                        reject(new Error(`[Barktler] ErrorHook Internal Error: "${hookErrorReason}"`));
                        return;
                    });
                } else {

                    const injectedData: IResponseConfig<ResponseData> = this._injectFunction(data);
                    this._injectedOriginalData = injectedData;

                    this._triggerPostHook(injectedData).then((hookedData: IResponseConfig<ResponseData> | null) => {

                        resolve(hookedData);
                        return;
                    }).catch((hookErrorReason: any) => {

                        reject(new Error(`[Barktler] PostHook Internal Error: "${hookErrorReason}"`));
                        return;
                    });
                }
            }).catch((internalErrorReason: any) => {

                reject(internalErrorReason);
                return;
            });
        });
    }

    public get response(): Promise<IResponseConfig<ResponseData> | null> {
        return this._response;
    }
    public get originalData(): any {
        return this._originalData;
    }
    public get injectedOriginalData(): any {
        return this._injectedOriginalData;
    }

    public get pending(): boolean {
        return this._pendingRequest.pending;
    }
    public get completed(): boolean {
        return this._pendingRequest.completed;
    }
    public get succeed(): boolean {
        return this._pendingRequest.succeed;
    }
    public get failed(): boolean {
        return this._pendingRequest.failed;
    }

    public abort(): void {

        this._pendingRequest.abort();
    }
}
