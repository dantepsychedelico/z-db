
import * as pz from 'pluralize';
import { forEach, map, isPlainObject } from 'lodash';
import { LazyDep } from '../utils';

const ERR_NOT_FOUND_THIS_ELEM_IN_CST = 'NOT FOUND THIS ELEM IN CST';
const ERR_ALWAYS_ADD_IN_ELEM = 'ALWAYS ADD IN ELEM';
const ERR_INVALID_CST_TYPE = 'INVALID CST TYPE';
const DB_TYPE_ORACLE = 'oracle';
const DB_TYPE_POSTGRES = 'postgres';
const DB_TYPE_SQLITE = 'sqlite';
const DB_TYPE_MSSQL = 'mssql';

const CST_PKEY = 'PKEY';
const CST_UNIQUE = 'UNIQUE';
const CST_FKEY = 'FKEY';
const CST_NOT_NULL = 'NOT NULL';
const CST_DEFAULT = 'DEFAULT';

export function isIElemDefType(eDefType: string | IElemDefType): eDefType is IElemDefType{
    return isPlainObject(eDefType);
}

export const enum ETYPE {
    UUID = 'uuid',
    TEXT = 'text',
};

export const enum CTYPE {
    PKEY,
    FKEY,
    UNIQUE,
    NOTNULL,
    DEFAULT,
};

export interface ICstDef {
    name: string;
    type: CTYPE;
    elems: Elem[];
}

const enum IEDefKind {
    BASE, FP, FC
}

interface IEDefBase {
    name: string;
    type: IElemDefType;
    csts?: Cst[];
};

/**
 * IEDefFP
 * Interface Element Definition of Foreign Parent
 */
interface IEDefFP {
    name: string;
    fElem: Elem;
}

/**
 * IEDefFC
 * Interface Element Definition of Foreign Children
 */
interface IEDefFC {
    name: string;
    pElem: Elem;
    fElem: Elem;
}

type IEDef = IEDefBase | IEDefFP | IEDefFC;

function isIEDefBase(eDef: IEDef): eDef is IEDefBase {
    return 'type' in eDef;
}

function isIEDefFC(eDef: IEDef): eDef is IEDefFC {
    return 'pElem' in eDef;
}
/**
 * IElemDefType
 */
export interface IElemDefType {
    js: string;
    postgres?: string;
    mssql?: string;
    sqlite?: string;
    oracle?: string;
}

/**
 * IElemDefBase
 */
interface IElemDefBase {
    name: string;
    type: string | IElemDefType;
}

/**
 * IElemDefFP
 * Interface Element Definition Foreign Parent
 */
interface IElemDefFP {
    name: string;
    ftName: string;
    fName: string;
}

/**
 * IElemDefFC
 * Interface Element Definition Foreign Child
 */
interface IElemDefFC {
    name: string;
    pName: string;
    fName: string;
}

export type IElemDef = IElemDefBase | IElemDefFP | IElemDefFC;

export function isIElemDefBase(eDef: IElemDef): eDef is IElemDefBase{
    return 'type' in eDef;
}

export function isIElemDefFC(eDef: IElemDef): eDef is IElemDefFC{
    return 'pName' in eDef;
}


