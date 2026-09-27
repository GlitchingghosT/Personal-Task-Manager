"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const taskRoutes_js_1 = __importDefault(require("./routes/taskRoutes.js"));
const db_js_1 = require("./config/db.js");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5050;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.get('/', (_req, res) => {
    res.send('TaskDuty API is running...');
});
app.use('/api/tasks', taskRoutes_js_1.default);
const startServer = async () => {
    await (0, db_js_1.connectDB)();
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
};
void startServer();
//# sourceMappingURL=index.js.map