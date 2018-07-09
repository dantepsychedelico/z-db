
import { LazyDep } from './lazy-dep';

export const DB_TYPE = {
    postgres: Symbol.for('postgres'),
    sqlite: Symbol.for('sqlite'),
    oracledb: Symbol.for('oracledb'),
    mssql: Symbol.for('mssql'),
    mongo: Symbol.for('mongo'),
    cassandra: Symbol.for('cassandra'),
};

export { LazyDep };
