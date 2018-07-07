'use strict';
/* process unit test */

import { LazyDep } from '../../src/utils/lazy-dep';
import * as chai from 'chai';
import * as _ from 'lodash';

let should = chai.should();

describe('test LazyDep', () => {
    it('test register aa', (done) => {
        let ld = new LazyDep<string>();
        ld
        .register('aa', [], () => 'AA')
        .resolve(['aa'], (aa) => {
            aa.should.be.eql('AA');
            ld.unresolved.should.be.eql({});
            done();
        });
    });
    it('test resolve aa before register aa', (done) => {
        let ld = new LazyDep<string>();
        ld.resolve(['aa'], (aa) => {
            aa.should.be.eql('AA');
            ld.unresolved.should.be.eql({});
            done();
        })
        .register('aa', [], () => 'AA');
    });
    it('test register aa, bb', (done) => {
        let ld = new LazyDep();
        ld
        .register('aa', [], () => 'AA')
        .register('bb', [], () => 'BB')
        .resolve(['bb', 'aa'], (bb, aa) => {
            aa.should.be.eql('AA');
            bb.should.be.eql('BB');
            ld.unresolved.should.be.eql({});
            done();
        });
    });
    it('test resolve aa, bb before register aa, bb', (done) => {
        let ld = new LazyDep();
        ld
        .resolve(['bb', 'aa'], (bb, aa) => {
            aa.should.be.eql('AA');
            bb.should.be.eql('BB');
            ld.unresolved.should.be.eql({});
            done();
        })
        .register('aa', [], () => 'AA')
        .register('bb', [], () => 'BB');
    });
    it('test resolve aa, bb before register aa', (done) => {
        let ld = new LazyDep();
        ld
        .register('bb', [], () => 'BB')
        .resolve(['bb', 'aa'], (bb, aa) => {
            aa.should.be.eql('AA');
            bb.should.be.eql('BB');
            ld.unresolved.should.be.eql({});
            done();
        })
        .register('aa', [], () => 'AA');
    });
    it('test register bb dependency aa', (done) => {
        let ld = new LazyDep();
        ld
        .register('bb', ['aa'], (aa) => `${aa}BB`)
        .resolve(['bb', 'aa'], (bb, aa) => {
            aa.should.be.eql('AA');
            bb.should.be.eql('AABB');
            ld.unresolved.should.be.eql({});
            done();
        })
        .register('aa', [], () => 'AA');
    });
    it('test callback once for aa, bb', (done) => {
        let ld = new LazyDep();
        let a0 = 0, b0 = 0, c0 = 0;
        ld
        .register('bb', ['aa'], (aa) => {
            b0 += 1;
            return aa+'BB';
        })
        .resolve(['bb', 'aa'], (bb, aa) => {
            c0 += 1;
            aa.should.be.eql('AA');
            bb.should.be.eql('AABB');
            ld.unresolved.should.be.eql({});
            a0.should.be.eql(1);
            b0.should.be.eql(1);
            c0.should.be.eql(1);
            done();
        })
        .register('aa', [], () => {
            a0 += 1;
            return 'AA';
        });
    });
    it('test register cc dependency aa, bb', (done) => {
        let ld = new LazyDep();
        ld
        .resolve(['cc', 'aa'], (cc, aa) => {
            cc.should.be.eql('AABBCCAA');
            aa.should.be.eql('AA');
            ld.unresolved.should.be.eql({});
            done();
        })
        .register('cc', ['bb', 'aa'], (bb, aa) => `${bb}CC${aa}`)
        .register('bb', ['aa'], (aa) => `${aa}BB`)
        .register('aa', [], () => 'AA');
    });
    it('throw error for register twice', (done) => {
        let ld = new LazyDep();
        (() => ld
        .register('aa', [], () => 'AA')
        .register('aa', [], () => 'AA'))
        .should.Throw(Error);
        done();
    });
});


