import {Transaction} from "../model/Transcation";
import * as _ from "lodash";
import {queryTxByHash} from "../chain";
import {sleep} from "../util/commonUtils";
import {HttpStatusCode} from "axios";

export async function indexTransactions() {
    while (true) {
        const transactions = await Transaction.findAll({
            where: {
                re_indexed: 1
            },
            limit: 100
        });
        if (!_.isEmpty(transactions)) {
            for (const t of transactions) {
                const result = await queryTxByHash(t.getDataValue('hash'));
                if (result.status === HttpStatusCode.Ok) {
                    await Transaction.update({
                        input_data: result.data.result.input,
                        re_indexed: 0,
                    }, {
                        where: {
                            hash: t.getDataValue('hash')
                        }
                    });
                }
            }
        }
        await sleep(3 * 1000);
    }
}
