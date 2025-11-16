import db from "../config/db.js";
export function MainPage(req, res) {
    // 1️⃣ Dashboard counts
    const sqlCounts = `
        SELECT
            COUNT(*) AS total_users,
            SUM(CASE WHEN status = 1 THEN 1 ELSE 0 END) AS active_users,
            SUM(CASE WHEN status = 3 THEN 1 ELSE 0 END) AS inactive_users,
            SUM(CASE WHEN status = 0 THEN 1 ELSE 0 END) AS new_users
        FROM users
    `;

    // 2️⃣ Last 5 recently added users (status = 0)
    const sqlRecent = `
        SELECT u.*, o.mobile
        FROM users u
                 LEFT JOIN organizations o ON u.id = o.fk_user_id
        WHERE u.status = 0
        ORDER BY u.id DESC
            LIMIT 5
    `;

    // 3️⃣ Last 5 active users (status = 1)
    const sqlActive = `
        SELECT u.*, o.mobile
        FROM users u
                 LEFT JOIN organizations o ON u.id = o.fk_user_id
        WHERE u.status = 1
        ORDER BY u.id DESC
            LIMIT 5
    `;
    const sqlLastPlans = `
    SELECT up.*, u.username AS user_name, u.email AS user_email
    FROM user_plans up
    LEFT JOIN users u ON up.user_id = u.id
    ORDER BY up.id DESC
    LIMIT 5
`;

    console.log(sqlLastPlans);
    db.query(sqlLastPlans, (err, results) => {
        if (err) {
            console.error(err);
            req.flash('message', 'Error fetching user plans');
            return res.redirect('/a_index'); // or wherever you want
        }
        console.log(results);


    // Execute counts query first
    db.query(sqlCounts, (err, countResult) => {
        if (err) {
            console.error("Error fetching dashboard counts:", err);
            return res.render("a_index", {
                message: "Error loading data!",
                total_users: 0,
                new_users: 0,
                active_users: 0,
                inactive_users: 0,
                recentUsers: [],
                activeUsers: [],
                user: req.session.user
            });
        }

        const counts = countResult[0];

        db.query(sqlRecent, (err2, recentUsers) => {
            if (err2) {
                console.error("Error fetching recent users:", err2);
                recentUsers = [];
            }

            db.query(sqlActive, (err3, activeUsers) => {
                if (err3) {
                    console.error("Error fetching active users:", err3);
                    activeUsers = [];
                }

                // Render dashboard
                res.render("a_index", {
                    total_users: counts.total_users,
                    new_users: counts.new_users,
                    active_users: counts.active_users,
                    inactive_users: counts.inactive_users,
                    plans: results,
                    recentUsers,
                    activeUsers,
                    user: req.session.user,
                    message: null
                });
            });
        });
    });
    });
}






export function h_index(req,res){
    res.render('index', {user: req.session.user, message: null})
}

export const logiPage = (req, res) =>{
    res.render('login')

}