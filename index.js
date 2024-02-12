exports.compile=async (fl)=>{
function parse(html){
var tag=html.match(/<\/(.*?)>/g)[0].replace(new RegExp("</", "g"), "").replace(/>/g, "")
var inner=html.replace(/<(.*?)>(.*?)<\/(.*?)>/g, "$2")
var attrs={}
var raw_attrs=html.match(/<(.*?)>/g)[0].replace(/<(.*?) /g, "").replace(/>/g, "")
for(var i in raw_attrs.split(" ")){
var raw=raw_attrs.split(" ")[i]
raw=raw.split("=")
attrs[raw[0]]=raw[1]
}
return {tag, inner, attrs, raw_attrs}
}
var fs=require("fs")
var path=require("path")
var process=require("process")
var {compress}=require("./compress.js")
var config=fs.existsSync("zeppx.config.js")?require(path.resolve(process.env.PWD, "zeppx.config.js")):{}
var {terser, compile:compile_s}=config
var file=fs.readFileSync(path.resolve(fl), "utf-8")
var eles=file.match(/<(.*?)>(.*?)<\/(.*?)>/g)
var parsed=file.replace(/<>/g, "[")
   .replace(/<\/>/g, "]")
for(var i in eles){
  parsed=parsed.replace(new RegExp(eles[i], "g"), `${JSON.stringify(parse(eles[i]))}${+i+1===eles.length?"":","}\n`)
}
parsed=parsed.replace(/definePage/g, "return ")
// console.log(parsed)
class Element{
  constructor(ele){
      var id=ele.attrs.id?ele.attrs.id.replace(/\"/g, ''):null
      var attrs={...ele.attrs}
      delete attrs["id"]
      attrs=Object.assign(attrs, ele.inner?{text:ele.inner}:{})
      var code=
`${id?'var '+id+' = ':''}hmUI.createWidget(hmUI.widget.${ele.tag.toUpperCase()}, ${JSON.stringify(attrs).replace(/"click_func":"(.*?)"/g, '"click_func":$1')})
`
    this.compileCode=code
  }
}
var __funcs=[],
   eles=[]
function expose(fn){
  __funcs.push(fn)
}
const default_setting={
  setLayerScrolling:false,
  useLogger:[true, "js-app"]
}
const settings=Object.assign(default_setting, compile_s)
var app=Object.assign((new Function(parsed))(), settings)
app.onView(expose).forEach((e,i)=>{
  eles.push((new Element(e)).compileCode)
})
var fns=__funcs.map(fn=>fn.toString()).join("\n")
function __compile(fns, eles){
  return (
`try {(() => {var e = __$$hmAppManager$$__.currentApp;var t = e.current,{ px: o } =(new DeviceRuntimeCore.WidgetFactory(new DeviceRuntimeCore.HmDomApi(e, t)),e.app.__globals__);try {(() => {var e = __$$hmAppManager$$__.currentApp,t = e.current;new DeviceRuntimeCore.WidgetFactory(new DeviceRuntimeCore.HmDomApi(e, t),"drink");${app.useLogger[0]
?'var logger = DeviceRuntimeCore.HmLogger.getLogger("'+app.useLogger[1]+'");'
: ""
}t.module = DeviceRuntimeCore.Page({
    onInit() {
      hmUI.setLayerScrolling(${app.setLayerScrolling});
      ${fns}
      ${eles}
      console.log("index page.js on init invoke")
     },
     ${app.onReady?app.onReady.toString()+",":""}
     ${app.onShow?app.onShow.toString()+",":""}
     ${app.onHide?app.onHide.toString()+",":""}
     ${app.onDestory?app.onDestory.toString()+",":""}});})();} catch (e) {console.log(e);}})();} catch (e) {console.log(e);}
`)
}
var outFile=fl.split(".")[0]+".min.js"
var content=await compress(outFile,__compile(fns, eles.join('')), terser)
if(!fs.existsSync("dist")) fs.mkdirSync("dist")
fs.writeFileSync(path.resolve("dist", outFile), content)
}
