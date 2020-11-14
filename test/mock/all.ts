/**
 * @author WMXPY
 * @namespace Core
 * @description All Example
 * @override Mock
 */

import { Barktler } from "../../src";

export type ExampleAPIResponse = {

    readonly hello: string;
};

export class ExampleAPI extends Barktler<any, ExampleAPIResponse> {

    public constructor() {

        super();
        super._declareResponseDataPattern({
            type: 'map',
            map: {
                hello: {
                    type: 'string',
                },
            },
        });
    }

    public async fetch(): Promise<ExampleAPIResponse> {

        return await this._requestForData({
            url: 'example.com',
            method: 'GET',
        });
    }
}
