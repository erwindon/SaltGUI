class DropDownMenu {

  // Creates an empty dropdown menu
  // The visual clue for the menu is added to the given element
  constructor(element) {
    this.menuDropdown = Route._createDiv("run-command-button", "");
    this.menuDropdown.style.display = "none";
    var menuButton;
    if(element.id === "header") {
      // 8801 = MATHEMATICAL OPERATOR IDENTICAL TO (aka "hamburger")
      menuButton = Route._createDiv("menu-dropdown", "&#8801;");
      this.menuDropdown.classList.add("hamburger");
    } else {
      // 9658 = BLACK RIGHT-POINTING POINTER
      menuButton = Route._createDiv("menu-dropdown", "&#9658;");
    }
    this.menuDropdown.appendChild(menuButton);
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
    this.menuDropdown.style.display = "inline-block";
  }

}
