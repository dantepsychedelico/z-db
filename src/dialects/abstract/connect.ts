

import { DB_TYPE } from '../../utils';
import * as BPromise from 'bluebird';

const enum DbType {
    postgres
}

export interface DbConfig<T> {
    readonly dbType: Symbol;
    debug?: boolean;
}

export type DbRow = {
    [propName: string]: any
}

export interface DbResult {
    rows: DbRow[];
}

export abstract class DbClient<T> {
    constructor(
        private _config: DbConfig<T>
    ) {}
    connect(): BPromise<DbInstance<T>> {
        return this._connect();
    }
    abstract _connect(): BPromise<DbInstance<T>>;
    abstract _driver(): void;
}

export abstract class DbInstance<T extends DbInstance<any>> {
    constructor(
        private _config: DbConfig
    ) {}
    abstract query(sql: string, params: any[], options?: any): BPromise<DbResult>;
    close(): BPromise<T> {
        return this._close();
    }
    abstract _close(): BPromise<T>;
    begin(): BPromise<DbResult> {
        return this._begin();
    }
    abstract _begin(): BPromise<DbResult>;
    commit(): BPromise<T> {
        return this._commit();
    }
    abstract _commit(): BPromise<T>;
    rollback(): BPromise<T> {
        return this._rollback();
    }
    abstract _rollback(): BPromise<T>;
}

