/**
 * Implement Lazy Dependency Inject
 */

/**
 * @description Register Callback Inteferface
 */
interface RegCb<T> {
    (...elems: T[]): T;
    done?: boolean;
}

interface ResCb<T> {
    (...elems: T[]): void;
    done?: boolean;
}

interface RegElems<T> {
    [propName: string]: T;
}

/**
 * 
 *
 * @returns
 */
export class LazyDep<T> {
    private __unresolved: { [propName: string]: ResCb<T>[] };
    private __resolved: RegElems<T>;
    constructor() {
        this.__unresolved = {};
        this.__resolved = {};
    }
    get unresolved(): { [propName: string]: ResCb<T>[] } {
        return this.__unresolved;
    }
    get resolved(): RegElems<T> {
        return this.__resolved;
    }
    /**
     * @description Register name of module to LazyDep with dependency some other module
     * @param name  the module name
     * @param deps  the dependence modules and callback
     * @returns
     */
    public register(name: string, deps: string[], regCb: RegCb<T>): LazyDep<T> {
        if (name in this.resolved) throw new Error(`SECOND REGISTER ${name}`);
        this.__unresolved[name] = this.__unresolved[name] || [];
        let resCb: ResCb<T> = (...elems) => {
            this.resolved[name] = regCb(...elems);
            let unresolved = this.unresolved[name];
            delete this.__unresolved[name]
            unresolved.forEach((callback: RegCb<T>) => callback());
        }
        resCb.done = false;
        return this.resolve(deps, resCb);
    }
    /**
     * @param deps
     * @param callback
     * @returns
     */
    public resolve(deps: string[], resCb: ResCb<T>): LazyDep<T> {
        let run: boolean = true;
        let elems: T[] = [];
        deps.forEach((dep) => {
            if (dep in this.resolved) {
                elems.push(this.resolved[dep]);
            } else {
                this.__unresolved[dep] = [...(this.__unresolved[dep] || []), () => {
                    this.resolve(deps, resCb);
                }];
                run = false;
            }
        });
        if (run) {
            if (resCb.done) return this;
            resCb.done = true;
            resCb(...elems);
        }
        return this;
    }
}
