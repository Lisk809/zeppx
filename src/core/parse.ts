export interface Element{
  tag: string,
  inner: string,
  attrs:{
  x: string,
  y: string,
  w: string,
  h: string,
  id?:string,
  [index:string]:string|undefined
  },
  raw_attrs:string
}
export function parse(html: string):Element {
html=html.replace(/\n/g, " ")
var test=html.match(/<\/(.*?)>/g) as string[]
let tag=test[0].replace(new RegExp("</", "g"), "").replace(/>/g, "")
let inner=html.replace(/<(.*?)>(.*?)<\/(.*?)>/g, "$2")
let attrs={} as Element["attrs"]
test=html.match(/<(.*?)>/g) as string[]
let raw_attrs=test[0].replace(/<(.*?) /g, "").replace(/>/g, "").trim()
for(let i in raw_attrs.split(" ")){
var raw=raw_attrs.split(" ")[i]
var k_value=raw.split("=")
let key=k_value[0] as keyof Element["attrs"]
attrs[key]=k_value[1]
}
return {tag, inner, attrs, raw_attrs}
}