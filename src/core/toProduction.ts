import type {Element} from './parse';

export function toPt(ele: Element){
      var id=ele.attrs.id?ele.attrs.id.replace(/\"/g, ''):null
      var attrs={...ele.attrs}
      delete attrs["id"]
      attrs=Object.assign(attrs, ele.inner?{text:ele.inner}:{})
      var code=
`${id?'var '+id+' = ':''}hmUI.createWidget(hmUI.widget.${ele.tag.toUpperCase()}, ${JSON.stringify(attrs).replace(/"click_func":"(.*?)"/g, '"click_func":$1')})
`
    return code
}