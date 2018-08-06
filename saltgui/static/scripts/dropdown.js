class DropDownMenu {

  // Creates an empty dropdown menu
  // The visual clue for the menu is added to the given element
  constructor(element) {
    this.menuDropdown = Route._createDiv("run-command-button", "");
    if(element.id === "header") {
      // 8801 = MATHEMATICAL OPERATOR IDENTICAL TO (aka "hamburger")
      this.menuButton = Route._createDiv("menu-dropdown", "&#8801;");
      this.menuDropdown.classList.add("hamburger");
    } else {
      // 9658 = BLACK RIGHT-POINTING POINTER
      this.menuButton = Route._createDiv("menu-dropdown", "&#9658;");
      // hide the menu until it receives menu-items
      this.menuDropdown.style.display = "none";
    }
    this.menuDropdown.appendChild(this.menuButton);
    this.menuDropdownContent = Route._createDiv("menu-dropdown-content", "");
    this.menuDropdown.appendChild(this.menuDropdownContent);
    element.appendChild(this.menuDropdown);
  }

  // Add a menu item at the end of this dropdown menu
  // Runs the given callback function when selected
  addMenuItem(title, callback) {
    var button = Route._createDiv("run-command-button", title);
    button.addEventListener('click', evt => callback(evt));
    this.menuDropdownContent.appendChild(button);
    if(this.menuDropdown.parentElement.id !== "header") {
      // this shows the menu button as soon as it has a menu-item
      // don't mess with the toplevel menu, as that has separate
      // css code which will otherwise be overruled
      this.menuDropdown.style.display = "inline-block";
    }
  }

  setTitle(title) {
    this.menuButton.innerHTML = title + "&nbsp;&#9658;";
  }

  showMenu() {
    this.menuDropdown.style.display = "inline-block";
  }

  hideMenu() {
    this.menuDropdown.style.display = "none";
  }

}
