class Route {

  constructor(path, name, selector) {
    this.path = new RegExp(path);
    this.name = name;
    this.element = document.querySelector(selector);
  }

  getName() {
    return this.name;
  }

  getPath() {
    return this.path;
  }

  getElement() {
    return this.element;
  }

  static _createDiv(className, content) {
    var div = document.createElement('div');
    div.className = className;
    div.innerHTML = content;
    return div;
  }

}
