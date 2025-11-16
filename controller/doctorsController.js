import db from "../config/db.js";

export const addDoctorPage = (req, res) =>{
    const message = req.query.message || '';
    res.render("addDoctor", { user: req.session.user, message });

}

export const addDoctorForm = (req, res) =>{
    const { username, email, password, phone, specialization, degree, experience, timing, city } = req.body || {};

    var status = 10;
    var added_by = req.session.user ? req.session.user.id : 0;

    if (!username || !email || !password) {
        return res.render("addDoctor", { user: req.session.user, message: "Please fill all required fields!" });
    }
    const sql = "INSERT INTO users (`username`, `email`, `password`, `role`, `status` ) VALUES (?, ?, ?, ?, ?)";
    db.query(sql, [username, email, password, 'doctor',  status], (err, result) => {
        if (err) {
            console.log(err);
            return res.render("addDoctor", { user: req.session.user, message: "Error Inserting Data!" });
        }
        const insertedId = result.insertId;
        const sql2 = `
            INSERT INTO doctors
            (user_id, full_name, phone, specialization, degree, experience, timing, city, created_at, updated_at, added_by, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW(), ?, ?)
        `;
        const values = [
            insertedId, username, phone, specialization, degree, experience, timing, city,
            added_by, status
        ];
        db.query(sql2, values, (err2, result2) => {
            if (err2) {
                console.error("Error inserting into doctor:", err2);
                return res.render("addDoctor", { user: req.session.user, message: "Error adding Doctor details!" });
            }

            console.log("Organization added with fk_user_id:", insertedId);
            return res.redirect(`/addDoctor?message=${encodeURIComponent("Doctor added successfully!")}`);
            //return res.render("add_organization", { message: "Organization added successfully!" });
        });
        //res.status(200).json({ message: "User added successfully!", userId: result.insertId });
        //return res.render("diagnosis", { message: "added successfully!" });
    });
}



export const fetchDoctors = (req, res) => {
    const sql = `
        SELECT d.id AS doctor_id, d.user_id, d.full_name, d.phone, d.specialization, d.degree,
               d.experience, d.timing, d.city, d.status AS doctor_status,
               u.username, u.email, u.role, u.status AS user_status
        FROM doctors d
                 JOIN users u ON d.user_id = u.id
        ORDER BY d.id ASC
    `;

    db.query(sql, (err, results) => {
        if (err) {
            console.error("Error fetching doctors:", err);
            return res.render("allDoctors", { user: req.session.user, message: "Error fetching doctors!", doctors: [] });
        }

        // Render view with fetched doctors
        return res.render("allDoctors", { user: req.session.user, doctors: results, message: null });
    });
};




