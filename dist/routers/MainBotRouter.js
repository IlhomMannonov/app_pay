"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const MainBotController_1 = require("../controller/MainBotController");
const router = (0, express_1.Router)();
router.route('/telegram')
    .post(MainBotController_1.setWebhook);
exports.default = router;
