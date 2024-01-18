import {QueryTypes, Sequelize, Transaction} from 'sequelize';

import * as _ from 'lodash';
import {sequelize} from "../db";

export function queryForCount(
  sql: string,
  replace: any[],
  transaction?: Transaction
): Promise<number> {
  return sequelize
    .query(sql, {
      replacements: replace,
      type: QueryTypes.SELECT,
      raw: true,
      transaction,
    })
    .then((r: any[]) => {
      if (!_.isEmpty(r)) {
        const res = r[0];
        return res[Object.keys(res)[0]];
      }
    });
}

export function queryForArray(
  sql: string,
  replace: any[],
  transaction?: Transaction
): Promise<any[]> {
  return sequelize
    .query(sql, {
      replacements: replace,
      type: QueryTypes.SELECT,
      transaction,
    })
    .then((r: any[]) => {
      if (!_.isEmpty(r)) {
        return r;
      }
      return [];
    });
}

export function queryForObj(
  sql: string,
  replace: any[],
  transaction?: Transaction
): Promise<any> {
  return sequelize
    .query(sql, {
      replacements: replace,
      type: QueryTypes.SELECT,
      transaction,
    })
    .then((r: any[]) => {
      if (!_.isEmpty(r)) {
        return r[0];
      }
      return {};
    });
}

export function queryForUpdate(
  sql: string,
  replace: any[],
  transaction?: Transaction
): Promise<number> {
  return sequelize
    .query(sql, {
      replacements: replace,
      type: QueryTypes.UPDATE,
      transaction,
    })
    .then((r: any) => {
      return 0;
    });
}

export function queryForInsert(
  sql: string,
  replace: any[],
  transaction?: Transaction
): Promise<number> {
  return sequelize
    .query(sql, {
      replacements: replace,
      type: QueryTypes.INSERT,
      transaction,
    })
    .then((r: any) => {
      return 0;
    });
}

export function queryForDelete(
  sql: string,
  replace: any[],
  transaction?: Transaction
): Promise<number> {
  return sequelize
    .query(sql, {
      replacements: replace,
      type: QueryTypes.DELETE,
      transaction,
    })
    .then((r: any) => {
      return 0;
    });
}
