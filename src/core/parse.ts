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
    obj[kv[0]] = kv[1].endsWith('"') ? kv[1] : `@${kv[1]}@`;
  }
  return obj;
}
export function parse(html: string): Element {
  html = html.replace(/\n/g, " ");
  var test = html.match(/<\/(.*?)>/g) as string[];
  let tag = test[0].replace(new RegExp("</", "g"), "").replace(/>/g, "");
  let inner = html.replace(/<(.*?)>(.*?)<\/(.*?)>/g, "$2");
  test = html.match(/<(.*?)>/g) as string[];
  let raw_attrs = test[0]
    .replace(/<(.*?) /g, "")
    .replace(/>/g, "")
    .trim();
  let attrs = qs(raw_attrs) as Element["attrs"];
  return { tag, inner, attrs, raw_attrs };
}
