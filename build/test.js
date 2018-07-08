"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
// tsc tmp/test.ts --module commonjs --target es5 --outDir build  --experimentalDecorators --emitDecoratorMetadata --lib es2016
//
require("reflect-metadata");
var inversify_1 = require("inversify");
var Katana = /** @class */ (function () {
    function Katana() {
        console.log('[KATANA] INIT');
    }
    Katana.prototype.hit = function () {
        return "cut!";
    };
    Katana = __decorate([
        inversify_1.injectable(),
        __metadata("design:paramtypes", [])
    ], Katana);
    return Katana;
}());
var Shuriken = /** @class */ (function () {
    function Shuriken() {
        console.log('[SHURIKEN] INIT');
    }
    Shuriken.prototype.throw = function () {
        return "hit!";
    };
    Shuriken = __decorate([
        inversify_1.injectable(),
        __metadata("design:paramtypes", [])
    ], Shuriken);
    return Shuriken;
}());
var ninja;
var Ninja = /** @class */ (function () {
    function Ninja(katana, shuriken) {
        if (ninja) {
            return ninja;
        }
        console.log('[NINJA] INIT');
        ninja = this;
        this._katana = katana;
        this._shuriken = shuriken;
        return this;
    }
    Ninja.prototype.fight = function () { return this._katana.hit(); };
    ;
    Ninja.prototype.sneak = function () { return this._shuriken.throw(); };
    ;
    Ninja = __decorate([
        inversify_1.injectable(),
        __metadata("design:paramtypes", [Katana, Shuriken])
    ], Ninja);
    return Ninja;
}());
var container = new inversify_1.Container();
console.log('before bind Ninja');
container.bind(Ninja).to(Ninja).inSingletonScope();
console.log('after bind Ninja');
console.log('before bind Katana');
container.bind(Katana).to(Katana);
console.log('after bind Katana');
container.bind(Shuriken).to(Shuriken);
console.log('before resolve Shuriken');
var s = container.resolve(Shuriken);
console.log('after resolve Shuriken');
console.log('before resolve Ninja');
var d = container.resolve(Ninja);
console.log('after resolve Ninja');
console.log('before resolve Ninja');
var d1 = container.resolve(Ninja);
console.log('after resolve Ninja');
var d2 = container.get(Ninja);
var d3 = container.get(Ninja);
var d4 = container.get(Katana);
var d5 = container.get(Katana);
debugger;
