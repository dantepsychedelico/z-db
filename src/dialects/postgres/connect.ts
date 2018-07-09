
import { injectable, inject } from 'inversify';
import * as BPromise from 'bluebird';
import { DbClient, DbConfig, DbInstance, DbResult } from '../abstract';
import { DB_TYPE } from '../../utils';

const enum DbType {
    postgres
}

export class PgDbConfig implements DbConfig {
    dbType: Symbol = DB_TYPE.postgres;
    constructor(
        private _config: DbConfig
    ) {}
}

export class PgDbClient extends DbClient<DbType.postgres> {
    private _config: PgDbConfig;
    constructor(
        _config: PgDbConfig
    ) {
        super(_config);
        this._config = _config;
    }
    _connect(): BPromise<PgDbInstance> {
        let db = new PgDbInstance(this._config);
        return BPromise.resolve(db);
    }
    _driver() {
//         import("pg")
//             .then((Pg) => {
//             });
    }
}

export class PgDbInstance extends DbInstance<PgDbInstance> {
    constructor(
        private _config: PgDbConfig
    ) {
        super(_config);
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
