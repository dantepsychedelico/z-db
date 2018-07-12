
import * as BPromise from 'bluebird';
import { DbBase, DbConfig, DbResult, IQryParamObj, IQryOpt } from '../abstract';
import { DB_TYPE } from '../../utils';
import { PoolConfig, Pool, PoolClient } from 'pg';
import * as _ from 'lodash';

export class PgDbConfig implements DbConfig {
    dbType: Symbol = DB_TYPE.postgres;
    debug?: boolean = false;
    constructor(public config: PoolConfig) {}
}

export class PgDbClient extends DbBase {
    private client: PoolClient;
    private pool: Pool;
    constructor(
        protected readonly _config: PgDbConfig
    ) {
        super(_config);
    }
    private transpostSql(sql: string, params: IQryParamObj = {}): { sql: string, params: any[] } {
        let p = [];
        let keys = [...Object.keys(params), '[\\w]+'];
        let re = new RegExp('\\$('+keys.join('|')+')(?=[,): \n\r]|$)', 'g');
        sql = sql.replace(re, function(m, key) {
            if (key in params) {
                p.push(params[key]);
            } else {
                p.push(null);
            }
            return '$'+p.length;
        });
        return { sql, params: p };
    }
    _connect() {
        this.pool = new Pool(this._config.config);
        return BPromise.resolve(this.pool.connect())
            .then((client) => {
                this.client = client;
                return this;
            });
    }
    _query(sql: string, params: IQryParamObj): BPromise<DbResult> {
        let tSql = this.transpostSql(sql, params);
        return BPromise.resolve(
            this.client.query(tSql.sql, tSql.params)
        );
    }
    _close() {
        return BPromise.resolve(this.client.release())
            .then(() => this);
    }
    _begin() {
        return this.query('BEGIN');
    }
    _commit() {
        return this.query('COMMIT')
            .then(() => this);
    }
    _rollback() {
        return this.query('ROLLBACK')
            .then(() => this);
    }
}
