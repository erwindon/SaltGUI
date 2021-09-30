/*
  SortTable
  version 2
  7th April 2007
  Stuart Langridge, http://www.kryogenix.org/code/browser/sorttable/

  Instructions:
  Add class="sortable" to any table you'd like to make sortable
  Click on the headers to sort

  Thanks to many, many people for contributions and suggestions.
  Licenced as X11: http://www.kryogenix.org/code/browser/licence.html
  This basically means: do what you want with it.

  ErwinD: heavily reduced to match other SaltGUI code
*/

import {Character} from "../scripts/Character.js";

export class SortTable {

  static makeSortable (table) {
    if (table.getElementsByTagName('thead').length === 0) {
      // table doesn't have a tHead. Since it should have, create one and
      // put the first table row in it.
      const the = document.createElement('thead');
      the.appendChild(table.rows[0]);
      table.insertBefore(the,table.firstChild);
    }
    // Safari doesn't support table.tHead, sigh
    if (table.tHead === null) table.tHead = table.getElementsByTagName('thead')[0];

    if (table.tHead.rows.length !== 1) return; // can't cope with two header rows

    // work through each column and calculate its type
    const headrow = table.tHead.rows[0].cells;
    for (let i=0; i<headrow.length; i++) {
      // manually override the type with a sorttable_type attribute
      if (headrow[i].classList.contains("sorttable_sortable")) {
        const mtch = headrow[i].className.match(/\bsorttable_([a-z0-9]+)\b/);
        if (mtch) { const override = mtch[1]; }
        headrow[i].sorttable_sortfunction = SortTable.sort_alpha;
        // make it clickable to sort
        headrow[i].sorttable_columnindex = i;
        headrow[i].sorttable_tbody = table.tBodies[0];
        headrow[i].addEventListener("click", (clickEvent) =>
          SortTable.innerSortFunction(headrow[i])
        );
      }
    }
  }

  static innerSortFunction (clickElement) {
    // remove sorttable_sorted classes
    let prev_sorttable_columnindex = -1;
    const theadrow = clickElement.parentNode;
    for(const cell of theadrow.childNodes) {
      if (cell.nodeType === 1) { // an element
        if(cell.className.includes("sorttable_sorted")) prev_sorttable_columnindex = cell.sorttable_columnindex;
        cell.classList.remove("sorttable_sorted_reverse");
        cell.classList.remove("sorttable_sorted");
      }
    }
    let sortfwdind = clickElement.parentElement.querySelector('#sorttable_sortfwdind');
    if (sortfwdind) { sortfwdind.parentNode.removeChild(sortfwdind); }
    let sortrevind = clickElement.parentElement.querySelector('#sorttable_sortrevind');
    if (sortrevind) { sortrevind.parentNode.removeChild(sortrevind); }

    if(prev_sorttable_columnindex !== clickElement.sorttable_columnindex) {
      // pretend reverse sorting when sorting on another column,
      // so that new sort order is normal
      sortfwdind = null;
    }

    const reverse = sortfwdind !== null;
    if(sortfwdind) {
      clickElement.classList.add("sorttable_sorted_reverse");
      sortrevind = document.createElement('span');
      sortrevind.id = "sorttable_sortrevind";
      sortrevind.innerText = Character.NO_BREAK_SPACE + Character.CH_SORT_REVERSE;
      clickElement.appendChild(sortrevind);
    } else {
      clickElement.classList.add("sorttable_sorted");
      sortfwdind = document.createElement('span');
      sortfwdind.id = "sorttable_sortfwdind";
      sortfwdind.innerText = Character.NO_BREAK_SPACE + Character.CH_SORT_NORMAL;
      clickElement.appendChild(sortfwdind);
    }

    // build an array to sort. This is a Schwartzian transform thing,
    // i.e., we "decorate" each row with the actual sort key,
    // sort based on the sort keys, and then put the rows back in order
    // which is a lot faster because you only do getInnerText once per row
    const row_array = [];
    const col = clickElement.sorttable_columnindex;
    const rows = clickElement.sorttable_tbody.rows;
    for (let j=0; j<rows.length; j++) {
      row_array[row_array.length] = [SortTable.getInnerText(rows[j].cells[col]), rows[j]];
    }
    /* If you want a stable sort, uncomment the following line */
    //SortTable.shaker_sort(row_array, clickElement.sorttable_sortfunction);
    /* and comment out clickElement one */
    row_array.sort(clickElement.sorttable_sortfunction);
    if(reverse) row_array.reverse();

    const tb = clickElement.sorttable_tbody;
    for (let j=0; j<row_array.length; j++) {
      tb.appendChild(row_array[j][1]);
    }
  }

