class DropDownMenu {

  // Creates an empty dropdown menu
  // The visual clue for the menu is added to the given element
  constructor(element) {

    this.callback = this.callback.bind(this);
    this.verifyAll = this.verifyAll.bind(this);

    this.menuDropdown = Route._createDiv("run-command-button", "");

    switch (element.id) {
    case "hamburger_container":
      // 8801 = MATHEMATICAL OPERATOR IDENTICAL TO (aka "hamburger")
      this.menuButton = Route._createDiv("menu-dropdown", "&#8801;");
      this.menuDropdown.classList.add("hamburger");
      break;

    case "cmdbox":
      // 128214 = A BOOK
      this.menuButton = Route._createDiv("menu-dropdown", "&#128214;");
      // hide the menu until it receives menu-items
      this.verifyAll();
      break;

    default:
      // 9658 = BLACK RIGHT-POINTING POINTER
      // assume it will be a command menu
      this.menuButton = Route._createDiv("menu-dropdown", "&#9658;");
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
    this.menuDropdown.style.display = (visibleCount > 0) ? "inline-block" : "none";
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

  callback(evt, callback, value) {
    this._value = value;
    callback(evt);
  }

  setTitle(title) {
    // Setting the title implies that we are interested
    // in the menu values, rather than their actions.
    // Use a slightly different clue for that.
    // 9660 = BLACK DOWN-POINTING TRIANGLE
    this.menuButton.innerHTML = title + "&nbsp;&#9660;";
  }

  showMenu() {
    this.menuDropdown.style.display = "inline-block";
  }

  hideMenu() {
    this.menuDropdown.style.display = "none";
  }

}
