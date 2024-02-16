import {Parser} from 'htmlparser2';
import type {Handler} from 'htmlparser2';

export interface Element {
  tag: string;
  inner: string;
  attrs: {
    x: string;
    y: string;
    w: string;
    h: string;
    id?: string;
    [index: string]: string | undefined;
  };
  raw_attrs: string;
}
function qs(str: string) {
  var str_s = str.split(" ");
  var obj = {} as { [index: string]: string };
  for (var i in str_s) {
    var kv = str_s[i].split("=");
    console.log(kv)
    obj[kv[0]] = kv[1].endsWith('"')||kv[1].endsWith("'") ? kv[1] : `@${kv[1]}@`;
  }
  return obj;
}
export function parse(html: string): Element {
const options:Partial<Handler> ={
  onopentag(tag, attrs){
    for(var i in attrs){
      let e=attrs[i]
      attrs[i]=e.endsWith('"')||e.endsWith("'")?e:`@${e}@`
    }
    obj.tag=tag
    obj.attrs=attrs as Element["attrs"]
  },
  ontext(text){
    obj.inner=text
  },
  onclosetag(tag){}
}
  let obj={} as Element
  let parser=new Parser(options)
  parser.write(html)
  return obj
}
