import * as express from 'express';
import * as cors from 'cors';
import * as bodyParser from 'body-parser';
import { resolve } from 'path';
import {commitmentsToVersionedHashes, EncodeBlobs} from '@ethda/blobs';
import {blobToKzgCommitment, computeBlobKzgProof, loadTrustedSetup} from "c-kzg";
const app = express();
const port = process.env.PORT ?? 3000;
const SETUP_FILE_PATH = resolve(__dirname, 'trusted.txt');
import axios, {HttpStatusCode} from 'axios'
const rpcUrl = process.env.RPC_URL??'https://rpc-devnet.ethda.io'
loadTrustedSetup(SETUP_FILE_PATH);
app.use(cors({
    origin:true,
    credentials: true
}));
app.use(bodyParser.json({limit: '2mb'}));
app.post('/convert/blob', (req: any, res: any) => {
    const content = req.body.content;
    if (content) {
        const blobs = EncodeBlobs(new Uint8Array(content));
        const commitments = [];
        const proofs = [];
        const versionedHashes = [];
        for (let i = 0; i < blobs.length; i++) {
            commitments.push(blobToKzgCommitment(blobs[i]));
            proofs.push(computeBlobKzgProof(blobs[i], commitments[i]));
            versionedHashes.push(commitmentsToVersionedHashes(commitments[i]));
        }
        res.json({
            commitments,
            proofs,
            versionedHashes
        });
    } else {
        res.status(400).send('content undefined');
    }
});

app.get('/transaction/:hash', async (req: any, res: any) => {
    const hash = req.params.hash;
    if (hash) {
        const result = await axios.post(rpcUrl, {
            method: "eth_getTransactionByHash",
            params: [hash],
            id: 1,
            jsonrpc: "2.0"
        });
        if (result.status === HttpStatusCode.Ok) {
            res.json({
                data: result.data.result.input
            })
        } else {
            res.status(500).send('query tx failed');
        }

    } else {
        res.status(400).send('invalid tx hash');
    }
})

app.listen(port, () => {
    console.log(`server start at: ${port}`);
});
