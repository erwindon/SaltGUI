import {Route} from './routes/Route.js';

export class DropDownMenu {

  // Creates an empty dropdown menu
  // The visual clue for the menu is added to the given element
  constructor(element) {

    this.callback = this.callback.bind(this);
    this.verifyAll = this.verifyAll.bind(this);

    // allow reduced code on the caller side
    if(element.tagName === "TR") {
      const nelement = Route._createTd("", "");
      element.appendChild(nelement);
      element = nelement;
    }

    this.menuDropdown = Route._createDiv("run-command-button", "");

    switch (element.id) {
    case "cmdbox":
      // 1F4D6 (D83D+DCD6) = A BOOK
      this.menuButton = Route._createDiv("menu-dropdown", "\uD83D\uDCD6");
      // hide the menu until it receives menu-items
      this.verifyAll();
      break;

    default:
      // 2261 = MATHEMATICAL OPERATOR IDENTICAL TO (aka "hamburger")
      // assume it will be a command menu
      this.menuButton = Route._createDiv("menu-dropdown", "\u2261");
      // hide the menu until it receives menu-items
      this.verifyAll();
    }
    this.menuDropdown.appendChild(this.menuButton);
    this.menuDropdownContent = Route._createDiv("menu-dropdown-content", "");
    this.menuDropdown.appendChild(this.menuDropdownContent);
    this.menuDropdown.addEventListener("mouseenter", this.verifyAll);
    element.appendChild(this.menuDropdown);
  }

  verifyAll() {
    let visibleCount = 0;
    if(this.menuDropdownContent) {
      for(const chld of this.menuDropdownContent.children) {
        const verifyCallback = chld.verifyCallback;
        if(verifyCallback) verifyCallback(chld);
        if(chld.style.display !== "none") visibleCount++;
      }
    }
    // hide the menu when it has no visible menu-items
    const display_visible = (this.menuDropdown.tagName === "TD") ? "table-cell" : "inline-block";
    const display_invisible = "none";
    this.menuDropdown.style.display = (visibleCount > 0) ? display_visible : display_invisible;
  }

  // Add a menu item at the end of this dropdown menu
  // Runs the given callback function when selected
  // When the title is actually a function then this
  // function is called each time the menu opens
  // This allows dynamic menuitem titles (use menuitem.innerText/innerHTML)
  // or visibility (use menuitem.style.display = "none"/"inline-block")
  addMenuItem(title, callback, value) {
    const button = Route._createDiv("run-command-button", "...");
    if(typeof title === "string")
      button.innerHTML = title;
    else
      button.verifyCallback = title;
    button.addEventListener("click", evt => this.callback(evt, callback, value));
    this.menuDropdownContent.appendChild(button);
    this.verifyAll();
  }

  callback(evt, theCallback, value) {
    this._value = value;
    theCallback(evt);
  }

  setTitle(title) {
    // Setting the title implies that we are interested
    // in the menu values, rather than their actions.
    // Use a slightly different clue for that.
    // 25BC = BLACK DOWN-POINTING TRIANGLE
    this.menuButton.innerHTML = title + "&nbsp;\u25BC";
  }

  showMenu() {
    this.menuDropdown.style.display = "inline-block";
  }

  hideMenu() {
    this.menuDropdown.style.display = "none";
  }

}
