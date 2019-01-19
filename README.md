# keyword-immutable
Babel transformation plugin to help with 'mutating' immutable objects

# What we want to do:

Input

```js
immutable let a = {d:{}};
a.b = 1;
a.d.e = 2;

immutable let b = {};
Object.assign(b, a);
```

Output

```js
let a = {d:{}};
Object.defineProperty(a, '__$$immutable$$__', {
    configurable: false,
    enumerable: false,
    writable: false,
    value: {
        isImmutable: true
    }
});

a = mutateImmutable(a, 'b', 1);
a = mutateImmutable(a, 'd.e', 2);

let b = {};
b = mutateImmutable(a);
```

Behaves like
```js
let a = {d: {}};
a = Object.assign({},a, {b: 1});
a = Object.assign({},a, {d: Object.assign({}, a.d, {e : 2})});
```
