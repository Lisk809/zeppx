exports.compress=async (name, file, options)=>{
const { minify } = require("terser");
const path = require("path");
const fs = require("fs");
// 读取源码文件
const code = {};
code[name]=file
// 准备工作完成后，接下来就调用 API 进行压缩
var res=await minify(code, options)
  return res.code;
}
