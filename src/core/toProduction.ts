/// <reference path="stringify.d.ts" />
import stringify from "stringify-object";
import type { Element } from "./parse";

export function toPt(ele: Element) {
  var id = ele.attrs.id ? ele.attrs.id.replace(/\"/g, "") : null;
  var attrs = { ...ele.attrs };
  delete attrs["id"];
  attrs = Object.assign(attrs, ele.inner ? { text: ele.inner } : {});
  console.log(attrs);
  var edeploy = stringify(attrs).replace(/'@(.*?)@'/gm, "$1");
  var code = `${
    id ? "var " + id + " = " : ""
  }hmUI.createWidget(hmUI.widget.${ele.tag.toUpperCase()}, ${edeploy})
`;
  return code;
}
