import * as express from 'express';
import * as cors from 'cors';
import * as bodyParser from 'body-parser';
import { resolve } from 'path';
import {commitmentsToVersionedHashes, EncodeBlobs} from '@ethda/blobs';
import {blobToKzgCommitment, computeBlobKzgProof, loadTrustedSetup} from "c-kzg";
const app = express();
const SETUP_FILE_PATH = resolve(__dirname, 'trusted.txt');
import {HttpStatusCode} from 'axios'
import {queryTxByHash} from "./chain";
import {queryForArray} from "./util/dbUtils";
import {indexTransactions} from "./job";
import {CONFIGS} from "./config";
const port = CONFIGS.server.port ?? 3000;

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
        const result = await queryTxByHash(hash);
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
});

app.get('/blob/:hash/txData', async (req: any, res: any) => {
    const hash = req.params.hash;
    if (hash) {
        const result = await queryForArray(`SELECT
\tbt.tx_hash,
\ttr.input_data,
\tbt.index
FROM
\tblobs_on_transactions AS bt
\tJOIN "transaction" AS tr ON bt.tx_hash = tr.hash 
WHERE
\tbt.blob_hash = ? AND re_indexed = 0`, [hash]);
        res.json(result);
    } else {
        res.json([]);
    }
});

app.listen(port, () => {
    console.log(`server start at: ${port}`);
});

indexTransactions().catch(e => {
    console.error(e);
});
