import express from "express";
import {
    getLogin,
    getRegister,
    register,
    login,
    logout,
    profile,
} from "../controller/authController.js";
import {isAuthenticated} from '../middleware/auth.js';

const router = express.Router();

router.get("/login", getLogin);
router.post("/login", login);

router.get("/register", getRegister);
router.post("/register", register);

router.get("/profile", profile);
router.get("/logout", logout);


router.get("/", isAuthenticated, (req, res) => {
    res.render("index", { user: req.session.user });
});

export default router;
/*,
    */