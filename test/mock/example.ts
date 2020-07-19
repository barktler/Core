/**
 * @author WMXPY
 * @namespace Core
 * @description Example
 * @override Mock
 */

import { BarktlerCore } from "../../src/core";
import { IBarktler } from "../../src/declare";

export class ExampleAPI extends BarktlerCore implements IBarktler {

    public constructor() {

        super();
    }
}
