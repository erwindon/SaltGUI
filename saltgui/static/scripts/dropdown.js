class DropDownMenu {

  // Creates an empty dropdown menu
  // The visual clue for the menu is added to the given element
  constructor(element) {
    this.menuDropdown = Route._createDiv("run-command-button", "");
    this.menuDropdown.style.display = "none";
    var menuButton = Route._createDiv("menu-dropdown", "&#9658;");
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
    this.menuDropdown.style.display = "block";
  }

}
