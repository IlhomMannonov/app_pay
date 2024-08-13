import {Router} from 'express';
import {getAllProviders, getBiyId} from "../controller/ProviderController";

const router: Router = Router();

router.route('/provider-all')
    .get(getAllProviders);

router.route('/provider/:provider_id')
    .get(getBiyId);


export default router;
