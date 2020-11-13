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
        triggerPostHook: TriggerPostHookFunction<ResponseData>,
        triggerErrorHook: TriggerErrorHookFunction,
    ): HookedPendingRequest {

        return new HookedPendingRequest(pendingRequest, triggerPostHook, triggerErrorHook);
    }

    private readonly _pendingRequest: PendingRequest;
    private readonly _triggerPostHook: TriggerPostHookFunction<ResponseData>;
    private readonly _triggerErrorHook: TriggerErrorHookFunction;

    private readonly _response: Promise<IResponseConfig<ResponseData> | null>;

    private constructor(
        pendingRequest: PendingRequest,
        triggerPostHook: TriggerPostHookFunction<ResponseData>,
        triggerErrorHook: TriggerErrorHookFunction,
    ) {

        this._pendingRequest = pendingRequest;
        this._triggerPostHook = triggerPostHook;
        this._triggerErrorHook = triggerErrorHook;

        this._response = new Promise<IResponseConfig<ResponseData> | null>((resolve: (data: IResponseConfig<ResponseData> | null) => void, reject: (reason: any) => void) => {

            this._pendingRequest.response.then((data: IResponseConfig<ResponseData>) => {

                return this._triggerPostHook(data);
            }).then((hookedData: IResponseConfig<ResponseData> | null) => {

                resolve(hookedData);
                return;
            }).catch((reason: any) => {

                this._triggerErrorHook(reason).then((errorReason: any) => {

                    reject(errorReason);
                    return;
                }).catch((newReason: any) => {

                    reject(newReason);
                    return;
                });
                return;
            });
        });
    }

    public get response(): Promise<IResponseConfig<ResponseData> | null> {
        return this._response;
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
