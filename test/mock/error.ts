/**
 * @author WMXPY
 * @namespace Core
 * @description Error Example
 * @override Mock
 */

import { Barktler } from "../../src";

export class ErrorExampleAPI extends Barktler<any, any> {

    public constructor() {

        super();
    }

    public async fetch(): Promise<any> {

        throw new Error("ERROR");
    }
}
