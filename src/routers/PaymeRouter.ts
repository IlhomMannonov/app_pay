import {Router} from 'express';
import {all_cards, confirm_sms, payme_login} from "../controller/PaymeController";

const router: Router = Router();

router.route('/payme-login')
    .post(payme_login);
router.route('/payme-confirm-sms')
    .post(confirm_sms);

router.route('/payme-cards')
    .get(all_cards);

export default router;
