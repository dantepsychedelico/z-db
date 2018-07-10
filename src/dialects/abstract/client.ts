

import { DB_TYPE } from '../../utils';
import * as BPromise from 'bluebird';

export interface DbConfig {
    debug: boolean;
}

export type DbRow = {
    [propName: string]: any
}

export interface DbResult {
    rows: DbRow[];
}

export abstract class DbClient<T extends DbClient<any>> {
    constructor(
        readonly _config: DbConfig
    ) {}
    connect(): BPromise<T> {
        return this._connect();
    }
    abstract _connect(): BPromise<T>;
    abstract _driver(): void;
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

