/**
 * @author WMXPY
 * @namespace Core
 * @description Hook
 */

export class RequestHook<T> {

    public static create<T>(): RequestHook<T> {

        return new RequestHook<T>();
    }

    private constructor() {

    }
}
