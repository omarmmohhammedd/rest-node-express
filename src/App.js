"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = require("dotenv");
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swaggerDocment = __importStar(require("../swagger.json"));
const index_1 = __importDefault(require("./Routes/index"));
const Error_1 = __importDefault(require("./Middlewares/Error"));
const Socket_1 = __importDefault(require("./Config/Socket"));
const Chat_1 = require("./Controllers/Chat");
const app = (0, express_1.default)();
const port = process.env.PORT;
// Enable Dotenv Variables
(0, dotenv_1.config)();
// Enable Cors
app.use((0, cors_1.default)());
// Enable Request With Json Fromat
app.use(express_1.default.json());
// Enable Hemlet Middleware
app.use((0, helmet_1.default)());
// Enable Logging For Apis
process.env.NODE_ENV !== 'production' && app.use((0, morgan_1.default)('dev'));
// Base Route
app.get('/', (req, res) => {
    res.send('Express + TypeScript Server');
});
// Routes
(0, index_1.default)(app);
// Swagger Setup
const specs = (0, swagger_jsdoc_1.default)(swaggerDocment);
app.use("/api-docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(specs, { explorer: true, swaggerOptions: { url: 'http://localhost:8080/api-docs/docs' } }));
// Socket IO Initialization
(0, Socket_1.default)().then((io) => {
    console.log(io);
    io.on("connection", (socket) => (0, Chat_1.ChatIO)(io, socket));
});
// Error Handler Middleware
app.use(Error_1.default);
// Running App
app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
exports.default = app;
