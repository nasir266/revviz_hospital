import db from "../config/db.js";
import bcrypt from "bcryptjs";

export const getLogin = (req, res) => {
    const sqlImage = "SELECT * FROM loginimage ORDER BY id DESC LIMIT 1";
    const sqlLogo = "SELECT * FROM loginlogo ORDER BY id DESC LIMIT 1";

    db.query(sqlImage, (err, imageResult) => {
        if (err) {
            console.error("Error fetching login image:", err);
            return res.render("login", { loginImage: null, loginLogo: null });
        }

        const loginImage = imageResult.length > 0 ? imageResult[0].image : null;
        console.log(loginImage);

        db.query(sqlLogo, (err, logoResult) => {
            if (err) {
                console.error("Error fetching login logo:", err);
                return res.render("login", { loginImage, loginLogo: null });
            }

            const loginLogo = logoResult.length > 0 ? logoResult[0].image : null;

            res.render("login", { loginImage, loginLogo });
        });
    });

};

export const getRegister = (req, res) => {
    res.render("register", { message: null });
};

export const register = async (req, res) => {
    const { name, email, password } = req.body;

    db.query("SELECT * FROM users WHERE email = ?", [email], async (err, result) => {
        if (result.length > 0) {
            return res.render("register", { message: "User already exists" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        db.query(
            "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
            [name, email, hashedPassword],
            err => {
                if (err) return res.render("register", { message: "Error saving user" });
                res.redirect("/login");
            }
        );
    });
};

export const login = (req, res) => {
    const { email, password } = req.body;

    db.query("SELECT * FROM users WHERE email = ?", [email], (err, result) => {
        if (err) {
            console.error("Database error:", err);
            return res.render("login", { message: "Database error" });
        }

        if (result.length === 0) {
            return res.render("login", { message: "Invalid email or password" });
        }

        const user = result[0];

        // Compare directly (plain text)
        if (password !== user.password) {
            return res.render("login", { message: "Invalid password" });
        }
        //req.session.user = user;
        req.session.user = {
            id: user.id,
            username: user.username,
            status: user.status
        };
        if (user.status === 0) {
            return res.render("login", { message: "You are an inactive user. Please contact admin." });
        } else if (user.status === 1) {
            console.log('gg');
            return res.redirect("/h_index");
        } else if (user.status === 2) {
            //req.session.user = user;
            return res.redirect("/");
        } else {
            return res.render("login", { message: "Unknown user status!" });
        }
        //req.session.user = user;
        //res.redirect("/");
    });
};

export const profile = (req, res) => {
    if (!req.session.user) return res.redirect("/login");
    res.render("profile", { user: req.session.user });
};

export const logout = (req, res) => {
    console.log('ff');
    req.session.destroy();
    res.redirect("/login");
};
