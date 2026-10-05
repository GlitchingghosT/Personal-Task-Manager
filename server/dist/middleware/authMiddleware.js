"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAuth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const requireAuth = (req, res, next) => {
    const authorization = req.get('Authorization');
    const token = authorization?.match(/^Bearer\s+(\S+)$/i)?.[1];
    if (!token) {
        res.status(401).json({ success: false, message: 'Authentication token required' });
        return;
    }
    let decoded;
    try {
        decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
    }
    catch {
        res.status(401).json({ success: false, message: 'Invalid or expired token' });
        return;
    }
    if (typeof decoded === 'string' || typeof decoded.sub !== 'string') {
        res.status(401).json({ success: false, message: 'Invalid or expired token' });
        return;
    }
    req.auth = { userId: decoded.sub };
    next();
};
exports.requireAuth = requireAuth;
