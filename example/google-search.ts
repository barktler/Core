/**
 * @author WMXPY
 * @namespace Example
 * @description Google Search
 */

import { Barktler } from "../src";

class GoogleSearchAPI extends Barktler {

    public static create(): GoogleSearchAPI {

        return new GoogleSearchAPI();
    }

    public async search(keyword: string): Promise<string> {

        const data: string = await this._requestForData({

            url: `https://www.google.com/search?q=${keyword}`,
            method: 'GET',
        });
        return data;
    }
}

const api: GoogleSearchAPI = GoogleSearchAPI.create();
api.search("hello").then(console.log);
