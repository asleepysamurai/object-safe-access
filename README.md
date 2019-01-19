# object-safe-access
Babel transformation plugin which provides safe access to object properties to prevent `cannot access 'x' of undefined' errors.

Input

```js
const a = b.c.d;
e.f.g = 1;
const b = c.d.e = 2;
```

Output

```js
const a = ((b || {}).c || {}).d;
e = e || {}, e.f = e.f || {}, e.f.g = 1;
const b = (c = c || {}, c.d = c.d || {}, c.d.e = 2);
```

#### Warning:
Will make your code-size very very very very very large. This was an experimental project to learn how to write a babel plugin. **NOT for production use.** That's why it's not even on NPM.


