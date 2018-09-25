class GrainsRoute extends PageRoute {

  constructor(router) {
    super("^[\/]grains$", "Grains", "#page_grains", "#button_grains");
    this.router = router;
    this.keysLoaded = false;
    this.jobsLoaded = false;

    this._showGrains = this._showGrains.bind(this);
    this._updateJobs = this._updateJobs.bind(this);
    this._updateKeys = this._updateKeys.bind(this);
    this._updateMinion = this._updateMinion.bind(this);
  }

  onShow() {
    const minions = this;

    const grainsContainer = document.querySelector("#page_grains .grains-list");
    grainsContainer.style.display = "none";

    return new Promise(function(resolve, reject) {
      minions.resolvePromise = resolve;
      if(minions.keysLoaded && minions.jobsLoaded) resolve();
      minions.router.api.getMinions().then(minions._updateMinions);
      minions.router.api.getKeys().then(minions._updateKeys);
      minions.router.api.getJobs().then(minions._updateJobs);
    });
  }

  _updateKeys(data) {
    const keys = data.return;

    const list = this.getPageElement().querySelector('#minions');

    const hostnames = keys.minions.sort();
    for(const hostname of hostnames) {
      this._addMinion(list, hostname);
    }

    this.keysLoaded = true;
    if(this.keysLoaded && this.jobsLoaded) this.resolvePromise();
  }

  _updateMinion(container, minion, hostname) {
    super._updateMinion(container, minion, hostname);

    const element = document.getElementById(hostname);

    const cnt = Object.keys(minion).length;
    const grainInfoText = cnt + " grains";
    const grainInfoDiv = Route._createDiv("graininfo", grainInfoText);
    element.appendChild(grainInfoDiv);

    const menu = new DropDownMenu(element);
    menu.addMenuItem("Show&nbsp;grains", function(evt) {
      this._showGrains(evt, hostname, minion, element);
    }.bind(this));
  }

  _showGrains(evt, hostname, minion, element) {

    const title = document.getElementById("grains_title");
    title.innerText = "Grains on " + hostname;

    const container = document.getElementById("grains_list");

    while(container.firstChild) {
      container.removeChild(container.firstChild);
    }

    const keys = Object.keys(minion).sort();
    for(const k of keys) {
      const grain = document.createElement('li');

      const name = Route._createDiv("grain_name", k);
      grain.appendChild(name);

      const grain_value = Stringify.format(minion[k]);
      const value = Route._createDiv("grain_value", grain_value);
      grain.appendChild(value);

      container.appendChild(grain);
    }

    // highlite the minion
    document.querySelectorAll("#page_grains .minions li").forEach(
      function (e){e.classList.remove("minion_active");}
    );
    element.classList.add("minion_active");

    // replace the initial jobs list with the grains details
    const grainsContainer = document.querySelector("#page_grains .grains-list");
    grainsContainer.style.display = "block";
    const jobContainer = document.querySelector("#page_grains .job-list");
    jobContainer.style.display = "none";
  }
}
