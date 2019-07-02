import {Route} from './routes/Route.js';

export class DropDownMenu {

  // Creates an empty dropdown menu
  // The visual clue for the menu is added to the given element
  constructor(pParentElement) {

    this.callback = this.callback.bind(this);
    this.verifyAll = this.verifyAll.bind(this);

    // allow reduced code on the caller side
    if(pParentElement.tagName === "TR") {
      const td = Route._createTd("", "");
      pParentElement.appendChild(td);
      pParentElement = td;
    }

    this.menuDropdown = Route._createDiv("run-command-button", "");

    switch (pParentElement.id) {
    case "cmd-box":
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
    pParentElement.appendChild(this.menuDropdown);
  }

  verifyAll() {
    let visibleCount = 0;
    if(this.menuDropdownContent) {
      for(const chld of this.menuDropdownContent.children) {
        const verifyCallBack = chld.verifyCallBack;
        if(verifyCallBack) verifyCallBack(chld);
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
  addMenuItem(pTitle, pCallBack, pValue) {
    const button = Route._createDiv("run-command-button", "...");
    if(typeof pTitle === "string")
      button.innerHTML = pTitle;
    else
      button.verifyCallBack = pTitle;
    button.addEventListener("click", pClickEvent =>
      this.callback(pClickEvent, pCallBack, pValue)
    );
    this.menuDropdownContent.appendChild(button);
    this.verifyAll();
    return button;
  }

  callback(pClickEvent, pCallBack, pValue) {
    this._value = pValue;
    pCallBack(pClickEvent);
    pClickEvent.stopPropagation();
  }

  setTitle(pTitle) {
    // Setting the title implies that we are interested
    // in the menu values, rather than their actions.
    // Use a slightly different clue for that.
    // 25BC = BLACK DOWN-POINTING TRIANGLE
    this.menuButton.innerHTML = pTitle + "&nbsp;\u25BC";
  }

  showMenu() {
    this.menuDropdown.style.display = "inline-block";
  }

  hideMenu() {
    this.menuDropdown.style.display = "none";
  }

}
