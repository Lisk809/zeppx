# ZeppX

`ZeppX` 是一个编译工具，使zepp开发者可以使用jsx语法，并内置[terser](https://terser.org/)

## Config

在项目目录下新建zeppx.config.js，内容实例如下: 
```js
module.exports={
  terser:{},
  compile:{}
}
```

```ts
interface CompileConfig{
  setLayerScrolling:boolean,
  useLogger:[boolean, string]
}
```
