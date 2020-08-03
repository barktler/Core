/**
 * @author WMXPY
 * @namespace Core
 * @description Core
 * @override Unit
 */

import { expect } from "chai";
import * as Chance from "chance";
import { Barktler } from "../../src";
import { ExampleAPI } from "../mock/example";

describe('Given {ExampleAPI} Class', (): void => {

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const chance: Chance.Chance = new Chance('barktler-core');

    it('should be able to construct', (): void => {

        const api: ExampleAPI = new ExampleAPI();

        expect(api).to.be.instanceOf(ExampleAPI);
        expect(api).to.be.instanceOf(Barktler);
    });
});
