/* global */

import {Character} from "../Character.js";
import {DropDownMenu} from "../DropDown.js";
import {Output} from "../output/Output.js";
import {Panel} from "./Panel.js";
import {Utils} from "../Utils.js";

export class OrchestrationsPanel extends Panel {

  constructor () {
    super("orchestrations");

    this.addTitle("Orchestrations");
    this.addSearchButton();
    this.addWarningField();
    this.addTable(["-menu-", "Name", "Target", "Type", "Name", "Details"]);
    this.setTableClickable("cmd");
    this.addMsg();
  }

  onShow () {
    const runnerStateOrchestrateShowSlsPromise = this.router.api.getRunnerStateOrchestrateShowSls();

    runnerStateOrchestrateShowSlsPromise.then((pStateOrchestrateShowSlsData) => {
      this._handleOrchestrationsStateOrchestrateShowSls(pStateOrchestrateShowSlsData);
    }, (pStateOrchestrateShowSlsMsg) => {
      this._handleOrchestrationsStateOrchestrateShowSls(JSON.stringify(pStateOrchestrateShowSlsMsg));
    });
  }

  _handleOrchestrationsStateOrchestrateShowSls (pStateOrchestrateShowSlsData) {
    if (this.showErrorRowInstead(pStateOrchestrateShowSlsData)) {
      return;
    }

    // should we update it or just use from cache (see commandbox) ?
    let orchestrations = pStateOrchestrateShowSlsData.return[0];
    if (!orchestrations) {
      orchestrations = {"dummy": {}};
    }
    orchestrations = orchestrations[Object.keys(orchestrations)[0]];
    if (!orchestrations) {
      orchestrations = {};
    }

    if (Array.isArray(orchestrations)) {
      // that's a list of errors, show them
      this.setWarningText("warn", "There " +
        Utils.txtZeroOneMany(orchestrations.length, "are no errors", "is an error", "are errors") +
        " in the orchestration configuration");
      for (const msg of orchestrations) {
        const tr0 = Utils.createTr();
        const td = Utils.createTd("name", msg);
        td.colSpan = 4;
        tr0.appendChild(td);
        this.table.tBodies[0].appendChild(tr0);
      }
      const txt = Utils.txtZeroOneMany(orchestrations.length,
        "No errors", "{0} error", "{0} errors");
      this.setMsg(txt);
      return;
    }

    const keys = {};
    for (const key of Object.keys(orchestrations)) {
      keys[orchestrations[key].__sls__] = [];
    }
    for (const key of Object.keys(orchestrations)) {
      const orchestration = orchestrations[key];
      keys[orchestration.__sls__][key] = orchestration;
    }
    let nrOrchestrations = 0;
    for (const key of Object.keys(keys).sort()) {
      const orchestration = keys[key];
      if (this._addOrchestration(key, orchestration)) {
        nrOrchestrations += 1;
      }
    }

    const txt = Utils.txtZeroOneMany(nrOrchestrations,
      "No orchestrations", "{0} orchestration", "{0} orchestrations");
    this.setMsg(txt);
  }

