import {Route} from './routes/Route.js';

export class Utils {

  static getQueryParam2(url, name) {
    const questionmarkPos = url.indexOf("?");
    if(questionmarkPos < 0) return undefined;
    const parameters = url.slice(questionmarkPos + 1).split("&");
    for(const parameter of parameters) {
      const namevalue = parameter.split("=");
      if(namevalue.length !== 2) continue;
      if(namevalue[0] === name) return namevalue[1];
    }
    return undefined;
  }

  /* istanbul ignore next */
  static getQueryParam(name) {
    let w = null;
    try { w = window; } catch(error) { /* VOID */ }
    if(!w || !w.location) return undefined;
    return Utils.getQueryParam2(w.location.href, name);
  }

  static addToolTip(tooltipHost, tooltipText) {
    const tooltipSpan = Route._createSpan("", tooltipText);
    tooltipSpan.classList.add("tooltiptext");
    tooltipHost.classList.add("tooltip");

    // remove the old tooltip...
    for(let i = tooltipHost.children.length - 1; i >= 0; i--) {
      const child = tooltipHost.children[i];
      if(child.classList.contains("tooltiptext")) {
        tooltipHost.removeChild(child);
      }
    }

    // ...then add the new tooltip
    tooltipHost.appendChild(tooltipSpan);
  }

}
