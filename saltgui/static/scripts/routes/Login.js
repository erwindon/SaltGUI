/* global */

import {LoginPanel} from "../panels/Login.js";
import {PageRoute} from "./Page.js";

export class LoginRoute extends PageRoute {

  constructor (pRouter) {
    super("login", "Login", "page-login", "", pRouter);

    this.login = new LoginPanel();
    this.login.router = pRouter;
    super.addPanel(this.login);
  }

  onShow () {
    this.login.onShow();
  }
}
