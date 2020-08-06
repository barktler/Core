/**
 * @author WMXPY
 * @namespace Core
 * @description Core
 * @override Unit
 */

import { expect } from "chai";
import * as Chance from "chance";
import { Barktler } from "../../src";
import { ExampleAPI, ExampleAPIResponse } from "../mock/example";

describe('Given {ExampleAPI} Class', (): void => {

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const chance: Chance.Chance = new Chance('barktler-core');

    it('should be able to construct', (): void => {

        const api: ExampleAPI = new ExampleAPI();

        expect(api).to.be.instanceOf(ExampleAPI);
        expect(api).to.be.instanceOf(Barktler);
    });

    it('should be able to use mock driver', async (): Promise<void> => {

        const api: ExampleAPI = new ExampleAPI();
        api.useMockDriver();

        const response: ExampleAPIResponse = await api.fetch();

        expect(typeof response.hello).to.be.equal('string');
    });
});
