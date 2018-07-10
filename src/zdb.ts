
import { DbConfig, DbClient, PgDbClient, PgDbConfig } from './dialects';
import { DB_TYPE } from './utils';
import * as BPromise from 'bluebird';

export class Zdb<P extends DbConfig, T extends DbClient<T, P>> {
    private client: DbClient<T, P>;
    constructor(
        private _config: P
    ) {}
    connect(): BPromise<DbClient<T, P>> {
        return this.client.connect();
    }
};

export { DB_TYPE, PgDbClient, PgDbConfig };
