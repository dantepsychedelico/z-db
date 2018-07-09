

import { DB_TYPE } from '../../utils';
import * as Bb from 'bluebird';

export interface DbConfig {
    readonly dbType: Symbol;
    debug?: boolean;
}

export type DbRow = {
    [propName: string]: any
}

export interface DbResult {
    rows: DbRow[];
}

export abstract class DbClient {
    constructor(
        private _config: DbConfig
    ) {}
    connect(): Bb<DbInstance> {
        return this._connect();
    }
    abstract _connect(): Bb<DbInstance>;
    abstract _driver(): void;
}

export abstract class DbInstance {
    constructor(
        private _config: DbConfig
    ) {}
    abstract query(sql: string, params: any[], options?: any): Bb<DbResult>;
    close(): Bb<DbInstance> {
        return this._close();
    }
    abstract _close(): Bb<DbInstance>;
    begin(): Bb<DbResult> {
        return this._begin();
    }
    abstract _begin(): Bb<DbResult>;
    commit(): Bb<DbInstance> {
        return this._commit();
    }
    abstract _commit(): Bb<DbInstance>;
    rollback(): Bb<DbInstance> {
        return this._rollback();
    }
    abstract _rollback(): Bb<DbInstance>;
}

