import {Router} from 'express';
import {getUserById} from "../controller/UserController";

const router: Router = Router();

router.route('/users-id/:id')
    .get(getUserById);

export default router;
