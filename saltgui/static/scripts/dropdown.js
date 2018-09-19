class DropDownMenu {

  // Creates an empty dropdown menu
  // The visual clue for the menu is added to the given element
  constructor(element) {

    this.verifyAll = this.verifyAll.bind(this);

    this.menuDropdown = Route._createDiv("run-command-button", "");
    let menuButton;

    switch (element.id) {
    case "header":
      // 8801 = MATHEMATICAL OPERATOR IDENTICAL TO (aka "hamburger")
      menuButton = Route._createDiv("menu-dropdown", "&#8801;");
      this.menuDropdown.classList.add("hamburger");
      break;
    case "cmdbox":
      // 128214 = A BOOK
      menuButton = Route._createDiv("menu-dropdown", "&#128214;");
      // hide the menu until it receives menu-items
      this.verifyAll();
      break;

    default:
      // 9658 = BLACK RIGHT-POINTING POINTER
      menuButton = Route._createDiv("menu-dropdown", "&#9658;");
      // hide the menu until it receives menu-items
      this.verifyAll();
    }
    this.menuDropdown.appendChild(menuButton);
    this.menuDropdownContent = Route._createDiv("menu-dropdown-content", "");
    this.menuDropdown.appendChild(this.menuDropdownContent);
    this.menuDropdown.addEventListener('mouseenter', this.verifyAll);
    element.appendChild(this.menuDropdown);
  }

  verifyAll() {
    if(!this.menuDropdownContent) return;
    let visibleCount = 0;
    for(const chld of this.menuDropdownContent.children) {
      const verifyCallback = chld.verifyCallback;
      if(verifyCallback) verifyCallback(chld);
      if(chld.style.display != "none") visibleCount++;
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
  addMenuItem(title, callback) {
    const button = Route._createDiv("run-command-button", "...");
    if(typeof title === "string")
      button.innerHTML = title;
    else
      button.verifyCallback = title;
    button.addEventListener('click', evt => callback(evt));
    this.menuDropdownContent.appendChild(button);
    if(this.menuDropdown.parentElement.id !== "header") {
      // this shows the menu button as soon as it has a menu-item
      // don't mess with the toplevel menu, as that has separate
      // css code which will otherwise be overruled
      this.verifyAll();
    }
  }

}
