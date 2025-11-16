import db from "../config/db.js";

export const userTypePage = (req, res) =>{

    const sql = "SELECT * FROM userType";
    db.query(sql, (err, results) => {
        if (err) {
            console.error("Error fetching User Type:", err);
            return res.status(500).send("Error loading User Type");
        }
        res.render("userType", { user: req.session.user,diagnosisList: results || [] });
    });

}

export const userTypeForm = (req, res) => {
    const { name } = req.body;

    const sql = "INSERT INTO userType (name) VALUES (?)";
    db.query(sql, [name], (err, result) => {
        if (err) {
            console.log(err);

            if (err.code === "ER_DUP_ENTRY") {
                req.flash('message', 'User Type already exists!');
            } else {
                req.flash('message', 'Error inserting data!');
            }

            return res.redirect('/userType');
        }

        req.flash('message', 'User Type added successfully!');
        res.redirect('/userType');
    });
};


export const DeleteUserType = (req, res) => {
    const id = req.params.id;

    const sql = "DELETE FROM userType WHERE id = ?";
    db.query(sql, [id], (err, result) => {
        if (err) {
            console.log(err);
            return res.render("userType", { user: req.session.user,message: "Error!!" });
        }

        req.flash('message', 'Speciality deleted successfully!');
        res.redirect('/userType');
    });
};

export const updateUserType = (req, res) => {
    const id = req.params.id;
    const { name } = req.body;

    const sql = "UPDATE userType SET name = ? WHERE id = ?";
    db.query(sql, [name, id], (err, result) => {
        if (err) {
            console.error(err);
            req.flash("message", "Error updating Type!");
            return res.redirect("/addSpeciality");
        }

        req.flash("message", "Type updated successfully!");
        res.redirect("/userType");
    });
};


/*users functionility*/

export const addUserPage = (req, res) =>{


    const sql = "SELECT * FROM userType";
    db.query(sql, (err, results) => {
        if (err) {
            console.error("Error fetching User Type:", err);
            return res.status(500).send("Error loading User Type");
        }

        const sql = "SELECT * FROM users WHERE status = 0";
        db.query(sql, (err, org) => {
            if (err) {
                console.error("Error fetching User Type:", err);
                return res.status(500).send("Error loading User Type");
            }
            res.render("addUser", { user: req.session.user,userType: results || [], orgList: org || [] });
        });
        //res.render("userType", { user: req.session.user,userType: results || [] });
    });


}





//import bcrypt from 'bcryptjs'; // recommended for password hashing

export const addUserForm = (req, res) => {
    const { username, email, password, phone, fk_type_id, fk_org_id } = req.body;
    const role = "user"; // default role
    const status = 20; // default active

    // First, check if email already exists
    const checkSql = "SELECT * FROM users WHERE email = ?";
    db.query(checkSql, [email], (err, existing) => {
        if (err) {
            console.error("Error checking email:", err);
            req.flash("message", "Error checking email!");
            return res.redirect("/addUser");
        }

        if (existing.length > 0) {
            req.flash("message", "Email already exists!");
            return res.redirect("/addUser"); // prevent insertion
        }

        // Email is unique, proceed to insert
        //const hashedPassword = bcrypt.hashSync(password, 10);

        const insertSql = `
            INSERT INTO users 
            (username, email, password, phone, fk_type_id, fk_org_id, role, status) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;
        db.query(insertSql, [username, email, password, phone, fk_type_id, fk_org_id, role, status], (err, result) => {
            if (err) {
                console.error("Error adding user:", err);
                req.flash("message", "Error adding user!");
                return res.redirect("/addUser");
            }

            req.flash("message", "User added successfully!");
            res.redirect("/addUser");
        });
    });
};

export const getAllUsers = (req, res) => {
    // Fetch all users
    const sqlUsers = `
        SELECT u.*, ut.name AS userTypeName, o.username AS orgName
        FROM users u
                 LEFT JOIN userType ut ON u.fk_type_id = ut.id
                 LEFT JOIN users o ON u.fk_org_id = o.id
        
        WHERE u.status = 20
        ORDER BY u.id DESC
    `;

    db.query(sqlUsers, (err, usersList) => {
        if (err) {
            console.error(err);
            req.flash("message", "Error fetching users!");
            return res.redirect("/");
        }

        // Fetch user types for modal dropdown
        const sqlTypes = "SELECT * FROM userType";
        db.query(sqlTypes, (err, userType) => {
            if (err) {
                console.error(err);
                req.flash("message", "Error fetching user types!");
                return res.redirect("/");
            }

            // Fetch organizations for modal dropdown
            const sqlOrg = "SELECT * FROM users WHERE status=0"; // Or your org table
            db.query(sqlOrg, (err, orgList) => {
                if (err) {
                    console.error(err);
                    req.flash("message", "Error fetching orgs!");
                    return res.redirect("/");
                }

                // Render page with all necessary data
                res.render("allUsers", {
                    user: req.session.user,
                    usersList: usersList || [],
                    userType: userType || [],
                    orgList: orgList || []
                });
            });
        });
    });
};



export const deleteUser = (req, res) => {
    const id = req.params.id;

    const sql = "DELETE FROM users WHERE id = ?";
    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error("Error deleting user:", err);
            req.flash("message", "Error deleting user!");
            return res.redirect("/allUsers"); // back to users page
        }

        req.flash("message", "User deleted successfully!");
        res.redirect("/allUsers");
    });
};

export const updateUser = (req, res) => {
    const id = req.params.id;
    const { username, email, phone, role, status, fk_type_id, fk_org_id } = req.body;

    // Check duplicate email for other users
    const checkSql = "SELECT * FROM users WHERE email=? AND id!=?";
    db.query(checkSql, [email, id], (err, existing) => {
        if (err) {
            console.error(err);
            req.flash("message", "Error checking email!");
            return res.redirect("/allUsers");
        }
        if (existing.length > 0) {
            req.flash("message", "Email already exists!");
            return res.redirect("/allUsers");
        }

        const sql = `
            UPDATE users 
            SET username=?, email=?, phone=?, role=?,  fk_type_id=?, fk_org_id=? 
            WHERE id=?
        `;

        db.query(sql, [username, email, phone, role, fk_type_id, fk_org_id, id], (err, result) => {
            if (err) {
                console.error(err);
                req.flash("message", "Error updating user!");
                return res.redirect("/allUsers");
            }

            req.flash("message", "User updated successfully!");
            res.redirect("/allUsers");
        });
    });
};

