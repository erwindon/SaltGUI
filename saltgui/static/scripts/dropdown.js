sdffds
class DropDownMenu {

  // Creates an empty dropdown menu
  // The visual clue for the menu is added to the given element
  constructor(element) {
    var menuDropdown = Route._createDiv("run-command-button", "");
    var menuButton = Route._createDiv("menu-dropdown", "&#9658;");
    menuDropdown.appendChild(menuButton);
    this.menuDropdownContent = Route._createDiv("menu-dropdown-content", "");
    menuDropdown.appendChild(this.menuDropdownContent);
    element.appendChild(menuDropdown);
  }

  // Add a menu item at the end of this dropdown menu
  // Runs the given callback function when selected
  addMenuItem(title, callback) {
    var button = Route._createDiv("run-command-button", title);
    button.addEventListener('click', evt => callback(evt));
    this.menuDropdownContent.appendChild(button);
  }

}
