import fs from "fs";
import path from "path";
import process from "process";
import { getConfig } from "../utils/config";
import { parse } from "./parse";
import { compress } from "./compress";
import { compile } from "./compile";
import type { CompressOptions } from "terser/tools/terser.d.ts";

export interface CompileConfig {
  setLayerScrolling: boolean;
  useLogger: [boolean, string];
}
export interface Config {
  compile: CompileConfig;
  terser: CompressOptions;
}
const { terser: config_tr, compile: config_ce } = getConfig();
export async function build(fl: string) {
  var file = fs.readFileSync(path.resolve(fl), "utf-8");
  var eles = file.match(/<(.*?)>(.*?)<\/(.*?)>/g) as string[];
  var parsed = file.replace(/<>/g, "[").replace(/<\/>/g, "]");
  parsed = parsed.replace(/definePage/g, "return ");
  for (var i in eles) {
    parsed = parsed.replace(
      new RegExp(eles[i], "g"),
      `${JSON.stringify(parse(eles[i]))}${+i + 1 === eles.length ? "" : ","}\n`,
    );
  }
  var outFile = fl.split(".")[0] + ".min.js";
  var content = (await compress(
    outFile,
    compile(config_ce, parsed),
    config_tr,
  )) as string;
  if (!fs.existsSync("dist")) fs.mkdirSync("dist");
  fs.writeFileSync(path.resolve("dist", outFile), content);
}
