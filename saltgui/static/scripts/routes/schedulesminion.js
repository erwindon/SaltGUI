class SchedulesMinionRoute extends PageRoute {

  constructor(router) {
    super("^[\/]schedulesminion$", "Schedules", "#page_schedulesminion", "#button_schedules", router);

    this.keysLoaded = false;
    this.jobsLoaded = false;

    this._showSchedules = this._showSchedules.bind(this);

    document.querySelector("#button_close_schedulesminion").addEventListener("click", _ => {
      this.router.goTo("/schedules");
    });
  }

  onShow() {
    const minions = this;

    const minion = decodeURIComponent(window.getQueryParam("minion"));

    return new Promise(function(resolve, reject) {
      minions.resolvePromise = resolve;
      if(minions.keysLoaded && minions.jobsLoaded) resolve();
      minions.router.api.getScheduleList(minion).then(minions._showSchedules);
      minions.router.api.getJobs().then(minions._updateJobs);
    });
  }

  _showSchedules(data) {
    const minion = decodeURIComponent(window.getQueryParam("minion"));

    let schedules = data.return[0][minion];
    schedules = SchedulesRoute._fixMinion(schedules);

    const title = document.getElementById("schedulesminion_title");
    let txt = "Schedules on " + minion;
    if(!schedules.enabled) txt += " (disabled)";
    title.innerText = txt;

    const page = document.getElementById("schedulesminion_page");

    const menu = new DropDownMenu(page);
    menu.addMenuItem("Enable&nbsp;scheduler...", function(evt) {
      this._runCommand(evt, minion, "schedule.enable");
    }.bind(this));
    menu.addMenuItem("Disable&nbsp;scheduler...", function(evt) {
      this._runCommand(evt, minion, "schedule.disable");
    }.bind(this));

    const container = document.getElementById("schedulesminion_list");
    page.append(container);

    while(container.firstChild) {
      container.removeChild(container.firstChild);
    }


    if(!schedules) return;

    const keys = Object.keys(schedules.schedules).sort();
    for(const k of keys) {

      const schedule = schedules.schedules[k];

      // simplify the schedule information
      if("name" in schedule)
        delete schedule.name;
      if("enabled" in schedule && schedule.enabled)
        delete schedule.enabled;
      if("jid_include" in schedule && schedule.jid_include)
        delete schedule.jid_include;
      if("maxrunning" in schedule && schedule.maxrunning == 1)
        delete schedule.maxrunning;

      const tr = document.createElement('tr');

      const name = Route._createTd("schedule_name", k);
      tr.appendChild(name);

      const isJobDisabled = schedule.hasOwnProperty("enabled") && !schedule.enabled;

      const menu = new DropDownMenu(tr);
      menu.addMenuItem("Modify&nbsp;job...", function(evt) {
        let cmd = "schedule.modify " + k;
        for(const key in schedule) {
          cmd = cmd + " " + key + "=" + JSON.stringify(schedule[key]);
        }
        this._runCommand(evt, minion, cmd);
      }.bind(this));
      menu.addMenuItem("Enable&nbsp;job...", function(evt) {
        this._runCommand(evt, minion, "schedule.enable_job " + k);
      }.bind(this));
      menu.addMenuItem("Disable&nbsp;job...", function(evt) {
        this._runCommand(evt, minion, "schedule.disable_job " + k);
      }.bind(this));
      menu.addMenuItem("Delete&nbsp;job...", function(evt) {
        this._runCommand(evt, minion, "schedule.delete " + k);
      }.bind(this));
      menu.addMenuItem("Run&nbsp;job...", function(evt) {
        let cmd = "schedule.run_job";
        if(isJobDisabled) cmd += " force=true";
        cmd += " " + k;
        this._runCommand(evt, minion, cmd);
      }.bind(this));

      // menu comes before this data on purpose
      const schedule_value = Output.formatJSON(schedule);
      const value = Route._createTd("schedule_value", schedule_value);
      if(isJobDisabled) value.classList.add("disabled_schedule");
      tr.appendChild(value);

      container.appendChild(tr);
    }

    if(!keys.length) {
      const noSchedulesMsg = Route._createDiv("msg", "No schedules found");
      container.appendChild(noSchedulesMsg);
    }
  }
}
