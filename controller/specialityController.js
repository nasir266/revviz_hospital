import db from "../config/db.js";

export const addSpecialityPage = (req, res) =>{

    const sql = "SELECT * FROM speciality";

    db.query(sql, (err, results) => {
        if (err) {
            console.error("Error fetching speciality:", err);
            return res.status(500).send("Error loading speciality");
        }
        res.render("speciality", { user: req.session.user,diagnosisList: results || [] });
    });

}

export const addSpecialityForm = (req, res) => {
    const { name } = req.body;

    const sql = "INSERT INTO speciality (name) VALUES (?)";
    db.query(sql, [name], (err, result) => {
        if (err) {
            console.log(err);

            if (err.code === "ER_DUP_ENTRY") {
                req.flash('message', 'speciality already exists!');
            } else {
                req.flash('message', 'Error inserting data!');
            }

            return res.redirect('/addSpeciality');
        }

        req.flash('message', 'Speciality added successfully!');
        res.redirect('/addSpeciality');
    });
};


export const DeleteSpeciality = (req, res) => {
    const id = req.params.id;

    const sql = "DELETE FROM speciality WHERE id = ?";
    db.query(sql, [id], (err, result) => {
        if (err) {
            console.log(err);
            return res.render("speciality", { user: req.session.user,message: "Error!!" });
        }

        req.flash('message', 'Speciality deleted successfully!');
        res.redirect('/addSpeciality');
    });
};

export const updateSpeciality = (req, res) => {
    const id = req.params.id;
    const { name } = req.body;

    const sql = "UPDATE speciality SET name = ? WHERE id = ?";
    db.query(sql, [name, id], (err, result) => {
        if (err) {
            console.error(err);
            req.flash("message", "Error updating Speciality!");
            return res.redirect("/addSpeciality");
        }

        req.flash("message", "Speciality updated successfully!");
        res.redirect("/addSpeciality");
    });
};


