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

}
