import {Router} from 'express';
import {chek_login, getAllPaymentTypes, payment_type_cards} from '../controller/PaymentTypeController';

const router: Router = Router();

router.route('/payment-types')
    .get(getAllPaymentTypes);
router.route('/payment-check')
    .post(chek_login);

router.route('/payment-type-cards')
    .post(payment_type_cards);

export default router;
