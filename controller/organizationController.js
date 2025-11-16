import db from "../config/db.js";

export const addOrgPage = (req, res) => {
    const sql = "SELECT * FROM speciality";

    db.query(sql, (err, specialities) => {
        if (err) {
            console.error("Error fetching specialties:", err);
            return res.render("addOrg", { user: req.session.user, specialities: [] });
        }

        res.render("add_organization", { user: req.session.user, specialities });
    });
};

export const addOrgForm = (req, res) =>{
    const { org_id, org_name, c_name, c_email, password, type, specialities, city, district, state, mobile, hos_email, owner_name, owner_email, owner_number, footer, facebook_url, instagram_url, twitter_url, youtube_url } = req.body;
    var status = 0;
    const logo = req.file ? req.file.filename : null;
    const sql = "INSERT INTO users (`username`, `email`, `password`, `status` ) VALUES (?, ?, ?, ?)";
    db.query(sql, [c_name, c_email, password, status], (err, result) => {
        if (err) {
            console.log(err);
            req.flash("message", "Error Inserting Data!");
            return res.redirect("/add_organization");
            //return res.render("add_organization", { user: req.session.user, message: "Error Inserting Data!" });
        }
        const insertedId = result.insertId;
        const sql2 = `
            INSERT INTO organizations (org_id, org_name, logo, city, district, state, mobile, hos_email,owner_name, owner_email, owner_number, footer,facebook_url, instagram_url, twitter_url, youtube_url,fk_user_id, specialities, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        const values = [
            org_id, org_name, logo, city, district, state, mobile, hos_email,
            owner_name, owner_email, owner_number, footer,
            facebook_url, instagram_url, twitter_url, youtube_url,
            insertedId, specialities, status
        ];
        db.query(sql2, values, (err2, result2) => {
            if (err2) {
                console.error("Error inserting into organizations:", err2);
                req.flash("message", "Error adding organization details!");
                return res.redirect("/add_organization");
                //return res.render("add_organization", { user: req.session.user, message: "Error adding organization details!" });
            }

            console.log("Organization added with fk_user_id:", insertedId);
            req.flash("message", "Organization added successfully!");
            return res.redirect("/add_organization");

        });

    });
}



export const getNewUsers = (req, res) => {
    const sql = `
        SELECT 
            u.id AS user_id,
            u.username,
            u.email,
            u.status AS user_status,
            o.org_id AS org_id,
            o.org_name,
            o.logo,
            o.city,
            o.district,
            o.state,
            o.mobile,
            o.owner_name,
            o.owner_email,
            o.s_date,
            o.exp_date,
            o.status AS org_status
        FROM users u
        LEFT JOIN organizations o ON o.fk_user_id = u.id
        WHERE u.status = 0 
        ORDER BY u.id DESC
    `;

    db.query(sql, (err, results) => {
        if (err) {
            console.error("❌ Error fetching pending users:", err);
            return res.render("all_organization", { user: req.session.user, message: "Error fetching data!", users: [] });
        }

        if (results.length === 0) {
            return res.render("all_organization", { user: req.session.user, message: "No pending users found.", users: [] });
        }

        // ✅ Send data to your view
        return res.render("all_organization", { user: req.session.user, users: results });
    });
};

export const deleteOrg = async (req, res) => {
    try {
        const userId = req.params.id;
        console.log(userId);

        // Delete from organizations first (child table)
        await new Promise((resolve, reject) => {
            const sqlOrg = 'DELETE FROM organizations WHERE fk_user_id = ?';
            db.query(sqlOrg, [userId], (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });

        // Delete from users table (parent table)
        await new Promise((resolve, reject) => {
            const sqlUser = 'DELETE FROM users WHERE id = ?';
            db.query(sqlUser, [userId], (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });

        req.flash('message', 'Organizations deleted successfully.');
        res.redirect('/allOrganization');
    } catch (err) {
        console.error(err);
        req.flash('message', 'Error deleting user.');
        res.redirect('/allOrganization');
    }
};

export const addUserPlan = (req, res) => {
    const { user_id, amount, expire_date } = req.body;

    var status = 1;
    const today = new Date().toISOString().split("T")[0];
    // First, insert into user_plans
    const insertPlanSql = `INSERT INTO user_plans (user_id, amount, start_date, expire_date, status) VALUES (?, ?, ?, ?, ?)`;

    db.query(insertPlanSql, [user_id, amount, today, expire_date, status], (err, result) => {
        if (err) {
            console.error(err);
            req.flash('message', 'Error adding plan');
            return res.redirect('/allOrganization');
        }

        // Now, update the user's status
        const updateUserSql = `UPDATE users SET status = ? WHERE id = ?`;
        db.query(updateUserSql, [status, user_id], (err2, result2) => {
            if (err2) {
                console.error(err2);
                req.flash('message', 'Plan added but failed to update user status');
                return res.redirect('/allOrganization');
            }

            req.flash('message', 'Plan added successfully');
            res.redirect('/allOrganization');
        });
    });
};

export const getActiveUsers = (req, res) => {
    const sql = `
        SELECT 
            u.id AS user_id,
            u.username,
            u.email,
            u.status AS user_status,
            o.id AS org_id,
            o.org_name,
            o.logo,
            o.city,
            o.district,
            o.state,
            o.mobile,
            o.owner_name,
            o.owner_email,
            o.s_date,
            o.exp_date,
            o.status AS org_status
        FROM users u
        LEFT JOIN organizations o ON o.fk_user_id = u.id
        WHERE u.status = 1
        ORDER BY u.id DESC
    `;

    db.query(sql, (err, results) => {
        if (err) {
            console.error("❌ Error fetching pending users:", err);
            return res.render("activeOrganization", { user: req.session.user, message: "Error fetching data!", users: [] });
        }

        if (results.length === 0) {
            return res.render("activeOrganization", { user: req.session.user, message: "No pending users found.", users: [] });
        }

        // ✅ Send data to your view
        return res.render("activeOrganization", { user: req.session.user, message: null, users: results });
    });
};

export const getUnActiveUsers = (req, res) => {
    const sql = `
        SELECT 
            u.id AS user_id,
            u.username,
            u.email,
            u.status AS user_status,
            o.id AS org_id,
            o.org_name,
            o.logo,
            o.city,
            o.district,
            o.state,
            o.mobile,
            o.owner_name,
            o.owner_email,
            o.s_date,
            o.exp_date,
            o.status AS org_status
        FROM users u
        LEFT JOIN organizations o ON o.fk_user_id = u.id
        WHERE u.status = 3
        ORDER BY u.id DESC
    `;

    db.query(sql, (err, results) => {
        if (err) {
            console.error("❌ Error fetching pending users:", err);
            return res.render("unActiveOrganization", { user: req.session.user, message: "Error fetching data!", users: [] });
        }

        if (results.length === 0) {
            return res.render("unActiveOrganization", { user: req.session.user, message: "No pending users found.", users: [] });
        }

        // ✅ Send data to your view
        return res.render("unActiveOrganization", { user: req.session.user, message: null, users: results });
    });
};


export const addPlan = (req, res)=>{
    const message = req.query.message || '';
    res.render("addPlan", { user: req.session.user, message });
}

export const addPlanForm = (req, res) => {
    const { name, days, price } = req.body;
    const status = 0;

    if (!name || !days || !price) {
        return res.render("addPlan", { user: req.session.user, message: "❌ All fields are required!" });
    }

    // 1️⃣ Check if plan name already exists
    const checkSql = "SELECT * FROM plans WHERE name = ?";
    db.query(checkSql, [name], (checkErr, existing) => {
        if (checkErr) {
            console.error("❌ Error checking existing plan:", checkErr);
            return res.render("addPlan", { user: req.session.user, message: "❌ Error checking plan name!" });
        }

        if (existing.length > 0) {
            // If plan name already exists
            return res.render("addPlan", { user: req.session.user, message: "⚠️ Plan name already exists!" });
        }

        // 2️⃣ Insert new plan if name not found
        const insertSql = "INSERT INTO plans (`name`, `duration`, `price`, `status`) VALUES (?, ?, ?, ?)";
        db.query(insertSql, [name, days, price, status], (err, result) => {
            if (err) {
                console.error("❌ Error inserting plan:", err);
                return res.render("addPlan", { user: req.session.user, message: "❌ Error inserting plan!" });
            }

            console.log("✅ Plan added successfully with ID:", result.insertId);
            return res.redirect(`/addPlan?message=${encodeURIComponent("✅ Plan added successfully!")}`);
        });
    });
};

export const getAllPlans = (req, res) => {
    const sql = "SELECT * FROM plans ORDER BY id ASC";

    db.query(sql, (err, results) => {
        if (err) {
            console.error("❌ Error fetching plans:", err);
            return res.render("allPlans", { user: req.session.user, message: "❌ Error fetching plans!", plans: [] });
        }

        if (results.length === 0) {
            return res.render("allPlans", { user: req.session.user, message: "⚠️ No plans found!", plans: [] });
        }

        // ✅ Pass data to the view
        const message = req.query.message || null;
        return res.render("allPlans", { user: req.session.user, message, plans: results });
    });
};

export const AssignPlanPage = (req, res) => {
    const sqlUsers = "SELECT id, username, email FROM users WHERE status = 0";
    const sqlPlans = "SELECT id, name FROM plans WHERE status = 0";

    db.query(sqlUsers, (err, users) => {
        if (err) {
            console.error("Error fetching users:", err);
            return res.render("assignPlan", { user: req.session.user, users: [], plans: [], message: "Error loading users" });
        }

        db.query(sqlPlans, (err2, plans) => {
            if (err2) {
                console.error("Error fetching plans:", err2);
                return res.render("assignPlan", { user: req.session.user, users, plans: [], message: "Error loading plans" });
            }

            const message = req.query.message || null;
            return res.render("assignPlan", { user: req.session.user, users, plans, message });
        });
    });
};

export const assignPlanForm = (req, res) => {
    const user_id = req.body.user_id;
    const plan_id = Array.isArray(req.body.plan_id) ? req.body.plan_id[0] : req.body.plan_id;

    // 1️⃣ Fetch plan duration
    const sqlPlan = "SELECT duration FROM plans WHERE id = ?";
    db.query(sqlPlan, [plan_id], (err, planResult) => {
        if (err || planResult.length === 0) {
            console.error("Error fetching plan:", err);
            return res.render("assignPlan", { user: req.session.user, message: "Invalid Plan Selected!" });
        }

        const durationDays = planResult[0].duration;

        // 2️⃣ Calculate start and expiry date
        const startDate = new Date();
        const expireDate = new Date(startDate);
        expireDate.setDate(startDate.getDate() + durationDays);

        const formatDate = (date) => date.toISOString().split("T")[0];

        // 3️⃣ Insert assignment
        const sqlAssign = `
            INSERT INTO user_plans (user_id, plan_id, start_date, expire_date, status)
            VALUES (?, ?, ?, ?, ?)
        `;

        db.query(
            sqlAssign,
            [user_id, plan_id, formatDate(startDate), formatDate(expireDate), 1],
            (err2) => {
                if (err2) {
                    console.error("Error assigning plan:", err2);
                    return res.render("assignPlan", { user: req.session.user, message: "Failed to assign plan!" });
                }

                // 4️⃣ Update user status to 1
                const sqlUpdateUser = "UPDATE users SET status = 1 WHERE id = ?";
                db.query(sqlUpdateUser, [user_id], (err3) => {
                    if (err3) {
                        console.error("Error updating user status:", err3);
                        return res.render("assignPlan", { user: req.session.user, message: "Plan assigned but failed to update user status!" });
                    }

                    console.log(`✅ Plan ID ${plan_id} assigned to User ID ${user_id}, status updated.`);
                    return res.redirect(`/assignPlan?message=${encodeURIComponent("Plan assigned successfully & user activated!")}`);
                });
            }
        );
    });
};


