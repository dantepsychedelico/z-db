'use strict';
/* model test */

import { Model, Cst, Elem, Space, CTYPE, table, col, pkey } from '../src/schema';
import { } from '../src/utils';
import * as chai from 'chai';
import * as _ from 'lodash';

let should = chai.should();

let space = 'test-model';
let mm = new Space(space);
describe('test model', () => {
    it('create elem', () => {
        let foo = new Model('foo');
        let fooIdElem = new Elem(foo, {
            name: 'id',
            type: { js: 'uuid' }
        });
        return fooIdElem
            .should.be.eql({
                model: foo,
                tname: 'foo',
                name: 'id',
                type: { js: 'uuid' },
                csts: []
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
                csts: []
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
                csts: []
            });
    });
    it('create cst with primary key', () => {
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
        fooIdElem
            .should.be.eql({
                model: foo,
                tname: 'foo',
                name: 'id',
                type: { js: 'uuid' },
                csts: [pKeyCst]
            });
        return pKeyCst
            .should.be.eql({
                model: foo,
                tname: 'foo',
                name: 'foo_pkey',
                type: CTYPE.PKEY,
                elems: [fooIdElem]
            });
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
