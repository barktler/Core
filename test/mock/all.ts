/**
 * @author WMXPY
 * @namespace Core
 * @description All Example
 * @override Mock
 */

import { createStrictMapPattern, createStringPattern, Pattern } from "@sudoo/pattern";
import { Barktler } from "../../src";

export type AllExampleAPIResponse = {

    readonly hello: string;
};

export const helloMap: Pattern = createStrictMapPattern({
    hello: createStringPattern(),
});

export class AllExampleAPI extends Barktler<any, AllExampleAPIResponse> {

    public constructor() {

        super();
        super._declareRequestHeadersPattern(helloMap);
        super._declareRequestParamsPattern(helloMap);
        super._declareRequestBodyPattern(helloMap);
        super._declareResponseHeaderPattern(helloMap);
        super._declareResponseDataPattern(helloMap);
    }

    public async fetch(): Promise<AllExampleAPIResponse> {

        return await this._requestForData({
            url: 'example.com',
            method: 'GET',
        });
    }
}
