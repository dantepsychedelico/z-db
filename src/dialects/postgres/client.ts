
import { injectable, inject } from 'inversify';
import * as BPromise from 'bluebird';
import { DbClient, DbConfig, DbResult } from '../abstract';
import { DB_TYPE } from '../../utils';

export interface IPgDbConfig extends DbConfig {
    readonly host: string;
    readonly port: number;
    readonly user: string;
    readonly password: string;
    readonly database: string;
    debug: boolean;
}

// export class PgDbConfig implements IPgDbConfig {
//     readonly host: string;
//     readonly port: number;
//     readonly user: string;
//     readonly password: string;
//     readonly database: string;
//     debug: boolean;
//     constructor(_config: {
//         host?: string,
//         port?: number,
//         user?: string,
//         password?: string,
//         database?: string,
//         debug?: string
//     }){
//     }
// }

export class PgDbClient extends DbClient<PgDbClient> {
    constructor(
        readonly _config: IPgDbConfig
    ) {
        super(_config);
    }
    _connect(): BPromise<PgDbClient> {
        return BPromise.resolve(this);
    }
    _driver() {
//         import("pg")
//             .then((pg) => {
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
