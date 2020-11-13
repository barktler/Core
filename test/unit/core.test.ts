/**
 * @author WMXPY
 * @namespace Core
 * @description Core
 * @override Unit
 */

import { createMockDriver } from "@barktler/driver-mock";
import { AsyncDataHook } from "@sudoo/processor";
import { expect } from "chai";
import * as Chance from "chance";
import { Barktler, BarktlerMixin } from "../../src";
import { DefaultExampleAPI } from "../mock/default-example";
import { ExampleAPI, ExampleAPIResponse } from "../mock/example";

describe('Given {Barktler} Class', (): void => {

    const chance: Chance.Chance = new Chance('barktler-core');

    afterEach(() => {
        Barktler.removeGlobalDefaultDriver();
        Barktler.clearGlobalConfigs();
    });

    it('should be able to construct', (): void => {

        const api: ExampleAPI = new ExampleAPI();

        expect(api).to.be.instanceOf(ExampleAPI);
        expect(api).to.be.instanceOf(Barktler);
    });

    it('should be able set and get config', (): void => {

        const key: string = chance.string();
        const value: string = chance.string();

        const api: ExampleAPI = new ExampleAPI();

        api.setConfig(key, value);

        expect(api.getConfig(key)).to.be.equal(value);
        expect(Barktler.getGlobalConfig(key)).to.be.equal(undefined);
        expect(api.getAllConfigs()).to.be.deep.equal({
            [key]: value,
        });
        expect(Barktler.getAllGlobalConfigs()).to.be.deep.equal({});
    });

    it('should be able set and get global config', (): void => {

        const key: string = chance.string();
        const value: string = chance.string();

        Barktler.setGlobalConfig(key, value);
        const api: ExampleAPI = new ExampleAPI();

        expect(api.getConfig(key)).to.be.equal(value);
        expect(Barktler.getGlobalConfig(key)).to.be.equal(value);
        expect(api.getAllConfigs()).to.be.deep.equal({
            [key]: value,
        });
        expect(Barktler.getAllGlobalConfigs()).to.be.deep.equal({
            [key]: value,
        });
        expect(api.getInstanceConfig(key)).to.be.equal(undefined);
        expect(api.getAllInstanceConfigs()).to.be.deep.equal({});
    });

    it('should be able clear global config', (): void => {

        const key: string = chance.string();
        const value: string = chance.string();

        Barktler.setGlobalConfig(key, value);
        const api: ExampleAPI = new ExampleAPI();

        Barktler.clearGlobalConfigs();

        expect(api.getConfig(key)).to.be.equal(undefined);
        expect(api.getAllConfigs()).to.be.deep.equal({});
    });

    it('should be able delete global config', (): void => {

        const key: string = chance.string();
        const value: string = chance.string();

        Barktler.setGlobalConfig(key, value);
        const api: ExampleAPI = new ExampleAPI();

        Barktler.deleteGlobalConfig(key);

        expect(api.getConfig(key)).to.be.equal(undefined);
        expect(api.getAllConfigs()).to.be.deep.equal({});
    });

    it('should be able delete instance config', (): void => {

        const key: string = chance.string();
        const value: string = chance.string();

        const api: ExampleAPI = new ExampleAPI();
        api.setConfig(key, value);
        api.deleteConfig(key);

        expect(api.getConfig(key)).to.be.equal(undefined);
        expect(api.getAllConfigs()).to.be.deep.equal({});
    });

    it('should be able clear instance config', (): void => {

        const key: string = chance.string();
        const value: string = chance.string();

        const api: ExampleAPI = new ExampleAPI();
        api.setConfig(key, value);
        api.clearConfigs();

        expect(api.getConfig(key)).to.be.equal(undefined);
        expect(api.getAllConfigs()).to.be.deep.equal({});
    });

    it('should be able get getters', (): void => {

        const api: ExampleAPI = new ExampleAPI();

        expect(api.preHook).to.be.instanceOf(AsyncDataHook);
        expect(api.postHook).to.be.instanceOf(AsyncDataHook);
        expect(api.errorHook).to.be.instanceOf(AsyncDataHook);

        expect(api.requestParamsPattern).to.be.equal(undefined);
        expect(api.requestHeadersPattern).to.be.equal(undefined);
        expect(api.requestBodyPattern).to.be.equal(undefined);
        expect(api.responseHeadersPattern).to.be.equal(undefined);
        expect(api.responseDataPattern).to.be.deep.equal({
            type: 'map',
            map: {
                hello: {
                    type: 'string',
                },
            },
        });
    });

    it('should be able to use mock driver', async (): Promise<void> => {

        const api: ExampleAPI = new ExampleAPI();
        api.useDriver(createMockDriver({
            mockResponseData: true,
        }));

        const response: ExampleAPIResponse = await api.fetch();

        expect(api.hasDriver()).to.be.true;
        expect(typeof response.hello).to.be.equal('string');
    });

    it('should be able to check global default driver', async (): Promise<void> => {

        Barktler.useGlobalDefaultDriver(createMockDriver({
            mockResponseData: true,
        }));
        const api: ExampleAPI = new ExampleAPI();

        const response: ExampleAPIResponse = await api.fetch();

        expect(api.hasDriver()).to.be.true;
        expect(Barktler.hasGlobalDefaultDriver()).to.be.true;
        expect(typeof response.hello).to.be.equal('string');
    });

    it('should be able to check scoped default driver', async (): Promise<void> => {

        const api: ExampleAPI = new DefaultExampleAPI();

        const response: ExampleAPIResponse = await api.fetch();

        expect(api.hasDriver()).to.be.true;
        expect(typeof response.hello).to.be.equal('string');
    });

    it('should be able to check null driver', async (): Promise<void> => {

        const api: ExampleAPI = new ExampleAPI();

        expect(api.hasDriver()).to.be.false;
    });

    it('should be able to mount mixin', async (): Promise<void> => {

        const api: ExampleAPI = new ExampleAPI();

        const mixin: BarktlerMixin = (instance: Barktler) => {
            instance.useDriver(createMockDriver({
                mockResponseData: true,
            }));
        };

        api.useMixin(mixin);

        expect(api.hasDriver()).to.be.true;
        expect(api.getMixinStack()).to.be.lengthOf(1);
    });
});
