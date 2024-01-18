import {Sequelize} from "sequelize";
import {CONFIGS} from "../config";

export const sequelize = new Sequelize(`postgresql://${CONFIGS.db.user}:${CONFIGS.db.password}@${CONFIGS.db.host}:${CONFIGS.db.port}/${CONFIGS.db.database}?schema=public`, {
    logging: CONFIGS.common.env === 'dev'
});
