import db from "../config/db.js";

export const addSymptomsPage = (req, res) =>{

    const sql = "SELECT * FROM symptoms";

    db.query(sql, (err, results) => {
        if (err) {
            console.error("Error fetching diagnosis:", err);
            return res.status(500).send("Error loading diagnosis");
        }
        res.render("symptoms", { user: req.session.user,diagnosisList: results || [] });
    });
    //res.render('symptoms',{user: req.session.user,message: null})

}

export const addSymptomsForm = (req, res) => {
    const { name } = req.body;

    const sql = "INSERT INTO symptoms (name) VALUES (?)";
    db.query(sql, [name], (err, result) => {
        if (err) {
            console.log(err);

            if (err.code === "ER_DUP_ENTRY") {
                req.flash('message', 'Symptom already exists!');
            } else {
                req.flash('message', 'Error inserting data!');
            }

            return res.redirect('/addSymptoms');
        }

        req.flash('message', 'Symptom added successfully!');
        res.redirect('/addSymptoms');
    });
};


export const DeleteSymptom = (req, res) => {
    const id = req.params.id;

    const sql = "DELETE FROM symptoms WHERE id = ?";
    db.query(sql, [id], (err, result) => {
        if (err) {
            console.log(err);
            return res.render("symptoms", { user: req.session.user,message: "Error!!" });
        }

        req.flash('message', 'Symptom deleted successfully!');
        res.redirect('/addSymptoms');
    });
};

export const updateSymptom = (req, res) => {
    const id = req.params.id;
    const { name } = req.body;

    const sql = "UPDATE symptoms SET name = ? WHERE id = ?";
    db.query(sql, [name, id], (err, result) => {
        if (err) {
            console.error(err);
            req.flash("message", "Error updating symptom!");
            return res.redirect("/addSymptoms");
        }

        req.flash("message", "Symptom updated successfully!");
        res.redirect("/addSymptoms");
    });
};