export class Elem {
    public readonly tname: string;
    public readonly model: Model;
    public readonly type: IElemDefType;
    public readonly name: string;
    public readonly felem: Elem;
    public readonly pelem: Elem;
    public csts: Cst[] = [];
    constructor(model: Model, eDef: IEDef) {
        this.model = model;
        this.tname = model.tname;
        this.name = eDef.name.trim().toLowerCase();
        if (isIEDefBase(eDef)) {
            this.type = eDef.type;
        } else if (isIEDefFC(eDef)) {
            this.felem = eDef.fElem;
            this.pelem = eDef.pElem;
            this.type = eDef.fElem.type;
        } else { // isIEDefFP
            this.felem = eDef.fElem;
            this.type = eDef.fElem.type;
        }
    }
    addCst(cst: Cst): this {
        if (!cst.elems.includes(this)) {
            throw new Error(ERR_NOT_FOUND_THIS_ELEM_IN_CST);
        }
        if (this.csts.includes(cst)) {
            throw new Error(ERR_ALWAYS_ADD_IN_ELEM);
        }
        let cTypes = map(this.csts, 'type');
        if (cst.type === CTYPE.PKEY) {
            if (cTypes.includes(CTYPE.PKEY)) {
                throw new Error(ERR_INVALID_CST_TYPE);
            }
        } else if (cst.type === CTYPE.DEFAULT) {
            if (cTypes.includes(CTYPE.PKEY)) {
                throw new Error(ERR_INVALID_CST_TYPE);
            }
        } else if (cst.type === CTYPE.NOTNULL) {
            if (cTypes.includes(CTYPE.NOTNULL)) {
                throw new Error(ERR_INVALID_CST_TYPE);
            }
        }
        this.csts.push(cst);
        return this;
    }
//     __init(def) {
//         if (!def) throw new Error(`NOT SET def FOR ${this.tname}`);
//         if ((!def.type && !def.fkey) || !def.name) throw new Error(`def of ${this.tname} NO SET type(${def.type}) and name(${def.name})`);
//         this.type = def.type ? def.type.trim().toLowerCase() : def.type;
//         this.name = def.name;
//         if (def.oracleType) this.oracleType = def.oracleType.trim().toLowerCase();
//         if (def.mssqlType) this.mssqlType = def.mssqlType.trim().toLowerCase();
//         return this;
//     }
//     __initCsts (types) {
//         if (!types) return this;
//         if (typeof types === 'string') this.csts = [ types.toUpperCase() ];
//         else if (types instanceof Array) this.csts = types.map((type) => type.toUpperCase());
//         else throw new Error(`Type Of ${this.spath} faild`);
//         if (this.csts.includes(CST_PKEY)) {
//             if (this.csts.length > 1) throw new Error(`PRIMARY KEY ${this.spath} CANNOT REFERENCE TO OTHER TABLE`);
//             this.csts = [CST_PKEY];
//             this.pkey = true;
//         }
//         return this;
//     }
//     __initForeignKey (fcol, ftname, parentKey) {
//         if (!fcol && !ftname && !parentKey) return this.register([()=> this]);
//         if (!fcol) throw new Error(`NO SET fkey FOR ${this.spath}`);
//         if (ftname && parentKey) {
//             throw new Error(`DOUBLE SET tname and pkey for ${this.spath}`);
//         }
//         this.fcol = fcol;
//         if (ftname) {
//             return this.__initParentKey(ftname);
//         }
//         if (parentKey) {
//             return this.__initChildKey(parentKey);
//         }
//     }
//     __initParentKey (ftname) {
//         this.ftname = ftname;
//         this.childKeys = [];
//         Elem.resolve([`${ftname}.${this.fcol}`, (elem) => {
//             if (!elem.canRef) throw new Error(`the Elem ${elem.spath} can not Reference`);
//             elem.cstFkeys = (elem.cstFkeys || []).concat(this);
//             this.type = elem.type;
//             return this.register([() => this]);
//         }]);
//         return this;
//     }
//     __initChildKey (parentKey) {
//         this.parentKey = parentKey;
//         Elem.resolve([`${this.tname}.${parentKey}`, (parentElem) => {
//             if (_.find(parentElem.childKeys, { fcol: this.fcol, ftname: parentElem.ftname })) {
//                 throw new Error(`childKeys double two same ${parentElem.ftname}.${this.fcol} of ${this.spath}`);
//             }
//             Elem.resolve([`${parentElem.ftname}.${this.fcol}`, (fElem) => {
//                 parentElem.childKeys = (parentElem.childKeys || []).concat(this);
//                 this.type = fElem.type;
//                 this.ftname = fElem.tname;
//                 if (parentElem.isNotNull() && fElem.isNotNull() && !this.isNotNull()) {
//                     this.csts = (this.csts || []).concat(CST_NOT_NULL);
//                 }
//                 return this.register([() => this]);
//             }]);
//         }]);
//         return this;
//     }
//     register(deps) {
//         if (m.elem(this.path)) throw new Error('SECOND REGISTER MODEL');
//         Elem.resolve(deps, (run, elems, cb) => {
//             if (run) {
//                 (m.model() || new Model(this.tname)).addElem(this);
//                 cb.apply(null, elems);
//                 _.forEach(unresolved[this.spath], (callback) => callback());
//                 delete unresolved[this.spath]
//             }
//         });
//         return this;
//     }
//     static resolve(deps, callback) {
//         var cb = deps.pop();
//         if (typeof cb !== 'function') throw new Error('Elem.resolve last dep ${deps} not callback');
//         var run = true;
//         var elems = [];
//         _.forEach(deps, (dep) => {
//             var elem = m.elem(dep);
//             if (!elem) {
//                 unresolved[dep] = (unresolved[dep]||[]).concat(() => {
//                     return Elem.resolve(deps.concat(cb));
//                 });
//                 run = false;
//             } else {
//                 elems.push(elem);
//             }
//         });
//         if (run && !callback) cb.apply(null, elems);
//         else if (callback) callback(run, elems, cb);
//     }
//     getRootElem () {
//         if (this.ftname) {
//             return m.model(this.ftname).elem(this.fcol).getRootElem();
//         }
//         return this;
//     }
//     isDate() {
//         return this.type === 'date' || this.type === 'timestamp' || this.type === 'time';
//     }
//     isUniq() {
//         return (this.csts || []).includes(CST_UNIQUE);
//     }
//     isNotNull() {
//         return (this.csts || []).includes(CST_NOT_NULL);
//     }
//     get spath () {
//         return `${this.tname}.${this.name}`;
//     }
//     get path () {
//         return [this.tname, this.name];
//     }
//     get canRef () {
//         return (this.pkey || (this.csts||[]).indexOf(CST_UNIQUE) >= 0);
//     }
//     /**
//      * @returns Elem[];
//      */
//     getChildrenIsUniq() {
//         return _.filter(this.childKeys, (elem) => {
//             return m.model(elem.ftname).elem(elem.fcol).isUniq();
//         });
//     }
//     scst(database) {
//         if (database === DB_TYPE_ORACLE) {
//             if (this.pkey) {
//                 return 'PRIMARY KEY';
//             } else if (this.csts && this.csts.length) {
//                 return _.orderBy(this.csts, (cst) => {
//                     return (cst.trim().toUpperCase().startsWith('DEFAULT')) ? 0 : 1;
//                 }).map((cst) => {
//                     switch (cst.trim().toUpperCase()){
//                         case 'DEFAULT NOW()':
//                             return 'DEFAULT LOCALTIMESTAMP';
//                         case 'DEFAULT TRUE':
//                             return `DEFAULT 'T'`;
//                         case 'DEFAULT FALSE':
//                             return `DEFAULT 'F'`;
//                         default:
//                             return cst;
//                     }
//                 }).join(' ');
//             }
//             else {
//                 return '';
//             }
//         } else if (database === DB_TYPE_MSSQL) {
//             if (this.pkey) {
//                 return 'PRIMARY KEY';
//             }
//             else if (this.csts && this.csts.length) {
//                 return _.orderBy(this.csts, (cst) => {
//                     return (cst.trim().toUpperCase().startsWith('DEFAULT')) ? 0 : 1;
//                 }).map((cst) => {
//                     switch (cst.trim().toUpperCase()){
//                         case 'DEFAULT NOW()':
//                             return 'DEFAULT GETDATE()';
//                         case 'DEFAULT TRUE':
//                             return `DEFAULT 'T'`;
//                         case 'DEFAULT FALSE':
//                             return `DEFAULT 'F'`;
//                         default:
//                             return cst;
//                     }
//                 }).join(' ');
//             }
//             else {
//                 return '';
//             }
//         } else if (database === DB_TYPE_SQLITE) {
//             if (this.pkey) {
//                 return 'PRIMARY KEY NOT NULL';
//             }
//             else if (this.csts && this.csts.length) {
//                 return this.csts.map((cst) => {
//                     if (cst.trim().toUpperCase() === 'DEFAULT NOW()') {
//                         return 'DEFAULT CURRENT_TIMESTAMP';
//                     } else {
//                         return cst;
//                     }
//                 }).join(' ');
//             }
//             else {
//                 return '';
//             }
//         } else {
//             if (this.pkey) {
//                 return 'PRIMARY KEY';
//             }
//             else if (this.csts && this.csts.length) {
//                 return this.csts.join(' ');
//             }
//             else {
//                 return '';
//             }
//         }
//     }
//     sDef(database) {
//         if (database === DB_TYPE_ORACLE) {
//             if (this.oracleType) {
//                 return `${this.name} ${this.oracleType} ${this.scst(database)}`;
//             } else {
//                 return `${this.name} ${DbOracle.getDbType(this.type)} ${this.scst(database)}`;
//             }
//         } else if (database === DB_TYPE_MSSQL) {
//             if (this.mssqlType) {
//                 return `${this.name} ${this.mssqlType} ${this.scst(database)}`;
//             } else {
//                 return `${this.name} ${DbMsSql.getDbType(this.type)} ${this.scst(database)}`;
//             }
//         } else if (database === DB_TYPE_SQLITE) {
//             return `${this.name} ${DbSqlite.getDbType(this.type)} ${this.scst(database)}`;
//         } else {
//             return `${this.name} ${this.type} ${this.scst(database)}`;
//         }
//     }
//     bindInOracleType(d) {
//         if (this.oracleType) {
//             return DbOracle.bindInWithType(this.oracleType.toLowerCase(), d);
//         } else {
//             return DbOracle.bindInWithType(DbOracle.getDbType(this.type).toLowerCase(), d);
//         }
//     }
}

