"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = require("../models/User");
const createToken = (userId) => jsonwebtoken_1.default.sign({}, process.env.JWT_SECRET, { subject: userId, expiresIn: '1h' });
const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const register = async (req, res) => {
    if (typeof req.body !== 'object' || req.body === null || Array.isArray(req.body)) {
        res.status(400).json({ success: false, message: 'A JSON object is required' });
        return;
    }
    const { email, password } = req.body;
    if (typeof email !== 'string' || !isValidEmail(email.trim()) ||
        typeof password !== 'string' || password.length < 8 ||
        Buffer.byteLength(password, 'utf8') > 72) {
        res.status(400).json({
            success: false,
            message: 'Provide a valid email and a password of at least 8 characters and no more than 72 UTF-8 bytes',
        });
        return;
    }
    try {
        const normalizedEmail = email.trim().toLowerCase();
        const passwordHash = await bcryptjs_1.default.hash(password, 12);
        const user = await User_1.User.create({ email: normalizedEmail, passwordHash });
        res.status(201).json({
            success: true,
            data: { id: user.id, email: user.email, token: createToken(user.id) },
        });
    }
    catch (error) {
        if (typeof error === 'object' && error !== null && 'code' in error && error.code === 11000) {
            res.status(409).json({ success: false, message: 'An account with this email already exists' });
            return;
        }
        console.error('Registration failed:', error);
        res.status(500).json({ success: false, message: 'Unable to register user' });
    }
};
exports.register = register;
const login = async (req, res) => {
    if (typeof req.body !== 'object' || req.body === null || Array.isArray(req.body)) {
        res.status(400).json({ success: false, message: 'A JSON object is required' });
        return;
    }
    const { email, password } = req.body;
    if (typeof email !== 'string' || typeof password !== 'string') {
        res.status(400).json({ success: false, message: 'Email and password are required' });
        return;
    }
    if (Buffer.byteLength(password, 'utf8') > 72) {
        res.status(401).json({ success: false, message: 'Invalid email or password' });
        return;
    }
    try {
        const user = await User_1.User.findOne({ email: email.trim().toLowerCase() }).select('+passwordHash');
        if (!user || !(await bcryptjs_1.default.compare(password, user.passwordHash))) {
            res.status(401).json({ success: false, message: 'Invalid email or password' });
            return;
        }
        res.status(200).json({
            success: true,
            data: { id: user.id, email: user.email, token: createToken(user.id) },
        });
    }
    catch (error) {
        console.error('Login failed:', error);
        res.status(500).json({ success: false, message: 'Unable to log in' });
    }
};
exports.login = login;
