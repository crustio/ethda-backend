import {sequelize} from "../db";
import {DataTypes} from "sequelize";

export const BlobsOnTransactions = sequelize.define("blobs_on_transactions",
    {
        blob_hash: { type: DataTypes.STRING},
        tx_hash: { type: DataTypes.STRING},
        index: { type: DataTypes.INTEGER},
    }, {
    timestamps: false,
    freezeTableName: true
});
