"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const AuthController_1 = require("../controllers/AuthController");
const appRouter = express_1.default.Router();
appRouter.post("/register-driver", AuthController_1.registerDriver);
appRouter.post("/login-driver", AuthController_1.loginDriver);
exports.default = appRouter;
//# sourceMappingURL=index.js.map