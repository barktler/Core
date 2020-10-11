/**
 * @author WMXPY
 * @namespace Core
 * @description Core
 * @override Unit
 */

import { mockDriver } from "@barktler/driver-mock";
import { expect } from "chai";
import * as Chance from "chance";
import { Barktler } from "../../src";
import { ExampleAPI, ExampleAPIResponse } from "../mock/example";

describe('Given {ExampleAPI} Class', (): void => {

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const chance: Chance.Chance = new Chance('barktler-core');

    afterEach(() => {
        Barktler.removeGlobalDefaultDriver();
    });

    it('should be able to construct', (): void => {

        const api: ExampleAPI = new ExampleAPI();

        expect(api).to.be.instanceOf(ExampleAPI);
        expect(api).to.be.instanceOf(Barktler);
    });

    it('should be able to use mock driver', async (): Promise<void> => {

        const api: ExampleAPI = new ExampleAPI();
        api.useDriver(mockDriver);

        const response: ExampleAPIResponse = await api.fetch();

        expect(api.hasDriver()).to.be.true;
        expect(typeof response.hello).to.be.equal('string');
    });

    it('should be able to check global default driver', async (): Promise<void> => {

        Barktler.useGlobalDefaultDriver(mockDriver);
        const api: ExampleAPI = new ExampleAPI();

        const response: ExampleAPIResponse = await api.fetch();

        expect(api.hasDriver()).to.be.true;
        expect(typeof response.hello).to.be.equal('string');
    });

    it('should be able to check null driver', async (): Promise<void> => {

        const api: ExampleAPI = new ExampleAPI();

        expect(api.hasDriver()).to.be.false;
    });
});
