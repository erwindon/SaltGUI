class Route {

  constructor(path, name, page_selector, menuitem_selector, router) {
    this.path = new RegExp(path);
    this.name = name;
    this.page_element = document.querySelector(page_selector);
    this.router = router;
    if(menuitem_selector)
      this.menuitem_element = document.querySelector(menuitem_selector);
  }

  getName() {
    return this.name;
  }

  getPath() {
    return this.path;
  }

  getPageElement() {
    return this.page_element;
  }

  getMenuItemElement() {
    return this.menuitem_element;
  }

  static _createTd(className, content) {
    const td = document.createElement("td");
    if(className) td.className = className;
    td.innerText = content;
    return td;
  }

  static _createDiv(className, content) {
    const div = document.createElement("div");
    if(className) div.className = className;
    div.innerText = content;
    return div;
  }

  static _createHtmlDiv(className, htmlContent) {
    const div = document.createElement("div");
    if(className) div.className = className;
    div.innerHTML = htmlContent;
    return div;
  }

}
