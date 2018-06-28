class DropDownMenu {

  // Creates an empty dropdown menu
  // The visual clue for the menu is added to the given element
  constructor(element) {
    this.menuDropdown = Route._createDiv("run-command-button", "");
    var menuButton;
    if(element.id === "header") {
      // 8801 = MATHEMATICAL OPERATOR IDENTICAL TO (aka "hamburger")
      menuButton = Route._createDiv("menu-dropdown", "&#8801;");
      this.menuDropdown.classList.add("hamburger");
    } else {
      // 9658 = BLACK RIGHT-POINTING POINTER
      menuButton = Route._createDiv("menu-dropdown", "&#9658;");
      // hide the menu until it receives menu-items
      this.menuDropdown.style.display = "none";
    }
    this.menuDropdown.appendChild(menuButton);
    this.menuDropdownContent = Route._createDiv("menu-dropdown-content", "");
    this.menuDropdown.appendChild(this.menuDropdownContent);
    let here = this;
    this.menuDropdown.addEventListener('mouseenter', function(evt) {
      for(let chld of here.menuDropdownContent.children) {
        var verifyCallback = chld.verifyCallback;
        if(!verifyCallback) continue;
        verifyCallback(chld);
      }
    }.bind(this));
    element.appendChild(this.menuDropdown);
  }

  // Add a menu item at the end of this dropdown menu
  // Runs the given callback function when selected
  // When the title is actually a function then this
  // function is called each time the menu opens
  // This allows dynamic menuitem titles (use menuitem.innerText/innerHTML)
  // or visibility (use menuitem.style.display = "none"/"inline-block")
  addMenuItem(title, callback) {
    var button = Route._createDiv("run-command-button", "...");
    if(typeof title === typeof "xyz")
      button.innerHTML = title;
    else
      button.verifyCallback = title;
    button.addEventListener('click', evt => callback(evt));
    this.menuDropdownContent.appendChild(button);
    if(this.menuDropdown.parentElement.id !== "header") {
      // this shows the menu button as soon as it has a menu-item
      // don't mess with the toplevel menu, as that has separate
      // css code which will otherwise be overruled
      this.menuDropdown.style.display = "inline-block";
    }
  }

}
