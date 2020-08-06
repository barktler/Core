/**
 * @author WMXPY
 * @namespace Core
 * @description Example
 * @override Mock
 */

import { Barktler } from "../../src/core";

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

        return await this._sendRequest({
            url: 'example.com',
            method: 'GET',
        });
    }
}
