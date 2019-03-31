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

}
