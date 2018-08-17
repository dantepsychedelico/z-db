
import * as os from 'os';

let postgres = { 
    user: (process.env.DB_PG_USER || 'postgres'),
    password: (process.env.DB_PG_PASSWORD || null),
    host: (process.env.DB_PG_ADDR || 'localhost'),
    port: (process.env.DB_PG_PORT || 5432),
    database: (process.env.DB_PG_DATABASE_NAME || 'zdb-test'),
    application_name: (process.env.DB_PG_APPNAME || `zdb-test-(${os.platform()}-${os.userInfo().username})`)
};

let sqlite = {
    database: 'zdb-test.db'
};

let mssql = {
    user: (process.env.DB_MSSQL_USER || 'SA'),
    password: (process.env.DB_MSSQL_PASSWORD || null),
    server: (process.env.DB_MSSQL_ADDR || 'localhost'),
    port: (process.env.DB_MSSQL_PORT || 1433),
    database: (process.env.DATABASE_NAME || 'meanTest'),
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
    }
};

let oracledb = {
    user: (process.env.DB_ORACLE_USER || 'SYSTEM'),
    password: (process.env.DB_ORACLE_PASSWORD || null),
    connectString: `
    (DESCRIPTION = 
        (ADDRESS_LIST =
            (ADDRESS =
                (PROTOCOL = TCP)
                (HOST =${process.env.DB_ORACLE_ADDR || 'localhost'}) 
                (PORT = ${process.env.DB_ORACLE_PORT || 1521})
            )
        )
        (CONNECT_DATA =
            (SID = ${process.env.DB_ORACLE_DATABASE_NAME || 'XE'})
        )
    )`.trim(),
    poolAlias: (process.env.DB_ORACLE_APPNAME || `zdb-test(${os.platform()}-${os.userInfo().username})`),
    poolMax: 128,
    poolTimeout: 120,
    maxRows: 0,
    outFormat: 4002,
//     _enableStats: true
};

export { postgres, sqlite, mssql, oracledb };
