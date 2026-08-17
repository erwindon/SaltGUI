/* global */

import {Panel} from "./Panel.js";
import {Utils} from "../Utils.js";

export class QuickviewPanel extends Panel {

  constructor () {
    super("quickview");

    this.addTitle("Quick View");
    this.addTable(["Filename", "Light", "Dark", "-dummy-"]);
  }

  static _createLightTd () {
    const td = Utils.createTd("");
    td.style.minWidth = "100px";
    td.style.textAlign = "center";
    td.style.backgroundColor = "white";
    return td;
  }

  static _createDarkTd () {
    const td = Utils.createTd("");
    td.style.minWidth = "100px";
    td.style.textAlign = "center";
    td.style.backgroundColor = "#2a2a2a";
    return td;
  }

  addImageRows () {
    const tbody = this.table.tBodies[0];
    tbody.innerHTML = "";

    // Center the Light and Dark column headers
    const headers = this.table.tHead.rows[0].cells;
    headers[1].style.textAlign = "center";
    headers[2].style.textAlign = "center";

    // GitHub row
    const githubTr = Utils.createTr();
    const filenameTd = Utils.createTd("", "GitHub");
    const lightTd = QuickviewPanel._createLightTd();
    const darkTd = QuickviewPanel._createDarkTd();

    const blackImg = Utils.createElem("img", "prefiximage");
    blackImg.setAttribute("src", "static/images/GitHub_Invertocat_Black.png");
    blackImg.style.width = "1em";
    lightTd.appendChild(blackImg);

    const whiteImg = Utils.createElem("img", "prefiximage");
    whiteImg.setAttribute("src", "static/images/GitHub_Invertocat_White.png");
    whiteImg.style.width = "1em";
    darkTd.appendChild(whiteImg);

    githubTr.appendChild(filenameTd);
    githubTr.appendChild(lightTd);
    githubTr.appendChild(darkTd);
    githubTr.appendChild(Utils.createTd());
    tbody.appendChild(githubTr);

    // Empty row
    const emptyTr1 = Utils.createTr();
    emptyTr1.appendChild(Utils.createTd());
    emptyTr1.appendChild(Utils.createTd());
    emptyTr1.appendChild(Utils.createTd());
    emptyTr1.appendChild(Utils.createTd());
    tbody.appendChild(emptyTr1);

    // UNKNOWN.png row
    const unknownTr = Utils.createTr();
    const unknownFileTd = Utils.createTd("", "UNKNOWN.png");
    const unknownLightTd = QuickviewPanel._createLightTd();
    const unknownDarkTd = QuickviewPanel._createDarkTd();
    const unknownLightImg = Utils.createElem("img", "prefiximage");
    unknownLightImg.setAttribute("src", "static/images/UNKNOWN.png");
    unknownLightImg.style.width = "18px";
    unknownLightImg.style.height = "18px";
    unknownLightTd.appendChild(unknownLightImg);
    const unknownDarkImg = Utils.createElem("img", "prefiximage");
    unknownDarkImg.setAttribute("src", "static/images/UNKNOWN.png");
    unknownDarkImg.style.width = "18px";
    unknownDarkImg.style.height = "18px";
    unknownDarkTd.appendChild(unknownDarkImg);
    unknownTr.appendChild(unknownFileTd);
    unknownTr.appendChild(unknownLightTd);
    unknownTr.appendChild(unknownDarkTd);
    unknownTr.appendChild(Utils.createTd());
    tbody.appendChild(unknownTr);

    // Empty row
    const emptyTr2 = Utils.createTr();
    emptyTr2.appendChild(Utils.createTd());
    emptyTr2.appendChild(Utils.createTd());
    emptyTr2.appendChild(Utils.createTd());
    emptyTr2.appendChild(Utils.createTd());
    tbody.appendChild(emptyTr2);

    // OS images rows
    const osImages = [
      "aix", "almalinux", "alpine", "alt", "amazon", "antergos", "arch-arm", "arch",
      "centos", "centos-stream", "chapeau", "cloudlinux", "darwin", "debian", "devuan",
      "elementary", "elementary-os", "fedora", "fedora-asahi-remix", "freebsd", "gentoo",
      "kali", "kde-neon", "korora", "macos", "mageia", "manjaro", "mint", "netbsd",
      "nilinuxrt", "nilinuxrt-xfce", "oel", "openbsd", "opensolaris", "openwrt",
      "oracle-solaris", "raspbian", "redhat", "rocky", "scientificlinux", "slackware",
      "smartos", "solaris", "steamos", "suse", "ubuntu", "univention", "vmware-photon-os",
      "vmware", "void", "windows"
    ];

    for (const osName of osImages) {
      const tr = Utils.createTr();
      const nameTd = Utils.createTd("", "os-" + osName + ".png");
      const lightTd = QuickviewPanel._createLightTd();
      const darkTd = QuickviewPanel._createDarkTd();
      const lightImg = Utils.createElem("img", "prefiximage");
      lightImg.setAttribute("src", "static/images/os-" + osName + ".png");
      lightImg.style.width = "18px";
      lightImg.style.height = "18px";
      lightTd.appendChild(lightImg);
      const darkImg = Utils.createElem("img", "prefiximage");
      darkImg.setAttribute("src", "static/images/os-" + osName + ".png");
      darkImg.style.width = "18px";
      darkImg.style.height = "18px";
      if (Panel.getOsImagesToBeInverted().includes(osName)) {
        darkImg.style.filter = "invert()";
      }
      darkTd.appendChild(darkImg);
      tr.appendChild(nameTd);
      tr.appendChild(lightTd);
      tr.appendChild(darkTd);
      tr.appendChild(Utils.createTd());
      tbody.appendChild(tr);
    }
  }
}