  static getInnerText (node) {
    // gets the text we want to use for sorting for a cell.
    // strips leading and trailing whitespace.
    // this is *not* a generic getInnerText function; it's special to SortTable.
    // for example, you can override the cell text with a customkey attribute.
    // it also gets .value for <input> fields.

    if (!node) return "";

    const hasInputs = (typeof node.getElementsByTagName === 'function') &&
                 node.getElementsByTagName('input').length;

    if (node.getAttribute("sorttable_customkey") !== null) {
      return node.getAttribute("sorttable_customkey");
    }
    else if (typeof node.textContent !== 'undefined' && !hasInputs) {
      return node.textContent.replace(/^\s+|\s+$/g, '');
    }
    else if (typeof node.innerText !== 'undefined' && !hasInputs) {
      return node.innerText.replace(/^\s+|\s+$/g, '');
    }
    else if (typeof node.text !== 'undefined' && !hasInputs) {
      return node.text.replace(/^\s+|\s+$/g, '');
    }
    else {
      switch (node.nodeType) {
        case 3:
          if (node.nodeName.toLowerCase() === 'input') {
            return node.value.replace(/^\s+|\s+$/g, '');
          }
          return node.nodeValue.replace(/^\s+|\s+$/g, '');
        case 4:
          return node.nodeValue.replace(/^\s+|\s+$/g, '');
        case 1:
        case 11:
          var innerText = '';
          for (let i = 0; i < node.childNodes.length; i++) {
            innerText += SortTable.getInnerText(node.childNodes[i]);
          }
          return innerText.replace(/^\s+|\s+$/g, '');
        default:
          return '';
      }
    }
  }

  static reverse (tbody) {
    // reverse the rows in a tbody
    const newrows = [];
    for (let i=0; i<tbody.rows.length; i++) {
      newrows[newrows.length] = tbody.rows[i];
    }
    for (let i=newrows.length-1; i>=0; i--) {
      tbody.appendChild(newrows[i]);
    }
  }

  /* sort functions
     each sort function takes two parameters, a and b
     you are comparing a[0] and b[0] */
  static sort_alpha (a,b) {
    if (a[0]===b[0]) return 0;
    if (a[0]<b[0]) return -1;
    return 1;
  }

  static shaker_sort (list, comp_func) {
    // A stable sort function to allow multi-level sorting of data
    // see: http://en.wikipedia.org/wiki/Cocktail_sort
    // thanks to Joseph Nahmias
    var b = 0;
    var t = list.length - 1;
    var swap = true;

    while(swap) {
        swap = false;
        for(let i = b; i < t; ++i) {
            if ( comp_func(list[i], list[i+1]) > 0 ) {
                const q = list[i]; list[i] = list[i+1]; list[i+1] = q;
                swap = true;
            }
        } // for
        t--;

        if (!swap) break;

        for(let i = t; i > b; --i) {
            if ( comp_func(list[i], list[i-1]) < 0 ) {
                const q = list[i]; list[i] = list[i-1]; list[i-1] = q;
                swap = true;
            }
        } // for
        b++;

    } // while(swap)
  }
}
