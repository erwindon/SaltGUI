class TemplatesRoute extends PageRoute {

  constructor(router) {
    super("^[\/]templates$", "Templates", "#page_templates", "#button_templates", router);
    this.jobsLoaded = false;

    this._updateTemplates = this._updateTemplates.bind(this);
    this._applyTemplate = this._applyTemplate.bind(this);
  }

  onShow() {
    const templates = this;
    return new Promise(function(resolve, reject) {
      templates.resolvePromise = resolve;
      if(templates.jobsLoaded) resolve();
      templates.router.api.getJobs().then(templates._updateJobs);
      templates.router.api.getConfigValues().then(templates._updateTemplates);
    });
  }

  _updateTemplates(data) {
    const container = this.getPageElement().querySelector(".templates");
    
    // should we update it or just use from cache (see commandbox) ?
    const templates = data.return[0].data.return.saltgui_templates;
    window.localStorage.setItem("templates", JSON.stringify(templates));
    const keys = Object.keys(templates).sort();
    for(const key of keys) {
      const template = templates[key];
      this._addTemplate(container, key, template);
    }
  }

  _addTemplate(container, name, template) {
    const tr = document.createElement("tr");

    tr.appendChild(Route._createTd("name", name));

    // calculate description
    const description = template["description"];
    if (!description) {
      tr.appendChild(Route._createTd("description value_none", "(none)"));
    } else {
      tr.appendChild(Route._createTd("description", description));
    }

    // calculate targettype
    let targettype = template["targettype"];
    if (!targettype) targettype = "";
    // calculate target
    const target = template["target"];
    if (!target) {
      tr.appendChild(Route._createTd("target value_none", "(none)"));
    } else {
      tr.appendChild(Route._createTd("target", window.makeTargetText(targettype, target)));
    }

    // calculate command
    const command = template["command"];
    if (!command) {
      tr.appendChild(Route._createTd("command value_none", "(none)"));
    } else {
      tr.appendChild(Route._createTd("command", command));
    }

    const menu = new DropDownMenu(tr);
    menu.addMenuItem("Apply&nbsp;template...", function(evt) {
      this._applyTemplate(evt, targettype, target, command);
    }.bind(this));

    container.tBodies[0].appendChild(tr);
  }

  _applyTemplate(evt, targettype, target, command) {
    this._runFullCommand(evt, targettype, target, command);
  }

}
