import { minify } from "terser";
import type { CompressOptions } from "terser/tools/terser.d.ts";
export async function compress(
  name: string,
  file: string,
  options: CompressOptions,
) {
  const path = require("path");
  const fs = require("fs");
  // 读取源码文件
  const code = {} as { [index: string]: string };
  code[name] = file;
  // 准备工作完成后，接下来就调用 API 进行压缩
  var res = await minify(code, options);
  return res.code;
}
