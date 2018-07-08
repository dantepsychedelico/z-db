
import { DbConfig } from './dialects/abstract';
import { DB_TYPE } from './utils';

export class Zdb {
    constructor(
        private _config: DbConfig
    ) {
        if (_config.database === DB_TYPE.postgres) { // bad setting(dynamic type return)
        }
    }
};

export { DB_TYPE };
