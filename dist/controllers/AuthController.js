"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginDriver = exports.registerDriver = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const Driver_1 = __importDefault(require("../models/Driver"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const registerDriver = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const password = yield bcryptjs_1.default.hash(req.body.password, 10);
        const driver = new Driver_1.default({
            username: req.body.username,
            password: password,
            busNumber: "1234"
        });
        yield driver.save();
        console.log("Saved successfully");
        const token = jsonwebtoken_1.default.sign({ driverId: driver._id }, process.env.TOKEN_KEY, { expiresIn: '8h' });
        console.log("token");
        res.status(201).json({ token, busNumber: driver.busNumber });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
exports.registerDriver = registerDriver;
const loginDriver = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(req.body);
        const driver = yield Driver_1.default.findOne({ username: req.body.username });
        console.log(driver);
        if (!driver || !(yield driver.comparePassword(req.body.password))) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        console.log("I am here ");
        const token = jsonwebtoken_1.default.sign({ driverId: driver._id }, process.env.TOKEN_KEY, { expiresIn: '8h' });
        res.status(201).json({ token, busNumber: driver.busNumber });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.loginDriver = loginDriver;
//# sourceMappingURL=AuthController.js.map