"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = require("dotenv");
const cors_1 = __importDefault(require("cors"));
const index_1 = __importDefault(require("./Routes/index"));
const helmet_1 = __importDefault(require("helmet"));
const Error_1 = __importDefault(require("./Middlewares/Error"));
(0, dotenv_1.config)();
const app = (0, express_1.default)();
const port = process.env.PORT;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use((0, helmet_1.default)());
(0, index_1.default)(app);
app.get('/', (req, res) => {
    res.send('Express + TypeScript Server');
});
app.use(Error_1.default);
app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
