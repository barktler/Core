/**
 * @author WMXPY
 * @namespace Core
 * @description Declare
 */

import { IRequestConfig, IResponseConfig } from "@barktler/driver";

export type RequestOverrideFunction<RequestBody> = (request: IRequestConfig<RequestBody>) => void | Error;
export type ResponseOverrideFunction<RequestBody, ResponseData> = (request: IRequestConfig<RequestBody>, response: IResponseConfig<ResponseData>) => void | Error;