export class Cst {
    public readonly tname: string;
    public readonly type: CTYPE;
    public readonly name: string;
    public readonly model: Model;
    public readonly elems: Elem[];
    constructor(model: Model, cDef: ICstDef) {
        this.model = model;
        this.tname = model.tname;
        this.name = cDef.name.toLowerCase();
        this.elems = cDef.elems;
        this.type = cDef.type;
        forEach(this.elems, (elem) => {
            elem.addCst(this);
        });
//         this.elems = elems.sort((elem) => `${elem.tname}_${elem.name}`);
//         this.name = `${this.mixName}_${this.type}`;
    }
//     set type (type) {
//         switch (type.toLowerCase()) {
//             case 'pkey':
//                 this._type = CST_PKEY;
//                 break;
//             case 'unique':
//                 this._type = CST_UNIQUE;
//                 break;
//             case 'fkey':
//                 this._type = CST_FKEY;
//                 break;
//             case 'not null':
//                 this._type = CST_NOT_NULL;
//                 break;
//             default:
//                 throw new Error(`Cst type Error ${type}`);
//         }
//     }
//     get type () {
//         return this._type;
//     }
//     get mixName() {
//         return this.elems.map((e) => {
//             return `${e.tname}_${e.name}`;
//         }).join('_');
//     }
//     sDef(database = DB_TYPE_POSTGRES) {
//         if (database === DB_TYPE_ORACLE) {
//             if (this.type === CST_UNIQUE) return `${this.type}(${this.elems.map((e)=>e.name).join(', ')})`;
//         } else if (database === DB_TYPE_MSSQL) {
//             if (this.type === CST_UNIQUE) return `${this.type}(${this.elems.map((e)=>e.name).join(', ')})`;
//         } else if (database === DB_TYPE_SQLITE) {
//             if (this.type === CST_UNIQUE) return `${this.type}(${this.elems.map((e)=>e.name).join(', ')})`;
//         } else {
//             if (this.type === CST_UNIQUE) return `${this.type}(${this.elems.map((e)=>e.name).join(', ')})`;
//         }
//     }
}