  _addOrchestration (pOrchestrationName, pOrchestrations) {

    const steps = [];
    let ok = false;
    for (const name of Object.keys(pOrchestrations)) {
      const step = pOrchestrations[name];
      // add key-name to object itself
      step.__key__ = name;
      const salt = step.salt || [];
      for (const item of salt) {
        if (item && typeof item === "object") {
          pOrchestrations[name] = Object.assign(step, item);
        } else {
          // assuming there is only one non-object...
          step["__type__"] = item;
          ok = true;
        }
      }
      step.salt = [];
      steps.push(step);
    }

    if (!ok) {
      // no evidence that this is an orchestration (likely just a highstate)
      return false;
    }

    const tr0 = Utils.createTr();

    const menu = new DropDownMenu(tr0, "smaller");
    this._addMenuItemApplyOrchestration(menu, pOrchestrationName);
    this._addMenuItemApplyOrchestrationTest(menu, pOrchestrationName);

    tr0.appendChild(Utils.createTd("name", pOrchestrationName));
    tr0.appendChild(Utils.createTd());
    tr0.appendChild(Utils.createTd());
    tr0.appendChild(Utils.createTd());
    tr0.appendChild(Utils.createTd());

    this.table.tBodies[0].appendChild(tr0);

    tr0.addEventListener("click", (pClickEvent) => {
      const cmdArr = ["runners.state.orchestrate", pOrchestrationName];
      this.runCommand("", "", cmdArr);
      pClickEvent.stopPropagation();
    });

    steps.sort((aa, bb) => aa.order > bb.order);

    for (const step of steps) {
      const tr1 = Utils.createTr();

      // menu per item
      const smenu = new DropDownMenu(tr1, "smaller");
      this._addMenuItemApplyOrchestrationStep(smenu, step);
      this._addMenuItemApplyOrchestrationStepTest(smenu, step);

      const cmdArr = OrchestrationsPanel._makeCmdArr(step, false);
      tr1.addEventListener("click", (pClickEvent) => {
        this.runCommand("", "", cmdArr);
        pClickEvent.stopPropagation();
      });

      tr1.appendChild(Utils.createTd("name", Character.NO_BREAK_SPACE.repeat(3) + step.__key__));

      // calculate targettype
      const targetType = step["tgt_type"];
      // calculate target
      const tgt = step["tgt"];
      if (!targetType && !tgt) {
        tr1.appendChild(Utils.createTd("target value-none", "(none)"));
      } else if (!tgt) {
        // targetType cannot be null here
        tr1.appendChild(Utils.createTd("target", targetType));
      } else if (targetType && targetType !== "glob" && targetType !== "list") {
        // target cannot be null here
        tr1.appendChild(Utils.createTd("target", targetType + " " + tgt));
      } else {
        tr1.appendChild(Utils.createTd("target", tgt));
      }

      // show command
      const typeTd = Utils.createTd();
      const typeSpan = Utils.createSpan("command", step.__type__);
      typeTd.appendChild(typeSpan);
      Utils.addToolTip(typeSpan, "salt." + step.__type__);
      tr1.appendChild(typeTd);

      // show name
      const nameTd = Utils.createTd();
      const nameSpan = Utils.createSpan("command", step.name);
      nameTd.appendChild(nameSpan);
      tr1.appendChild(nameTd);

      // calculate details
      // TODO should support ENV
      delete step["__env__"];
      delete step["__key__"];
      delete step["__sls__"];
      delete step["__type__"];
      delete step["name"];
      // the steps are already sorted by this
      // don't show actual values
      delete step["order"];
      // only value for 'salt' seems to be []
      delete step["salt"];
      delete step["tgt"];
      delete step["tgt_type"];
      if (Object.keys(step).length === 0) {
        // nothing more to show
        tr1.appendChild(Utils.createTd("details value-none", "(none)"));
      } else {
        const formattedStep = Output.formatObject(step);
        tr1.appendChild(Utils.createTd("grain-value", formattedStep));
      }

      this.table.tBodies[0].appendChild(tr1);
    }

    return true;
  }

  _addMenuItemApplyOrchestration (pMenu, pOrchestrationName) {
    pMenu.addMenuItem("Apply orchestration...", () => {
      const cmdArr = ["runners.state.orchestrate", pOrchestrationName];
      this.runCommand("", "", cmdArr);
    });
  }

  _addMenuItemApplyOrchestrationTest (pMenu, pOrchestrationName) {
    pMenu.addMenuItem("Test orchestration...", () => {
      const cmdArr = ["runners.state.orchestrate", "test=", true, pOrchestrationName];
      this.runCommand("", "", cmdArr);
    });
  }

  static _makeCmdArr (pSteps, pTest) {
    /* eslint-disable prefer-object-spread */
    const kwArgs = Object.assign({}, pSteps);
    /* eslint-enable prefer-object-spread */
    delete kwArgs["require"];
    delete kwArgs["salt"];
    delete kwArgs["__sls__"];
    delete kwArgs["__env__"];
    delete kwArgs["__key__"];
    delete kwArgs["__type__"];
    delete kwArgs["order"];
    if(!kwArgs["name"]) {
      // orchestrate_single has his as mandatory parameter
      kwArgs["name"] = "dummy";
    }
    kwArgs["fun"] = "salt." + pSteps.__type__;
    if(pTest) {
      kwArgs["test"] = true;
    }
    const cmdArr = ["runners.state.orchestrate_single"];
    cmdArr.push("kwarg=", kwArgs);
    return cmdArr;
  }

  _addMenuItemApplyOrchestrationStep (pMenu, pSteps) {
    const cmdArr = OrchestrationsPanel._makeCmdArr(pSteps, false);
    pMenu.addMenuItem("Apply orchestration step...", () => {
      this.runCommand("", "", cmdArr);
    });
  }

  _addMenuItemApplyOrchestrationStepTest (pMenu, pSteps) {
    const cmdArr = OrchestrationsPanel._makeCmdArr(pSteps, true);
    pMenu.addMenuItem("Test orchestration step...", () => {
      this.runCommand("", "", cmdArr);
    });
  }
}
