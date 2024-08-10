import {Router} from 'express';
import {setWebhook} from '../controller/MainBotController';

const router: Router = Router();

router.route('/telegram')
    .post(setWebhook);

export default router;
