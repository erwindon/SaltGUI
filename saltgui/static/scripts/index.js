import {Router} from './Router';

import './utils';

window.addEventListener("load", () => {
    const router = new Router();
    router.bootstrap();
});