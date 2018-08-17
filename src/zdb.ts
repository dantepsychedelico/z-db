
import "reflect-metadata";
import { 
    DbConfig, DbBase, 
    PgDbClient, PgDbConfig, 
    SqliteDbClient, SqliteDbConfig 
} from './dialects';
import { DB_TYPE } from './utils';
import { Space, table } from './schema';
import * as BPromise from 'bluebird';


export class Zdb<TDbClient extends DbBase, TDbConfig extends DbConfig> {
    constructor(
        private _Client: new (_config: TDbConfig) => TDbClient,
        private _config: TDbConfig
    ) {}
    connect(): BPromise<TDbClient> {
        let client = new this._Client(this._config);
        return client.connect();
    }
};
