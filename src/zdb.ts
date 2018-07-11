
import { 
    DbConfig, DbClient, 
    PgDbClient, PgDbConfig, 
    SqliteDbClient, SqliteDbConfig 
} from './dialects';
import { DB_TYPE } from './utils';
import * as BPromise from 'bluebird';


export class Zdb<TDbClient extends DbClient, TDbConfig extends DbConfig> {
    constructor(
        private _Client: new (_config: TDbConfig) => TDbClient,
        private _config: TDbConfig
    ) {}
    connect(): BPromise<TDbClient> {
        let client = new this._Client(this._config);
        return client.connect();
    }
};

export { DB_TYPE, DbClient, DbConfig, PgDbClient, PgDbConfig, SqliteDbClient, SqliteDbConfig };
