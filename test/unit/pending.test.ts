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
});
