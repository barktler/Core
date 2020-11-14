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
import { AllExampleAPI, helloMap } from "../mock/all";
import { DefaultExampleAPI } from "../mock/default-example";
import { ErrorExampleAPI } from "../mock/error";
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
        expect(api.getAllInstanceConfigs()).to.be.deep.equal({
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

    it('should be able ensure getters', (): void => {

        const api: AllExampleAPI = new AllExampleAPI();

        expect(api.requestParamsPattern).to.be.equal(helloMap);
        expect(api.requestHeadersPattern).to.be.equal(helloMap);
        expect(api.requestBodyPattern).to.be.equal(helloMap);
        expect(api.responseHeadersPattern).to.be.equal(helloMap);
        expect(api.responseDataPattern).to.be.deep.equal(helloMap);
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

    it('should be able to trigger error hook', async (): Promise<void> => {

        const api: ErrorExampleAPI = new ErrorExampleAPI();
        api.useDriver(createMockDriver());

        let error: any;
        try {
            await api.fetch();
        } catch (err) {
            error = err;
        }

        expect(error.message).to.be.equal("ERROR");
    });

    it('should be able to trigger error hook - verify', async (): Promise<void> => {

        const api: ErrorExampleAPI = new ErrorExampleAPI();
        api.useDriver(createMockDriver());
        api.errorHook.verifier.add(() => false);

        let error: any;
        try {
            await api.fetch();
        } catch (err) {
            error = err;
        }

        expect(error.message).to.be.equal("ERROR");
    });

    it('should be able to fail when post verify failed', async (): Promise<void> => {

        const api: DefaultExampleAPI = new DefaultExampleAPI();
        api.postHook.verifier.add(() => false);

        let error: any;
        try {
            await api.fetch();
        } catch (err) {
            error = err;
        }

        expect(error.message).to.be.equal("[Barktler] Post Verify Failed");
    });

    it('should be able to fail when pre verify failed', async (): Promise<void> => {

        const api: DefaultExampleAPI = new DefaultExampleAPI();
        api.preHook.verifier.add(() => false);

        let error: any;
        try {
            await api.fetch();
        } catch (err) {
            error = err;
        }

        expect(error.message).to.be.equal("[Barktler] Pre Verify Failed");
    });

    it('should be able to fail when post verify failed - with override error', async (): Promise<void> => {

        const message: string = chance.string();

        const api: DefaultExampleAPI = new DefaultExampleAPI();
        api.postHook.verifier.add(() => false);
        api.overridePostVerifyFailing(() => new Error(message));

        let error: any;
        try {
            await api.fetch();
        } catch (err) {
            error = err;
        }

        expect(error.message).to.be.equal(message);
    });

    it('should be able to fail when pre verify failed - with override error', async (): Promise<void> => {

        const message: string = chance.string();

        const api: DefaultExampleAPI = new DefaultExampleAPI();
        api.preHook.verifier.add(() => false);
        api.overridePreVerifyFailing(() => new Error(message));

        let error: any;
        try {
            await api.fetch();
        } catch (err) {
            error = err;
        }

        expect(error.message).to.be.equal(message);
    });

    it('should be able to fail when post verify failed - with override throw', async (): Promise<void> => {

        const message: string = chance.string();

        const api: DefaultExampleAPI = new DefaultExampleAPI();
        api.postHook.verifier.add(() => false);
        api.overridePostVerifyFailing(() => {
            throw new Error(message);
        });

        let error: any;
        try {
            await api.fetch();
        } catch (err) {
            error = err;
        }

        expect(error.message).to.be.equal(message);
    });

    it('should be able to fail when pre verify failed - with override throw', async (): Promise<void> => {

        const message: string = chance.string();

        const api: DefaultExampleAPI = new DefaultExampleAPI();
        api.preHook.verifier.add(() => false);
        api.overridePreVerifyFailing(() => {
            throw new Error(message);
        });

        let error: any;
        try {
            await api.fetch();
        } catch (err) {
            error = err;
        }

        expect(error.message).to.be.equal(message);
    });
    it('should be able to fail when post verify failed - with override define', async (): Promise<void> => {

        const message: string = chance.string();
        let error: any;

        const api: DefaultExampleAPI = new DefaultExampleAPI();
        api.postHook.verifier.add(() => false);
        api.overridePostVerifyFailing(() => {
            error = message;
        });

        await api.fetch();
        expect(error).to.be.equal(message);
    });

    it('should be able to fail when pre verify failed - with override define', async (): Promise<void> => {

        const message: string = chance.string();
        let error: any;

        const api: DefaultExampleAPI = new DefaultExampleAPI();
        api.preHook.verifier.add(() => false);
        api.overridePreVerifyFailing(() => {
            error = message;
        });

        let lateError: any;
        try {
            await api.fetch();
        } catch (err) {
            lateError = err;
        }

        expect(error).to.be.equal(message);
        expect(lateError.message).to.be.equal("[Barktler] Invalid Pending Request");
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

    it('should be able to mount returnable mixin', async (): Promise<void> => {

        const api: ExampleAPI = new ExampleAPI();

        const mixin: BarktlerMixin = (instance: Barktler) => {
            instance.useDriver(createMockDriver({
                mockResponseData: true,
            }));
            return instance;
        };

        api.useMixin(mixin);

        expect(api.hasDriver()).to.be.true;
        expect(api.getMixinStack()).to.be.lengthOf(1);
    });
});
