import {Router} from 'express';
import {getAllProviders, getBiyId, provider_details} from "../controller/ProviderController";
import {paying_provider} from "../controller/PaymentTypeController";

const router: Router = Router();

router.route('/provider-all')
    .get(getAllProviders);

router.route('/provider/:provider_id')
    .get(getBiyId);

router.route('/provider-details')
    .post(provider_details);

router.route('/pay-to-provider')
    .post(paying_provider)


export default router;
