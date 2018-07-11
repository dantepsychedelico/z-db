'use strict';
/* process unit test */

import { Zdb, DB_TYPE, PgDbClient, PgDbConfig, SqliteDbClient, SqliteDbConfig } from '../src/zdb';
import * as chai from 'chai';
import * as _ from 'lodash';

let should = chai.should();

describe('test connection', () => {
    it('postgres', () => {
        let pgDb = new Zdb(PgDbClient, { 
            dbType: DB_TYPE.postgres, 
            config: { host: 'localhost', user: 'postgres', database: 'zdb-test' },
            debug: false
        });
        return pgDb.connect()
            .then((db) => {
                return db.close();
            });
    });
    it('sqlite', () => {
        let zdb = new Zdb(SqliteDbClient, { 
            dbType: DB_TYPE.sqlite,
            config: { filename: 'zdb-test.db' }
        })
        return zdb.connect()
            .then((db) => {
                return db.close();
            });
    });
});
