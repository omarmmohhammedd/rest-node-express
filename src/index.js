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
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
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
const options = {
    definition: {
        openapi: "3.1.0",
        info: {
            title: "Rest Express API with Swagger",
            version: "0.1.0",
            description: "This is a simple CRUD API application made with Express and documented with Swagger",
            license: {
                name: "Omar",
                url: "",
            },
            contact: {
                name: "Omar",
                url: "https://portoflio-8erjd6yv1-omarmmohhammedd.vercel.app/",
                email: "omar.mmohhammedd@email.com",
            },
        },
        servers: [
            {
                url: "http://localhost:8080",
            },
        ],
    },
    apis: ["src/Routes/Post/index.js", "src/Routes/Auth/index.js", "src/Routes/Admin/index.js"],
};
const specs = (0, swagger_jsdoc_1.default)(options);
app.use("/api-docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(specs, { explorer: true }));
app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});