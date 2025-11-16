import db from "../config/db.js";

export const addDiagnosisPage = (req, res) =>{

    const sql = "SELECT * FROM diagnosis";

    db.query(sql, (err, results) => {
        if (err) {
            console.error("Error fetching diagnosis:", err);
            return res.status(500).send("Error loading diagnosis");
        }
        res.render("diagnosis", { user: req.session.user,diagnosisList: results || [] });
    });
    //res.render('symptoms',{user: req.session.user,message: null})

}

export const addDiagnosisForm = (req, res) => {
    const { name } = req.body;

    const sql = "INSERT INTO diagnosis (name) VALUES (?)";
    db.query(sql, [name], (err, result) => {
        if (err) {
            console.log(err);

            if (err.code === "ER_DUP_ENTRY") {
                req.flash('message', 'Symptom already exists!');
            } else {
                req.flash('message', 'Error inserting data!');
            }

            return res.redirect('/addDiagnosis');
        }

        req.flash('message', 'Symptom added successfully!');
        res.redirect('/addDiagnosis');
    });
};


export const DeleteDiagnosis = (req, res) => {
    const id = req.params.id;

    const sql = "DELETE FROM diagnosis WHERE id = ?";
    db.query(sql, [id], (err, result) => {
        if (err) {
            console.log(err);
            return res.render("diagnosis", { user: req.session.user,message: "Error!!" });
        }

        req.flash('message', 'Diagnosis deleted successfully!');
        res.redirect('/addDiagnosis');
    });
};

export const updateDiagnosis = (req, res) => {
    const id = req.params.id;
    const { name } = req.body;

    const sql = "UPDATE diagnosis SET name = ? WHERE id = ?";
    db.query(sql, [name, id], (err, result) => {
        if (err) {
            console.error(err);
            req.flash("message", "Error updating Diagnosis!");
            return res.redirect("/addDiagnosis");
        }

        req.flash("message", "Diagnosis updated successfully!");
        res.redirect("/addDiagnosis");
    });
};


