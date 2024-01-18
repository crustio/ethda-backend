import {sequelize} from "../db";
import {DataTypes} from "sequelize";

export const Transaction = sequelize.define("transaction",
    {
        hash: { type: DataTypes.STRING, primaryKey: true},
        input_data: { type: DataTypes.STRING},
        re_indexed: { type: DataTypes.INTEGER},
    }, {
        timestamps: false,
        freezeTableName: true
    });
