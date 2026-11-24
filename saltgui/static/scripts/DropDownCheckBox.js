/* global */

import {Character} from "./Character.js";
import {DropDownMenu} from "./DropDown.js";

export class DropDownMenuCheckBox extends DropDownMenu {

  static _menuItemTitleCallBack (pMenuItem) {
    let prefix = "";
    if (pMenuItem._selected === true) {
      prefix = Character.HEAVY_CHECK_MARK + Character.NO_BREAK_SPACE;
    }
    return prefix + pMenuItem._title;
  }

  static _menuItemActionCallBack (pMenuItem) {
    pMenuItem._selected = !pMenuItem._selected;
  }

  addMenuItemCheckBox (pValue, pTitle, pUserCallBack) {
    const menuItem = super.addMenuItem(
      pValue,
      (pMenuItem) => DropDownMenuCheckBox._menuItemTitleCallBack(pMenuItem),
      (pMenuItem) => DropDownMenuCheckBox._menuItemActionCallBack(pMenuItem),
      pUserCallBack);
    menuItem._title = pTitle;
    return menuItem;
  }

  isSet (pValue) {
    for (const menuItem of this.menuDropdownContent.childNodes) {
      if (menuItem._selected === true && menuItem._value === pValue) {
        return true;
      }
    }
    return false;
  }
}
