import {Route} from "./routes/Route.js";

export class DropDownMenu {

  // Creates an empty dropdown menu
  // The visual clue for the menu is added to the given element
  constructor (pParentElement) {

    this._callback = this._callback.bind(this);
    this.verifyAll = this.verifyAll.bind(this);

    // allow reduced code on the caller side
    if (pParentElement.tagName === "TR") {
      const td = Route.createTd("", "");
      pParentElement.appendChild(td);
      pParentElement = td;
    }

    this.menuDropdown = Route.createDiv("run-command-button", "");
    this.menuDropdown.classList.add("no-search");

    if (pParentElement.id === "cmd-box") {
      // D83D+DCD6 = 1F4D6 = A BOOK
      this.menuButton = Route.createDiv("menu-dropdown", "\uD83D\uDCD6");
    } else if (pParentElement.classList && pParentElement.classList.contains("minion-output")) {
      // 2261 = MATHEMATICAL OPERATOR IDENTICAL TO (aka "hamburger")
      this.menuButton = Route.createSpan("menu-dropdown", "\u2261");
    } else {
      // assume it will be a command menu
      // 2261 = MATHEMATICAL OPERATOR IDENTICAL TO (aka "hamburger")
      this.menuButton = Route.createDiv("menu-dropdown", "\u2261");
    }

    // hide the menu until it receives menu-items
    this.verifyAll();

    this.menuDropdown.appendChild(this.menuButton);
    this.menuDropdownContent = Route.createDiv("menu-dropdown-content", "");
    this.menuDropdown.appendChild(this.menuDropdownContent);
    this.menuDropdown.addEventListener("mouseenter", this.verifyAll);
    pParentElement.appendChild(this.menuDropdown);
  }

  verifyAll () {
    let visibleCount = 0;
    if (this.menuDropdownContent) {
      for (const chld of this.menuDropdownContent.children) {
        const verifyCallBack = chld.verifyCallBack;
        if (verifyCallBack) {
          verifyCallBack(chld);
        }
        if (chld.style.display !== "none") {
          visibleCount += 1;
        }
      }
    }
    // hide the menu when it has no visible menu-items
    const displayVisible = this.menuDropdown.tagName === "TD" ? "table-cell" : "inline-block";
    const displayInvisible = "none";
    this.menuDropdown.style.display = visibleCount > 0 ? displayVisible : displayInvisible;
  }

  // Add a menu item at the end of this dropdown menu
  // Runs the given callback function when selected
  // When the title is actually a function then this
  // function is called each time the menu opens
  // This allows dynamic menuitem titles (use menuitem.innerText/innerHTML)
  // or visibility (use menuitem.style.display = "none"/"inline-block")
  addMenuItem (pTitle, pCallBack, pValue) {
    const button = Route.createDiv("run-command-button", "...");
    if (pValue) {
      button._value = pValue;
    }
    if (typeof pTitle === "string") {
      button.innerHTML = pTitle;
    } else {
      button.verifyCallBack = pTitle;
    }
    button.addEventListener("click", (pClickEvent) => {
      this._callback(pClickEvent, pCallBack, pValue);
    });
    this.menuDropdownContent.appendChild(button);
    this.verifyAll();
    return button;
  }

  _callback (pClickEvent, pCallBack, pValue) {
    this._value = pValue;
    pCallBack(pClickEvent);
    pClickEvent.stopPropagation();
  }

  setTitle (pTitle) {
    // Setting the title implies that we are interested
    // in the menu values, rather than their actions.
    // Use a slightly different clue for that.
    // 25BC = BLACK DOWN-POINTING TRIANGLE
    this.menuButton.innerHTML = pTitle + "&nbsp;\u25BC";
  }

  __showMenu () {
    this.menuDropdown.style.display = "inline-block";
  }

  __hideMenu () {
    this.menuDropdown.style.display = "none";
  }

}
