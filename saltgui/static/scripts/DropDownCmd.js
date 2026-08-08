/* global */

import {DropDownMenu} from "./DropDown.js";

export class DropDownMenuCmd extends DropDownMenu {

  addMenuItemCmd (pTitle, pUserCallBack) {
    return super.addMenuItem(
      null,
      pTitle,
      pUserCallBack
    );
  }
}
