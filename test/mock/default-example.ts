/**
 * @author WMXPY
 * @namespace Core
 * @description Default Example
 * @override Mock
 */

import { mockDriver } from "@barktler/driver-mock";
import { RequestDriver } from "../../src";
import { ExampleAPI } from "./example";

export type ExampleAPIResponse = {

    readonly hello: string;
};

export class DefaultExampleAPI extends ExampleAPI {

    protected readonly defaultDriver: RequestDriver | null = mockDriver;
}
