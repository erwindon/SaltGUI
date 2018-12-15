class SchedulesMinionRoute extends PageRoute {

  constructor(router) {
    super("^[\/]schedulesminion$", "Schedules", "#page_schedulesminion", "#button_schedules", router);

    this.keysLoaded = false;
    this.jobsLoaded = false;

    this._showSchedules = this._showSchedules.bind(this);
    this._updateJobs = this._updateJobs.bind(this);

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

    const container = document.getElementById("schedulesminion_list");

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

      const li = document.createElement('li');

      const name = Route._createDiv("schedule_name", k);
      li.appendChild(name);

      const schedule_value = Output.formatJSON(schedule);
      const value = Route._createDiv("schedule_value", schedule_value);
      if(schedule.hasOwnProperty("enabled") && !schedule.enabled) {
        value.classList.add("disabled_schedule");
      }
      li.appendChild(value);

      container.appendChild(li);
    }

    if(!keys.length) {
      const noSchedulesMsg = Route._createDiv("msg", "No schedules found");
      container.appendChild(noSchedulesMsg);
    }
  }
}
