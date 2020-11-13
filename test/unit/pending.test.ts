/**
 * @author WMXPY
 * @namespace Core
 * @description Pending
 * @override Unit
 */

import { PendingRequest } from "@barktler/driver";
import { expect } from "chai";
import * as Chance from "chance";
import { HookedPendingRequest } from "../../src";

describe('Given {HookedPendingRequest} Class', (): void => {

    const chance: Chance.Chance = new Chance('barktler-pending');

    it('should be able to construct', (): void => {

        const pendingRequest: PendingRequest = PendingRequest.create({
            response: Promise.resolve(null as any),
            abort: () => void 0,
        });

        const hookedPendingRequest: HookedPendingRequest = HookedPendingRequest.create(
            pendingRequest,
            async () => null,
            async () => null,
        );

        expect(hookedPendingRequest).to.be.instanceOf(HookedPendingRequest);
    });
});
