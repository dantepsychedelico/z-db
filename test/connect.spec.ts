'use strict';
/* process unit test */

import { Zdb, DB_TYPE, PgDbClient, PgDbConfig } from '../src/zdb';
import * as chai from 'chai';
import * as _ from 'lodash';

let should = chai.should();

describe('test connection', () => {
    it('postgres', () => {
        let zdb = new PgDbClient({ host: 'localhost', port: 5432, user: 'postgres', password: null, database: 'zdb-test', debug: false });
//         let zdb = new Zdb<PgDbClient>({ host: 'localhost', port: 5432, user: 'postgres', password: null, database: 'zdb-test' })
        return zdb.connect()
            .then((db) => {
                return db.close();
            });
    });
//     it('mssql', () => {
//         let zdb = new Zdb<PgDbClient>({ dbType: DB_TYPE.mssql })
//         return zdb.connect()
//             .then((db) => {
//                 return db.close();
//             });
//     });
});
