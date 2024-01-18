import axios from "axios";
import {CONFIGS} from "../config";
const rpcUrl = CONFIGS.chain.rpcUrl as string;
export async function queryTxByHash(hash: string) {
    const result = await axios.post(rpcUrl, {
        method: "eth_getTransactionByHash",
        params: [hash],
        id: 1,
        jsonrpc: "2.0"
    });
    return result;
}
