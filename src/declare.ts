/**
 * @author WMXPY
 * @namespace Core
 * @description Declare
 */

import { IRequestConfig, IResponseConfig } from "@barktler/driver";

export type RequestVerifyOverrideFunction<RequestBody> = (request: IRequestConfig<RequestBody>) => void | Error;
export type ResponseVerifyOverrideFunction<RequestBody, ResponseData> = (request: IRequestConfig<RequestBody>, response: IResponseConfig<ResponseData>) => void | Error;

export type TriggerPostHookFunction<ResponseData> = (response: IResponseConfig<ResponseData>) => Promise<IResponseConfig<ResponseData> | null>;
export type TriggerErrorHookFunction = (reason: any) => Promise<any>;
