/**
 * @author WMXPY
 * @namespace Core
 * @description Pending
 * @override Unit
 */

import { IResponseConfig, PendingRequest } from "@barktler/driver";
import { expect } from "chai";
import * as Chance from "chance";
import { HookedPendingRequest } from "../../src";
import { HTTP_RESPONSE_CODE } from "@sudoo/magic";

describe('Given {HookedPendingRequest} Class', (): void => {

    const chance: Chance.Chance = new Chance('barktler-pending');

    it('should be able to construct', (): void => {

        const pendingRequest: PendingRequest = PendingRequest.create({
            response: Promise.resolve(null as any),
            abort: () => void 0,
        });

        const hookedPendingRequest: HookedPendingRequest = HookedPendingRequest.create(
            pendingRequest,
            (value) => value,
            async (value) => value,
            async (value) => value,
        );

        expect(hookedPendingRequest).to.be.instanceOf(HookedPendingRequest);
    });

    it('should be able to get response', async (): Promise<void> => {

        const responseResult: IResponseConfig = {
            status: HTTP_RESPONSE_CODE.OK,
            statusText: 'OK',
            headers: {},
            data: chance.string(),
        };

        const pendingRequest: PendingRequest = PendingRequest.create({
            response: Promise.resolve(responseResult),
            abort: () => void 0,
        });

        const hookedPendingRequest: HookedPendingRequest = HookedPendingRequest.create(
            pendingRequest,
            (value) => value,
            async (value) => value,
            async (value) => value,
        );

        const response: IResponseConfig | null = await hookedPendingRequest.response;

        expect(response).to.be.deep.equal(responseResult);
    });

    it('should be able to hook response', async (): Promise<void> => {

        const newData: string = chance.string();
        const responseResult: IResponseConfig = {
            status: HTTP_RESPONSE_CODE.OK,
            statusText: 'OK',
            headers: {},
            data: chance.string(),
        };

        const pendingRequest: PendingRequest = PendingRequest.create({
            response: Promise.resolve(responseResult),
            abort: () => void 0,
        });

        const hookedPendingRequest: HookedPendingRequest = HookedPendingRequest.create(
            pendingRequest,
            (value) => value,
            async (value) => ({
                ...value,
                data: newData,
            }),
            async (value) => value,
        );

        const response: IResponseConfig | null = await hookedPendingRequest.response;

        expect(hookedPendingRequest.pending).to.be.false;
        expect(hookedPendingRequest.completed).to.be.true;
        expect(hookedPendingRequest.succeed).to.be.true;
        expect(hookedPendingRequest.failed).to.be.false;
        expect(response).to.be.deep.equal({
            ...responseResult,
            data: newData,
        });
    });

    it('should be fail verify failing', async (): Promise<void> => {

        const newData: string = chance.string();
        const responseResult: IResponseConfig = {
            status: HTTP_RESPONSE_CODE.OK,
            statusText: 'OK',
            headers: {},
            data: chance.string(),
        };

        const pendingRequest: PendingRequest = PendingRequest.create({
            response: Promise.resolve(responseResult),
            abort: () => void 0,
        });

        const hookedPendingRequest: HookedPendingRequest = HookedPendingRequest.create(
            pendingRequest,
            (value) => ({
                ...value,
                data: newData,
            }),
            async () => null,
            async (value) => value,
        );

        const response: IResponseConfig | null = await hookedPendingRequest.response;

        expect(hookedPendingRequest.originalData).to.be.deep.equal(responseResult);
        expect(hookedPendingRequest.injectedOriginalData).to.be.deep.equal({
            ...responseResult,
            data: newData,
        });
        expect(response).to.be.deep.equal(null);
    });

    it('should be able to get error response', async (): Promise<void> => {

        const errorMessage: string = chance.string();

        const pendingRequest: PendingRequest = PendingRequest.create({
            response: (async () => {
                throw new Error(errorMessage);
            })(),
            abort: () => void 0,
        });

        const hookedPendingRequest: HookedPendingRequest = HookedPendingRequest.create(
            pendingRequest,
            (value) => value,
            async (value) => value,
            async (value) => value,
        );

        let responseError: any;

        try {
            await hookedPendingRequest.response;
        } catch (err) {
            responseError = err;
        }

        expect(hookedPendingRequest.pending).to.be.false;
        expect(hookedPendingRequest.completed).to.be.true;
        expect(hookedPendingRequest.succeed).to.be.false;
        expect(hookedPendingRequest.failed).to.be.true;
        expect(responseError.toString()).to.be.equal(new Error(errorMessage).toString());
    });

    it('should be able to hook error response', async (): Promise<void> => {

        const errorMessage: string = chance.string();

        const pendingRequest: PendingRequest = PendingRequest.create({
            response: (async () => {
                throw new Error(chance.string());
            })(),
            abort: () => void 0,
        });

        const hookedPendingRequest: HookedPendingRequest = HookedPendingRequest.create(
            pendingRequest,
            (value) => value,
            async (value) => value,
            async () => new Error(errorMessage),
        );

        let responseError: any;

        try {
            await hookedPendingRequest.response;
        } catch (err) {
            responseError = err;
        }

        expect(responseError.toString()).to.be.equal(new Error(errorMessage).toString());
    });

    it('should be able to handler hook error response', async (): Promise<void> => {

        const errorMessage: string = chance.string();

        const pendingRequest: PendingRequest = PendingRequest.create({
            response: (async () => {
                throw new Error(chance.string());
            })(),
            abort: () => void 0,
        });

        const hookedPendingRequest: HookedPendingRequest = HookedPendingRequest.create(
            pendingRequest,
            (value) => value,
            async (value) => value,
            async () => {
                throw new Error(errorMessage);
            },
        );

        let responseError: any;

        try {
            await hookedPendingRequest.response;
        } catch (err) {
            responseError = err;
        }

        expect(responseError.toString()).to.be.equal(new Error(errorMessage).toString());
    });

    it('should be able to abort', async (): Promise<void> => {

        const responseResult: IResponseConfig = {
            status: HTTP_RESPONSE_CODE.OK,
            statusText: 'OK',
            headers: {},
            data: chance.string(),
        };

        const pendingRequest: PendingRequest = PendingRequest.create({
            response: Promise.resolve(responseResult),
            abort: () => void 0,
        });

        const hookedPendingRequest: HookedPendingRequest = HookedPendingRequest.create(
            pendingRequest,
            (value) => value,
            async (value) => value,
            async (value) => value,
        );

        let error: any;

        hookedPendingRequest.abort();

        try {
            await hookedPendingRequest.response;
        } catch (err) {
            error = err;
        }

        expect(error.toString()).to.be.equal(new Error("[Barktler] Aborted").toString());
    });
});
