
import * as pz from 'pluralize';
import { forEach, map, isPlainObject } from 'lodash';
import { LazyDep } from '../utils';

const ERR_NOT_FOUND_THIS_ELEM_IN_CST = 'NOT FOUND THIS ELEM IN CST';
const ERR_ALWAYS_ADD_IN_ELEM = 'ALWAYS ADD IN ELEM';
const ERR_INVALID_CST_TYPE = 'INVALID CST TYPE';

function isIElemDefType(eDefType: string | IElemDefType): eDefType is IElemDefType{
    return isPlainObject(eDefType);
}

function isICstDefaultDef(cst: ICstDef|ICstDefaultDef): cst is ICstDefaultDef{
    return cst.type === CTYPE.DEFAULT;
}

export const enum EJSTYPE {
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

interface ICstDefaultDef extends ICstDef {
    type: CTYPE.DEFAULT;
    defValue: any | (() => any);
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
    private __isPkey: boolean = false;
    private __isNotNull: boolean = false;
    private __isSingleUniq: boolean = false;
    private __hasDefault: boolean = false;
    private __defaultValue: any;
    constructor(model: Model, eDef: IEDef) {
        this.model = model;
        this.tname = model.tname;
        this.name = eDef.name;
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
            if (this.__isPkey) {
                throw new Error(ERR_INVALID_CST_TYPE);
            }
            this.__isPkey = true;
            if (cst.elems.length === 1) {
                this.__isSingleUniq = true;
            }
        } else if (cst.type === CTYPE.DEFAULT) {
            if (this.__hasDefault) {
                throw new Error(ERR_INVALID_CST_TYPE);
            }
            this.__hasDefault = true;
            this.__defaultValue = cst.defValue;
        } else if (cst.type === CTYPE.NOTNULL) {
            if (this.__isNotNull) {
                throw new Error(ERR_INVALID_CST_TYPE);
            }
            this.__isNotNull = true;
        } else if (cst.type === CTYPE.UNIQUE && cst.elems.length === 1) {
            if (this.__isSingleUniq) {
                throw new Error(ERR_INVALID_CST_TYPE);
            }
            this.__isSingleUniq = true;
        } else {
            throw new Error(ERR_INVALID_CST_TYPE);
        }
        this.csts.push(cst);
        return this;
    }
    get defualValue(): any {
        return this.__defaultValue;
    }
    get isPkey(): boolean {
        return this.__isPkey;
    }
    get isNotNull(): boolean {
        return this.__isNotNull;
    }
    get hasDefault(): boolean {
        return this.__hasDefault;
    }
}

export class Cst {
    public readonly tname: string;
    public readonly type: CTYPE;
    public readonly name: string;
    public readonly model: Model;
    public readonly elems: Elem[];
    private __defaultValue: any;
    constructor(model: Model, cDef: ICstDef|ICstDefaultDef) {
        this.model = model;
        this.tname = model.tname;
        this.name = cDef.name;
        this.elems = cDef.elems;
        this.type = cDef.type;
        if (isICstDefaultDef(cDef)) {
            this.__defaultValue = cDef.defValue;
        }
        forEach(this.elems, (elem) => {
            elem.addCst(this);
        });
    }
    get defValue(): any{
        return this.__defaultValue;
    }
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
        this.tname = tname;
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
        return this;
    }
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

export function _default() {
}
