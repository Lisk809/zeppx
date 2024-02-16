/// <reference path="stringify.d.ts" />
import toStr from 'stringify-object';
import type { CompileConfig } from "./index";
import { toPt } from "./toProduction";
import type { Element } from "./parse";

export function compile(config: CompileConfig, parsed: string) {
  let __funcs = [] as Function[],
    __vars = [] as any[],
    eles = [] as string[]
  function slice(start:number, end:number, ctx:string){
    var l_ctx=ctx.split("\n")
    start=start>0?start:l_ctx.length+start
    end=end>0?end:end+l_ctx.length
    return l_ctx.slice(start, end).join("\n")
  }
  const default_setting: CompileConfig = {
    setLayerScrolling: false,
    useLogger: [true, "js-app"],
  };
  const settings = Object.assign(default_setting, config);
  var app = Object.assign(new Function(parsed)(), settings);
  app.onView().forEach((e: Element, i: number) => {
    eles.push(toPt(e));
  });
  var fns = __funcs.map((fn) => fn.toString());
  function __compile(script:string, eles: string[]) {
    return `try {(() => {var e = __$$hmAppManager$$__.currentApp;var t = e.current,{ px: o } =(new DeviceRuntimeCore.WidgetFactory(new DeviceRuntimeCore.HmDomApi(e, t)),e.app.__globals__);try {(() => {var e = __$$hmAppManager$$__.currentApp,t = e.current;new DeviceRuntimeCore.WidgetFactory(new DeviceRuntimeCore.HmDomApi(e, t),"drink");${
      app.useLogger[0]
        ? 'var logger = DeviceRuntimeCore.HmLogger.getLogger("' +
          app.useLogger[1] +
          '");'
        : ""
    }t.module = DeviceRuntimeCore.Page({
    onInit() {
      hmUI.setLayerScrolling(${app.setLayerScrolling});
      ${script}
      ${eles.join("\n")}
      console.log("index page.js on init invoke")
     },
     ${app.onReady ? app.onReady.toString() + "," : ""}
     ${app.onShow ? app.onShow.toString() + "," : ""}
     ${app.onHide ? app.onHide.toString() + "," : ""}
     ${
       app.onDestory ? app.onDestory.toString() + "," : ""
     }});})();} catch (e) {console.log(e);}})();} catch (e) {console.log(e);}
`;
  }
  return __compile(slice(1,-1,app.onView.toString().replace(/return \((.*?)\)\n/gs, "")), eles);
}
