
import { injectable, inject } from 'inversify';
import * as BPromise from 'bluebird';
import { DbClient, DbConfig, DbResult } from '../abstract';
import { DB_TYPE } from '../../utils';

export class PgDbConfig implements DbConfig {
    dbType: Symbol = DB_TYPE.postgres;
    constructor(
        private _config: DbConfig
    ) {}
}

export class PgDbClient extends DbClient<PgDbClient, PgDbConfig> {
    constructor(
        readonly _config: PgDbConfig
    ) {
        super(_config);
    }
    _connect(): BPromise<PgDbClient> {
        return BPromise.resolve(this);
    }
    _driver() {
//         import("pg")
//             .then((Pg) => {
//             });
    }
    query(sql: string, params: any[], options?: any) {
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
