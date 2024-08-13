import {Router} from 'express';
import {getAllPaymentTypes} from '../controller/PaymentTypeController';

const router: Router = Router();

router.route('/payment-types')
    .get(getAllPaymentTypes);

export default router;
