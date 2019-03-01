import {Router} from './Router';

import './parsecmdline';
import './utils';

window.addEventListener("load", () => {
  const router = new Router();
  router.bootstrap();
});