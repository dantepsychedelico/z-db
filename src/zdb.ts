
import { DbConfig, DbClient, PgDbClient, IPgDbConfig } from './dialects';
import { DB_TYPE } from './utils';
import * as BPromise from 'bluebird';
import { Container } from 'inversify';

const container = new Container();

export class Zdb<T extends DbClient<T>> {
    constructor(
    ) {
//         container.bind<PgDbClient>(DB_TYPE.postgres).to(PgDbClient);
    }
    connect(): BPromise<any> {
        return BPromise.resolve();
//         return BPromise<T>
//         return this.client.connect();
    }
};

export { DB_TYPE, PgDbClient, IPgDbConfig };