export interface IModelOpt {
    is_temp?: boolean;
}

export class Model {
    public readonly tname: string;
    public readonly is_temp: boolean = false;
    private __elems: { [name: string]: Elem };
    private __csts: { [name: string]: Cst };
    constructor (tname: string, options: IModelOpt = {}) {
        if (options.is_temp) {
            this.is_temp = true;
//             this.vNames = {};   //virtual names eg: 'id': 'foo.id', 'no': 'goo.no' 
//             this.alias = {};    // table alias mapping
        } else {
//             if (_models[tname]) return _models[tname];
//             _models[tname] = this;
        }
        this.tname = tname.toLowerCase();
    }
    addElem(elem: Elem): Model {
        if (elem.name in this.__elems) {
            throw new Error(`SECOND ADD ELEM FOR ${this.tname}.${elem.name}`);
        }
        this.__elems[elem.name] = elem;
        return this;
    }
    createElem(eDef: IEDef): Elem {
        let elem = new Elem(this, eDef);
        return elem;
    }
    addCst(cst: Cst): Model {
        if (this.__csts[cst.name]) {
            throw new Error(`SECOND ADD CST FOR ${cst.name}[${cst.type}]`);
        }
        this.__csts[cst.name] = cst;
        return this;
    }
    createCst(cDef: ICstDef): Cst {
        let cst: Cst;
        if (cDef.name in this.__csts) {
            cst = this.__csts[cDef.name];
        } else {
            cst = this.__csts[cDef.name] = new Cst(this, cDef);
        }
        return cst;
    }
//     getElemIsFkeys () {
//         return Array.from(_.reduce(this.elems, (ss, elem) => {
//             if ('ftname' in elem && 'childKeys' in elem) {
//                 ss.add(elem);
//             }
//             return ss;
//         }, new Set()));
//     }
//     getCstFelems () {
//         return Array.from(_.reduce(this.elems, (ss, elem) => {
//             _.forEach(elem.cstFkeys, (fElem) => {
//                 ss.add(fElem);
//             });
//             return ss;
//         }, new Set()));
//     }
//     get fKeys() {
//         if (!this.__fkeys) {
//             this.__fkeys = Array.from(_.reduce(this.elems, (ss, elem) => {
//                 if (elem.cstFkeys && elem.cstFkeys.length) ss.add(elem.name);
//                 _.forEach(elem.cstFkeys, (fElem) => {
//                     _.forEach(fElem.childKeys, (childElem) => {
//                         if (childElem.ftname === this.tname) {
//                             ss.add(childElem.fcol);
//                         }
//                     });
//                 });
//                 return ss;
//             }, new Set()));
//         }
//         return _.clone(this.__fkeys);
//     }
//     /* get model primary key */
//     get pKeys() {
//         if (!this.__pkeys) {
//             let ss = new Set();
//             _.forOwn(this.elems, (elem) => {
//                 if (elem.pkey) ss.add(elem.name);
//             });
//             _.forOwn(this.csts, (cst) => {
//                 if (cst.type === CST_PKEY) {
//                     _.forEach(cst.elems, (elem) => {
//                         ss.add(elem.name);
//                     });
//                 }
//             });
//             this.__pkeys = Array.from(ss);
//         }
//         return _.clone(this.__pkeys);
//     }
//     dbCreate (db, options = {}) {
//         const { database } = db;
//         const { DEBUG } = options;
//         if (this.sDef(database)) {
//             if (DEBUG) console.log(this.sDef(database));
//             return Q.fcall(() => {
//                 if (database === DB_TYPE_MSSQL) {
//                     return db.querySql('SELECT * FROM sysobjects WHERE name = $name AND xtype = $xtype', {
//                             name: this.tname,
//                             xtype: 'U'
//                     })
//                     .then((r) => {
//                         if (!r.rows.length) return db.querySql(this.sDef(database))
//                     })
//                 } else {
//                     return db.querySql(this.sDef(database))
//                 }
//             })
//             .then(() => this.deferred.resolve())
//             .catch((err) => {
//                 if (database === DB_TYPE_ORACLE) {
//                     if (err.message.startsWith('ORA-00955')) {
//                         console.log(`[WARN] ${err.message}`);
//                         return this.deferred.resolve();
//                     }
//                 }
//                 if (database === DB_TYPE_MSSQL) {
//                     if (err.number === 2714) {
//                         console.log(`[WARN] ${err.message}`);
//                         return this.deferred.resolve();
//                     }
//                 }
//                 if (database === DB_TYPE_SQLITE) {
//                     if (err.message.endsWith('already exists')) {
//                         console.log(`[WARN] ${err.message}`);
//                         return this.deferred.resolve();
//                     }
//                 }
//                 this.deferred.reject(err);
//                 throw err;
//             });
//         } else {
//             return new Q();
//         }
//     }
//     elem (name) {
//         if (this.is_temp) {
//             if (name in this.vNames) return this.elems[this.vNames[name]];
//             else return this.elems[name];
//         } else {
//             return this.elems[name];
//         }
//     }
//     getName (name) {
//         if (this.is_temp && name in this.vNames && this.vNames[name] in this.elems) {
//             return this.vNames[name];
//         }
//         return (name in this.elems) ? name : null;
//     }
//     isEmpty (params, key) {
//         return params[key] === null || params[key] === undefined || params[key] === '';
//     }
//     sDef(database = DB_TYPE_POSTGRES) {
//         if (database === DB_TYPE_ORACLE || database === DB_TYPE_MSSQL) {
//             let fields = _.map(this.elems, (elem) => elem.sDef(database));
//             if (fields.length) {
//                 return `CREATE TABLE ${this.tname} 
//                     (${fields.concat(this.cstDefs(database)).join(', ')})`;
//             } else {
//                 return '';
//             }
//         } else if (database === DB_TYPE_SQLITE) {
//             let fields = _.map(this.elems, (elem) => elem.sDef(database));
//             if (fields.length) {
//                 return `CREATE TABLE ${this.tname} 
//                     (${fields.concat(this.cstDefs(database)).join(', ')})`;
//             } else {
//                 return '';
//             }
//         } else {
//             let fields = _.map(this.elems, (elem) => elem.sDef(database));
//             if (fields.length) {
//                 return `CREATE TABLE IF NOT EXISTS ${this.tname} 
//                     (${fields.concat(this.cstDefs(database)).join(', ')})`;
//             } else {
//                 return '';
//             }
//         }
//     }
//     cstDefs (database) {
//         if (database === DB_TYPE_ORACLE) {
//             return _.map(this.csts, (cst) => cst.sDef(database));
//         } else if (database === DB_TYPE_MSSQL) {
//             return _.map(this.csts, (cst) => cst.sDef(database));
//         } else if (database === DB_TYPE_SQLITE) {
//             return _.map(this.csts, (cst) => cst.sDef(database));
//         } else {
//             return _.map(this.csts, (cst) => cst.sDef(database));
//         }
//     }
    /*
     * tname
     * tkey
     * key      key of model
     * options.as
     * options.jtype
     * options.self_as
     */
//     join(tname, tkey, key, options = {}) {
//         if (!tname || !(tname in _models)) throw new Error(`argument tname ERROR ${tname}`);
//         var tmodel = _models[tname];
//         if (!tkey) {
//             var elems = this.getElemIsFkeys().concat(this.getCstFelems());
//             var elem = _.find(this.getElemIsFkeys(), {ftname: tname});
//             if (elem) return this.join(elem.ftname, elem.fcol, elem.name, options);
//             elem = _.find(this.getCstFelems(), { tname: tname });
//             if (elem) return this.join(elem.tname, elem.name, elem.fcol, options);
//             throw new Error(`argument tkey ERROR ${tname}`);
//         }
//         if (!tmodel.elem(tkey)) throw new Error(`${tkey} IS NOT A ELEM FOR ${tname}`);
//         var jtype = options.jtype || 'LEFT';
//         let ext = options.ext || '';
//         var self_as = '';
//         var self_as_sql = '';
//         var self_join_sql = '';
//         if (!this.is_temp) { // first join
//             self_as = options.self_as || this.tname;
//             self_as_sql = self_as;
//         }
//         if (!this.elem(key.includes('.') && self_as ? key.replace(`${self_as}.`, '') : key)) {
//             throw new Error(`${key} IS NOT A ELEM FOR ${this.tname}`);
//         }
//         if (key.includes('.')) {
//             self_join_sql = key;
//         } else if (!self_as) {
//             var e = this.elem(key);
//             self_join_sql = `${this.alias[e.tname]}.${key}`;
//         } else {
//             self_join_sql = `${self_as}.${key}`;
//         }
//         var as = options.as || tname;
//         var as_sql = as;
//         var join_sql = tkey.includes('.') ? tkey : `${as}.${tkey}`;
//         let jtname = (tname === as_sql) ? tname : `${tname} ${as_sql}`;
//         let model = this.copy(self_as);
//         model.alias[tname] = as;
//         _.forEach(tmodel.elems, (elem, name) =>  {
//             var sname = `${as}.${name}`;
//             if (!(name in model.vNames)) model.vNames[name] = sname;
//             if (sname in model.elems && model.elems[sname] !== elem) {
//                 throw new Error(`JOIN KEY ERROR ${sname}`);
//             }
//             model.elems[sname] = elem;
//         });
//         model.tname = `${model.tname}
//             ${jtype} JOIN ${jtname} 
//             ON ${self_join_sql}=${join_sql}
//             ${ext}`;
//         return model;
//     }
//     /* ss: self_as */
//     copy (ss) {
//         var self_as = ss || this.self_as || this.tname;
//         var self_as_sql = '';
//         if (!this.is_temp) {
//             self_as_sql = `${self_as}`;
//         }
//         let tname = (this.tname === self_as_sql) ? this.tname : `${this.tname} ${self_as_sql}`;
//         var model = new Model(tname, { is_temp: true });
//         _.forEach(this.vNames, (elemName, asName) => {
//             model.vNames[asName] = elemName;
//         });
//         _.forEach(this.elems, (elem, name) => {
//             if (name.includes('.')) {
//                 model.elems[`${name}`] = elem;
//             } else {
//                 if (!(name in model.vNames)) model.vNames[name] = `${self_as}.${name}`;
//                 model.elems[`${self_as}.${name}`] = elem;
//             }
//         });
//         _.forOwn(this.alias, (tname_as, tname) => {
//             model.alias[tname] = tname_as;
//         });
//         if (self_as && !this.is_temp) model.alias[this.tname] = self_as;
//         return model;
//     }
//     bindIn(database, name, d) {
//         if (database === DB_TYPE_ORACLE) {
//             let elem = this.elem(name);
//             return DbOracle.bindInFormat(elem.type, d);
//         } else if (database === DB_TYPE_MSSQL) {
//             let elem = this.elem(name);
//             return DbMsSql.bindInFormat(elem.type, d);
//         } else if (database === DB_TYPE_SQLITE) {
//             let elem = this.elem(name);
//             return DbSqlite.bindInFormat(elem.type, d);
//         } else {
//             return d;
//         }
//     }
//     /**
//      * fields: { id: 'foo.id', no: 'foo.no' }; 
//      *
//      */
//     bindOut(database, fields, row) {
//         if (database === DB_TYPE_ORACLE) {
//             _.forOwn(row, (d, asName) => {
//                 if (asName in fields) {
//                     let elem = this.elem(fields[asName]);
//                     if (elem) {
//                         row[asName] = DbOracle.bindOutFormat(elem.type, d);
//                     }
//                 }
//             });
//             return row;
//         } else if (database === DB_TYPE_MSSQL) {
//             let oo = {};
//             _.forOwn(row, (d, asName) => {
//                 if (asName in fields) {
//                     let elem = this.elem(fields[asName]);
//                     if (elem) {
//                         oo[asName] = DbMsSql.bindOutFormat(elem.type, d);
//                     } else {
//                         oo[asName] = d;
//                     }
//                 } else {
//                     oo[asName] = d;
//                 }
//             });
//             return oo;
//         } else if (database === DB_TYPE_SQLITE) {
//             let oo = {};
//             _.forOwn(row, (d, asName) => {
//                 if (asName in fields) {
//                     let elem = this.elem(fields[asName]);
//                     if (elem) {
//                         oo[asName] = DbSqlite.bindOutFormat(elem.type, d);
//                     } else {
//                         oo[asName] = d;
//                     }
//                 } else {
//                     oo[asName] = d;
//                 }
//             });
//             return oo;
//         } else {
//             return row;
//         }
//     }
// 
//     getBindOutType(database, name) {
//         if (database === DB_TYPE_ORACLE) {
//             let elem = this.elem(name);
//             return DbOracle.getBindOutType(elem.type);
//         } else {
//             throw new Error(`NO SUPPORT ${database} getBindOutType`);
//         }
//     }
}

