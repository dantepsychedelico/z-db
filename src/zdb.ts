
import { DbConfig, DbClient, PgDbClient, IPgDbConfig } from './dialects';
import { DB_TYPE } from './utils';
import * as BPromise from 'bluebird';


export class Zdb<TDbClient extends DbClient<TDbClient>, TDbConfig extends DbConfig> {
    readonly client: TDbClient;
    constructor(
        private dbClient: new (_config: TDbConfig) => TDbClient,
        private _config: TDbConfig
    ) {
        this.client = new dbClient(_config);
    }
    connect(): BPromise<TDbClient> {
        return BPromise.resolve(this.client);
    }
};

export { DB_TYPE, PgDbClient, IPgDbConfig };
