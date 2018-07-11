

import { DB_TYPE } from '../../utils';
import * as BPromise from 'bluebird';

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

export interface IQryParamObj {
    [prop: string]: any
}

export interface IQryOpt {
    debug: boolean;
}

export abstract class DbClient {
    private _isConnected: boolean;
    private _isBegined: boolean;
    constructor(
        readonly _config: DbConfig
    ) {
        this._isConnected = false;
        this._isBegined = false;
    }
    connect(): BPromise<this> {
        if (this._isConnected) {
            return BPromise.reject('ALSO CONNECTED');
        }
        this._isConnected = true;
        return this._connect();
    }
    abstract _connect(): BPromise<this>;
    query(sql: string, params: IQryParamObj = {}, options: IQryOpt = { debug: false }): BPromise<DbResult> {
        if (!this._isConnected) {
            return BPromise.reject('NOT CONNECTED');
        }
        return this._query(sql, params);
    }
    abstract _query(sql: string, params: IQryParamObj): BPromise<DbResult>;
    close(): BPromise<this> {
        if (!this._isConnected) {
            return BPromise.reject('NOT CONNECTED');
        }
        if (this._isBegined) {
            return BPromise.reject('ALSO BEGIN');
        }
        return this._close()
            .then((client) => {
                this._isConnected = false;
                return client;
            });
    }
    abstract _close(): BPromise<this>;
    begin(): BPromise<DbResult> {
        if (!this._isConnected) {
            return BPromise.reject('NOT CONNECTED');
        }
        if (this._isBegined) {
            return BPromise.reject('HAVE BEEN BEGIN');
        }
        this._isBegined = true;
        return this._begin()
        .catch((err) => {
            this._isBegined = false;
            return BPromise.reject(err);
        });
    }
    abstract _begin(): BPromise<DbResult>;
    commit(): BPromise<this> {
        if (!this._isBegined) {
            return BPromise.reject('NO BEGIN');
        }
        this._isBegined = false;
        return this._commit();
    }
    abstract _commit(): BPromise<this>;
    rollback(): BPromise<this> {
        if (!this._isBegined) {
            return BPromise.reject('NO BEGIN');
        }
        this._isBegined = false;
        return this._rollback();
    }
    abstract _rollback(): BPromise<this>;
}

