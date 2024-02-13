import type {Config} from '../core/index'
import path from 'path';
import process from 'node:process';
import fs from 'fs';

export function getConfig(): Config{
const pwd=process.env.PWD as string
return fs.existsSync("zeppx.config.js")
?require(path.resolve(pwd, "zeppx.config.js"))
:{}
}