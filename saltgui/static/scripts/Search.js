/* global */

import {Character} from "./Character.js";
import {DropDownMenuCheckBox} from "./DropDownCheckBox.js";
import {Utils} from "./Utils.js";

export class Search {

  static makeSearchBox (pSearchButton, pTable, pFieldList = null) {

    const div = Utils.createDiv("search-box", "");
    div.style.display = "none";

    const menuAndFieldDiv = Utils.createDiv("search-menu-and-field", "");

    const searchOptionsMenu = new DropDownMenuCheckBox(menuAndFieldDiv, "smaller");

    const input = document.createElement("input");
    input.type = "text";
    input.classList.add("filter-text");
    input.placeholder = Character.LEFT_POINTING_MAGNIFYING_GLASS;
    if (pFieldList) {
      input.setAttribute("list", pFieldList);
    }
    menuAndFieldDiv.append(input);

    div.append(menuAndFieldDiv);

    const errorDiv = Utils.createDiv("search-error", "");
    errorDiv.style.display = "none";
    div.append(errorDiv);

    searchOptionsMenu.addMenuItemCheckBox(
      "cs",
      "Case sensitive",
      () => {
        Search._updateSearchOption(pTable, searchOptionsMenu, input);
      });
    searchOptionsMenu.addMenuItemCheckBox(
      "re",
      "Regular expression",
      () => {
        Search._updateSearchOption(pTable, searchOptionsMenu, input);
      });
    searchOptionsMenu.addMenuItemCheckBox(
      "is",
      "Invert search",
      () => {
        Search._updateSearchOption(pTable, searchOptionsMenu, input);
      });

    // make the search function active
    pSearchButton.onclick = () => {
      Utils.hideShowTableSearchBar(div, pTable);
    };

    div.searchOptionsMenu = searchOptionsMenu;

    return div;
  }

  static _updateSearchOption (pTable, pSearchOptionsMenu, pInput) {
    Utils._updateTableFilter(
      pTable,
      pInput.value,
      pSearchOptionsMenu);

    let placeholder = Character.LEFT_POINTING_MAGNIFYING_GLASS;
    if (pSearchOptionsMenu.isSet("cs")) {
      placeholder += " caseSensitive";
    }
    if (pSearchOptionsMenu.isSet("re")) {
      placeholder += " regExp";
    }
    if (pSearchOptionsMenu.isSet("is")) {
      placeholder += " invertSearch";
    }
    pInput.placeholder = placeholder;
  }
}
