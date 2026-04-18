/* global */

import {Character} from "./Character.js";
import {DropDownMenu} from "./DropDown.js";

export class DropDownMenuRadio extends DropDownMenu {
  constructor (pParentElement) {
    super(pParentElement);
    this._value = null;
    this._defaultValue = null;
  }

  getValue () {
    if (this._value === null) {
      return this._defaultValue;
    }
    return this._value;
  }

  setValue (pValue) {
    this._value = pValue;
  }

  setDefaultValue (pDefaultValue) {
    this._defaultValue = pDefaultValue;
  }

  _menuItemTitleCallBack (pMenuItem) {
    let title;
    if (!pMenuItem._title) {
      title = "...";
    } else if (typeof pMenuItem._title === "string") {
      title = pMenuItem._title;
    } else {
      title = pMenuItem._title.bind(this)(pMenuItem);
    }

    if (title === null) {
      // menu item will be hidden
    } else if (pMenuItem._value === this._value) {
      title = Character.BLACK_CIRCLE + Character.NO_BREAK_SPACE + title;
    } else if (this._value === null && pMenuItem._value === this._defaultValue) {
      title = Character.WHITE_CIRCLE + Character.NO_BREAK_SPACE + title;
    }
    return title;
  }

  _menuItemActionCallBack (pMenuItem) {
    this._value = pMenuItem._value;
    let menuTitle = pMenuItem._title;
    if (menuTitle && typeof menuTitle !== "string") {
      menuTitle = menuTitle.bind(this)(pMenuItem);
    }
    this.setTitle(menuTitle);
  }

  addMenuItemRadio (pValue, pTitle, pUserCallBack) {
    const menuItem = super.addMenuItem(
      pValue,
      this._menuItemTitleCallBack,
      this._menuItemActionCallBack,
      pUserCallBack);
    menuItem._value = pValue;
    menuItem._title = pTitle;
    return menuItem;
  }
}
