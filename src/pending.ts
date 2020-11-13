/**
 * @author WMXPY
 * @namespace Core
 * @description Pending
 */

import { IResponseConfig, PendingRequest } from "@barktler/driver";
import { AsyncDataHook } from "@sudoo/processor";

export class HookedPendingRequest<ResponseData extends any = any> {

    // eslint-disable-next-line @typescript-eslint/no-shadow
    public static create<ResponseData extends any = any>(pendingRequest: PendingRequest, postHook: AsyncDataHook<IResponseConfig<ResponseData>>, errorHook: AsyncDataHook<any>): HookedPendingRequest {

        return new HookedPendingRequest(pendingRequest, postHook, errorHook);
    }

    private readonly _pendingRequest: PendingRequest;
    private readonly _postHook: AsyncDataHook<IResponseConfig<ResponseData>>;
    private readonly _errorHook: AsyncDataHook<any>;

    private constructor(pendingRequest: PendingRequest, postHook: AsyncDataHook<IResponseConfig<ResponseData>>, errorHook: AsyncDataHook<any>) {

        this._pendingRequest = pendingRequest;
        this._postHook = postHook;
        this._errorHook = errorHook;
    }
}