interface ISpaceMap {
    [space: string]: Space;
}

export interface IModelDef {
    defs?: IElemDef[];
    csts?: ICstDef[];
};

let ism: ISpaceMap = {};

export class Space {
    private ld: LazyDep<Elem|Cst>;
    private __models: { [tname: string]: Model };
    public readonly space: string;
    /**
     * constructor
     *
     * @param space?='default'
     * @returns {Models}
     */
    constructor(space: string = 'default') {
        if (!(space in ism)) {
            ism[space] = this;
            this.ld = new LazyDep<Elem|Cst>();
            this.__models = {};
            this.space = space;
        }
        return ism[space];
    }
    /**
     * getSpace
     *
     * @static
     * @param space?='default'
     * @returns {Models}
     */
    static getSpace(space: string = 'default'): Space {
        return new Space(space);
    }
    /**
     * getAllSpaces
     *
     * @static
     * @returns {ISpaceMap}
     */
    static getAllSpaces(): ISpaceMap {
        return ism;
    }
    createModel(tname: string, mDef: IModelDef): this {
        let model = (tname in this.__models) ? this.__models[tname] : this.__models[tname] = new Model(tname);
        forEach(mDef.defs, (eDef) => {
            this.createModelElem(model, eDef);
        });
        forEach(mDef.csts, (cDef) => {
            this.createModelCst(model, cDef);
        });
        return this;
    }
    createModelElem(model: Model, eDef: IElemDef): this {
        let regName = `${model.tname}.${eDef.name}`;
        if (isIElemDefBase(eDef)) {
            return this.createModelBaseElem(model, eDef);
        } else if (isIElemDefFC(eDef)) {
            return this.createModelFCElem(model, eDef);
        } else {
            return this.createModelFPElem(model, eDef);
        }
        return this;
    }
    createModelBaseElem(model: Model, eDef: IElemDefBase): this {
        let regName = `${model.tname}.${eDef.name}`;
        let eType: IElemDefType;
        if (isIElemDefType(eDef.type)) {
            eType = eDef.type;
        } else {
            eType = { js: eDef.type };
        }
        this.ld.register(regName, [], () => {
            return model.createElem({
                name: eDef.name, type: eType
            });
        });
        return this;
    }
    createModelFPElem(model: Model, eDef: IElemDefFP): this {
        let regName = `${model.tname}.${eDef.name}`;
        this.ld.register(regName, [
            `${eDef.ftName}.${eDef.fName}`
        ], (fElem: Elem) => {
            return model.createElem({
                name: eDef.name, fElem
            });
        });
        return this;
    }
    createModelFCElem(model: Model, eDef: IElemDefFC): this {
        let regName = `${model.tname}.${eDef.name}`;
        this.ld.resolve([
            `${model.tname}.${eDef.pName}`
        ], (pElem: Elem) => {
            this.ld.register(regName, [
                `${pElem.felem.tname}.${eDef.fName}`
            ], (fElem: Elem) => {
                return model.createElem({
                    name: eDef.name, pElem, fElem
                });
            });
        });
        return this;
    }
    createModelCst(model: Model, cDef: ICstDef): this {
        let cName = `${model.tname}.${cDef.name}`;
        let deps = map(cDef.elems, (elem) => {
            if (elem instanceof Elem) {
                return `${model.tname}.${elem.name}`;
            } else {
                return `${model.tname}.${elem}`;
            }
        });
        this.ld.register(cName, deps, () => {
            return model.createCst(cDef);
        });
        return this;
    }
    createHistModel(model: Model): this {
        return this;
    }
    register(models): Space {
//         _.forEach(models, (m, tname) => {
//             let elems = _.map(m.defs, (def) => {
//                 let elem = this.elem([tname, def.name]);
//                 if (elem) {
//                     let msg = `SECOND REGISTER model ${tname}.${def.name}`;
//                 } else {
//                     elem = new Elem(tname, def);
//                 }
//                 return elem;
//             });
//             _.forEach(m.csts, (cst) => {
//                 var deps = _.map(cst.names, (name) =>  `${tname}.${name}`)
//                 deps.push((...elems) => {
//                     this.model(tname).addCst(new Cst(cst.type, elems));
//                 });
//                 Elem.resolve(deps);
//             });
//             if (m.view) this.model(tname).setView(m.view);
//             else if (m.hist || (this.model(tname) && this.model(tname).hist)) {
//                 let hist_model = this.model(tname).hist;
//                 let keys = _.map(m.defs, 'name');
//                 if (!hist_model) {
//                     hist_model = new Model(_.isString(m.hist) ? m.hist : `${tname}_hist`);
//                     let pModel = this.model(tname);
//                     pModel.hist = hist_model;
//                     hist_model.parent = pModel;
//                     let hid = new Elem(hist_model.tname, { name: 'hid', type: 'uuid', csts: 'pkey' });
//                     let hseq = new Elem(hist_model.tname, { name: 'hseq', type: 'int', csts: 'not null' });
//                     _.forOwn(this.model(tname).elems, (elem) => {
//                         if (!keys.includes(elem.name)) keys.push(elem.name);
//                     });
//                 }
//                 _.forEach(keys, (key) => {
//                     Elem.resolve([`${tname}.${key}`, (elem) => {
//                         if (elem.pkey) {
//                             elem.hist_elem = new Elem(hist_model.tname, { name: elem.name, type: elem.type });
//                         } else {
//                             let old_hist_def = {
//                                 name: `old_${elem.name}`, type: elem.type, 
//                                 oracleType: elem.oracleType, mssqlType: elem.mssqlType,
//                             }
//                             if (elem.isFlag) {
//                                 old_hist_def.flag = elem.flag;
//                                 old_hist_def.flags = elem.flags;
//                             }
//                             elem.hist_old_elem = new Elem(hist_model.tname, old_hist_def);
//                             let new_hist_def = {
//                                 name: elem.name, type: elem.type, 
//                                 oracleType: elem.oracleType, mssqlType: elem.mssqlType
//                             };
//                             elem.hist_new_elem = new Elem(hist_model.tname, new_hist_def);
//                         }
//                     }]);
//                 });
//             }
//         });
        return this;
    }
//     createTable (db, options = {}) {
//         if (!this.isResolved) throw new Error(`MODEL HAVE NOT RESOLVED ${Object.keys(this.unresolved)}`);
//         return Q.all(_.map(this.models, (model) => model.dbCreate(db, options)));
//     }
//     getCstFelems (tname) {
//         return this.model(tname).getCstFelems();
//     }
//     model(tname: string): Model {
//         return this.__models[tname];
//     }
//     elem(path) {
//         if (typeof path === 'string') path = path.split('.')
//         let model = this.model(path[0]);
//         if (model) return model.elem(path[1]);
//     }
//     get unresolved () {
//         return this.__unresolved;
//     }
//     get isResolved () {
//         return Object.keys(this.__unresolved).length === 0;
//     }
//     get models () {
//         return this.__models;
//     }
}

export interface ITableDef {
    tname?: string;
    space?: string;
    hist?: boolean;
}

export interface IColDef {
}

/**
 * cn2tn class name to table name
 *
 * @param className
 * @returns
 */
export function cn2tn(className: string): string {
    return pz(className.replace(/[A-Z]/g, (v, i) => {
        return `${i ? '_' : ''}${v.toLowerCase()}`;
    }));
}

export function table(options: ITableDef) {
    return function(target: any) {
        let tname = 'tname' in options ? options.tname : cn2tn(target.name);
        let space = 'space' in options ? options.space : 'default';
    };
}

export function col(options: IColDef) {
}

export function pkey() {
}

export function index() {
}

export function cst() {
}

export function Index() {
}
