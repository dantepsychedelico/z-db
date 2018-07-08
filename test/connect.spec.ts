'use strict';
/* process unit test */

import { Zdb, DB_TYPE } from '../src/zdb';
import * as chai from 'chai';
import * as _ from 'lodash';

let should = chai.should();

describe('test connection', () => {
    it('postgres', () => {
        let zdb = new Zdb({ dbType: DB_TYPE.postgres })
        return zdb.connect()
            .then((db) => {
                return db.close();
            });
    });
    it('mssql', () => {
        let zdb = new Zdb({ dbType: DB_TYPE.mssql })
        return zdb.connect()
            .then((db) => {
                return db.close();
            });
    });
});
