
import { LazyDep } from './lazy-dep';

export const DB_TYPE = {
    postgres: Symbol.for('postgres'),
    sqlite: Symbol.for('sqlite'),
    oracledb: Symbol.for('oracledb'),
    mssql: Symbol.for('mssql'),
    mongo: Symbol.for('mongo'),
    cassandra: Symbol.for('cassandra'),
};

export function nonEnum(target: any, key: string) {
    Object.defineProperty(target, key, {
        enumerable: false,
        configurable: true,
        writable: true
    });
}

export { LazyDep };
