import {Router} from 'express';
import {all_cards, chek_payme_login, confirm_sms, payme_login} from "../controller/PaymeController";

const router: Router = Router();

router.route('/payme-login')
    .post(payme_login);
router.route('/payme-confirm-sms')
    .post(confirm_sms);

router.route('/payme-cards')
    .get(all_cards);

router.route('/payme-chek-login/:user_id')
    .get(chek_payme_login)

export default router;
