'use strict';
/* model test */

import { Model, Cst, Elem, Space, CTYPE, table, col, pkey } from '../src/schema';
import * as _ from 'lodash';

let space = 'test-model';
let mm = new Space(space);
describe('test model', () => {
    let elemDefPrivated = {
        __hasDefault: false,
        __isPkey: false,
        __isNotNull: false,
        __isSingleUniq: false
    };
    it('create elem', () => {
        let foo = new Model('foo');
        let fooIdElem = new Elem(foo, {
            name: 'id',
            type: { js: 'uuid' }
        });
        fooIdElem
        .should.be.eql({
            model: foo,
            tname: 'foo',
            name: 'id',
            type: { js: 'uuid' },
            csts: [],
            ...elemDefPrivated,
        });
    });
    it('create elem with foriegn parent key', () => {
        let foo = new Model('foo');
        let goo = new Model('goo');
        let fooIdElem = new Elem(foo, {
            name: 'id',
            type: {
                js: 'uuid'
            }
        });
        let gooFooIdElem = new Elem(goo, {
            name: 'foo_id',
            fElem: fooIdElem
        });
        return gooFooIdElem
            .should.be.eql({
                model: goo,
                tname: 'goo',
                name: 'foo_id',
                type: { js: 'uuid' },
                felem: fooIdElem,
                csts: [],
                ...elemDefPrivated,
            });
    });
    it('create elem with foriegn child key', () => {
        let foo = new Model('foo');
        let goo = new Model('goo');
        let fooIdElem = new Elem(foo, {
            name: 'id',
            type: {
                js: 'uuid'
            }
        });
        let fooNoElem = new Elem(foo, {
            name: 'no',
            type: {
                js: 'text'
            }
        });
        let gooFooIdElem = new Elem(goo, {
            name: 'foo_id',
            fElem: fooIdElem
        });
        let gooFooNoElem = new Elem(goo, {
            name: 'foo_no',
            pElem: gooFooIdElem,
            fElem: fooNoElem
        });
        return gooFooNoElem
            .should.be.eql({
                model: goo,
                tname: 'goo',
                name: 'foo_no',
                type: { js: 'text' },
                pelem: gooFooIdElem,
                felem: fooNoElem,
                csts: [],
                ...elemDefPrivated,
            });
    });
    it('create Cst with primary key', () => {
        let foo = new Model('foo');
        let fooIdElem = new Elem(foo, {
            name: 'id',
            type: {
                js: 'uuid'
            },
        });
        let pKeyCst = new Cst(foo, {
            name: 'foo_pkey',
            type: CTYPE.PKEY,
            elems: [fooIdElem]
        });
        fooIdElem.should.be.eql({
            model: foo,
            tname: 'foo',
            name: 'id',
            type: { js: 'uuid' },
            csts: [pKeyCst],
            ...elemDefPrivated,
            __isPkey: true,
            __isSingleUniq: true
        });
        pKeyCst.should.be.eql({
            model: foo,
            tname: 'foo',
            name: 'foo_pkey',
            type: CTYPE.PKEY,
            elems: [fooIdElem]
        });
        (() => {
            fooIdElem.addCst(pKeyCst);
        }).should.Throw(Error);
    });
    it('create Cst with default value', () => {
        const defValue = 'def_value';
        let foo = new Model('foo');
        let fooIdElem = new Elem(foo, {
            name: 'id',
            type: {
                js: 'text'
            },
        });
        let defCst = new Cst(foo, {
            name: 'foo_id_def',
            type: CTYPE.DEFAULT,
            defValue,
            elems: [fooIdElem]
        });
        let pKeyCst = new Cst(foo, {
            name: 'foo_pkey',
            type: CTYPE.PKEY,
            elems: [fooIdElem]
        });
        fooIdElem.should.be.eql({
            model: foo,
            tname: 'foo',
            name: 'id',
            type: { js: 'text' },
            csts: [defCst, pKeyCst],
            ...elemDefPrivated,
            __isPkey: true,
            __isSingleUniq: true,
            __hasDefault: true,
            __defaultValue: defValue
        });
        pKeyCst.should.be.eql({
            model: foo,
            tname: 'foo',
            name: 'foo_pkey',
            type: CTYPE.PKEY,
            elems: [fooIdElem],
        });
        defCst.should.be.eql({
            model: foo,
            tname: 'foo',
            name: 'foo_id_def',
            type: CTYPE.DEFAULT,
            elems: [fooIdElem],
            __defaultValue: defValue
        });
    });
    it('create Cst with primary key and default value', () => {
        const defValue = 'def_value';
        let foo = new Model('foo');
        let fooIdElem = new Elem(foo, {
            name: 'id',
            type: {
                js: 'text'
            },
        });
        let defCst = new Cst(foo, {
            name: 'foo_id_def',
            type: CTYPE.DEFAULT,
            defValue,
            elems: [fooIdElem]
        });
        fooIdElem.should.be.eql({
            model: foo,
            tname: 'foo',
            name: 'id',
            type: { js: 'text' },
            csts: [defCst],
            ...elemDefPrivated,
            __hasDefault: true,
            __defaultValue: defValue
        });
        defCst.should.be.eql({
            model: foo,
            tname: 'foo',
            name: 'foo_id_def',
            type: CTYPE.DEFAULT,
            elems: [fooIdElem],
            __defaultValue: defValue
        });
        (() => {
            fooIdElem.addCst(defCst);
        }).should.Throw(Error);
    });
    it('create Cst with not null', () => {
        let foo = new Model('foo');
        let fooIdElem = new Elem(foo, {
            name: 'id',
            type: {
                js: 'text'
            },
        });
        let nnCst = new Cst(foo, {
            name: 'foo_id_nn',
            type: CTYPE.NOTNULL,
            elems: [fooIdElem]
        });
        fooIdElem.should.be.eql({
            model: foo,
            tname: 'foo',
            name: 'id',
            type: { js: 'text' },
            csts: [nnCst],
            ...elemDefPrivated,
            __isNotNull: true
        });
        nnCst.should.be.eql({
            model: foo,
            tname: 'foo',
            name: 'foo_id_nn',
            type: CTYPE.NOTNULL,
            elems: [fooIdElem],
        });
        (() => {
            fooIdElem.addCst(nnCst);
        }).should.Throw(Error);
    });
    it('create Cst with single unique constraint', () => {
        let foo = new Model('foo');
        let fooIdElem = new Elem(foo, {
            name: 'id',
            type: {
                js: 'text'
            },
        });
        let sukCst = new Cst(foo, {
            name: 'foo_id_uk',
            type: CTYPE.UNIQUE,
            elems: [fooIdElem]
        });
        fooIdElem.should.be.eql({
            model: foo,
            tname: 'foo',
            name: 'id',
            type: { js: 'text' },
            csts: [sukCst],
            ...elemDefPrivated,
            __isSingleUniq: true
        });
        sukCst.should.be.eql({
            model: foo,
            tname: 'foo',
            name: 'foo_id_uk',
            type: CTYPE.UNIQUE,
            elems: [fooIdElem],
        });
        (() => {
            fooIdElem.addCst(sukCst);
        }).should.Throw(Error);
    });
    it.skip('create Cst with multiple unique constraint', () => {
        let foo = new Model('foo');
        let fooIdElem = new Elem(foo, {
            name: 'id',
            type: {
                js: 'text'
            },
        });
        let fooNoElem = new Elem(foo, {
            name: 'no',
            type: {
                js: 'text'
            },
        });
        let mukCst = new Cst(foo, {
            name: 'foo_id_no_uk',
            type: CTYPE.UNIQUE,
            elems: [fooIdElem, fooNoElem]
        });
        fooIdElem.should.be.eql({
            model: foo,
            tname: 'foo',
            name: 'id',
            type: { js: 'text' },
            csts: [mukCst],
            ...elemDefPrivated,
            __isSingleUniq: true
        });
        mukCst.should.be.eql({
            model: foo,
            tname: 'foo',
            name: 'foo_id_no_uk',
            type: CTYPE.UNIQUE,
            elems: [fooIdElem],
        });
        (() => {
            fooIdElem.addCst(mukCst);
        }).should.Throw(Error);
    });
    it('create Cst with multiple primary key', () => {
    });
//     it('regsiter foo', (done) => {
//         mm.register({
//             foo: {
//                 defs: [
//                     { name: 'id', type: 'uuid', csts: 'pkey' }
//                 ]
//             }
//         }).model('foo')
//         .should
//         .eql({ 
//             tname: 'foo',
//             csts: {},
//             elems: {
//                 id: {
//                     csts: [ 'PKEY' ],
//                     name: 'id',
//                     pkey: true,
//                     tname: 'foo',
//                     type: 'uuid'
//                 }
//             },
//         })
//         done();
//     });
//     it('register foo with annotation', () => {
//         @table({ space })
//         class Foo {
//             public tname: string;
//             @col({ type: BTYPE.UUID }) @pkey id: string;
//         }
//         return mm.model('foo')
//         .should
//         .eql({ 
//             tname: 'foo',
//             csts: {
//                 foo_pkey: {
//                     type: 'pkey'
//                     elems: [ mm.model('foo').elems.id ]
//                 }
//             },
//             elems: {
//                 id: {
//                     csts: [ mm.model('foo').csts.foo_pkey ],
//                     name: 'id',
//                     pkey: true,
//                     tname: 'foo',
//                     type: 'uuid'
//                 }
//             },
//         });
//     });
//     it('register User', () => {
//         @table({ hist: true })
//         class User {
//             @col({ type: BTYPE.UUID }) @pkey id: string;
//             @col() @unique @notnull @index('u_no') no: string;
//             @col() @notnull name: string;
//             @col({ tname: 'titles', fName: 'id' }) title_id: string;
//             @col({ pName: 'title_id', fName: 'no' }) title_no: string;
//             @col({ pName: 'title_name', fName: 'name' }) title_name: string;
//             @col() @fkey('depts', 'id') dept_id: string;
//             @col() @default(false) is_enable: boolean;
//             @col() @notnull @default(() => new Date()) create_ts: Date;
//             @col() @notnull last_ts: Date;
//             @index('name') u_name: Index;
//             @index('no', 'name') u_no_name: Index;
//         }
//         @table()
//         class Dept {
//         }
//         @table({ hist: true })
//         class Title {
//             @col({ type: ETYPE.UUID }) @pkey id: string;
//             @col() @unique @notnull @index('u_no') no: string;
//             @col() @notnull name: string;
//             @col() @notnull @default(() => new Date()) create_ts: Date;
//             @col() @notnull last_ts: Date;
//         }
//     });
});
