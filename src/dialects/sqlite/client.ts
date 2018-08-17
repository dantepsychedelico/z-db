
import * as BPromise from 'bluebird';
import { DbBase, DbConfig, DbResult } from '../abstract';
import { DB_TYPE } from '../../utils';
import * as _ from 'lodash';

export interface ISqliteDbConfig {
    filename: string;
}
export class SqliteDbConfig implements DbConfig {
    dbType: Symbol = DB_TYPE.sqlite;
    debug?: boolean = false;
    constructor(public config: ISqliteDbConfig) {}
}

export class SqliteDbClient extends DbBase {
    constructor(
        protected readonly _config: SqliteDbConfig
    ) {
        super(_config);
    }
    _connect() {
        return BPromise.resolve(this);
    }
    _driver() {
    }
    _query(sql: string, params: any[], options?: any) {
        return BPromise.resolve({ rows: [] });
    }
    _close() {
        return BPromise.resolve(this);
    }
    _begin() {
        return BPromise.resolve({ rows: [] });
    }
    _commit() {
        return BPromise.resolve(this);
    }
    _rollback() {
        return BPromise.resolve(this);
    }
}
