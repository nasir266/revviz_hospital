import db from "../config/db.js";

export const addLoginImagePage = (req, res) =>{
    res.render('addLoginImagePage', { user: req.session.user, message: null })

}


export const addImageForm  = (req, res) => {
    //const { image } = req.body;
    const image = req.file ? req.file.filename : null;
    var status = 0;
    const sql = "INSERT INTO loginimage (image, status) VALUES (?,?)";
    db.query(sql, [image, status], (err, result) => {
        if (err) {
            console.log(err);
            return res.render("addLoginImagePage", { user: req.session.user, message: "Error Inserting Data!" });
        }
        //res.status(200).json({ message: "User added successfully!", userId: result.insertId });
        return res.render("addLoginImagePage", { user: req.session.user, message: "added successfully!" });
    });
};


export const addLoginlogoPage = (req, res) =>{
    res.render('addLoginLogoPage', { user: req.session.user, message: null })

}



export const addLogoForm  = (req, res) => {
    //const { image } = req.body;
    const image = req.file ? req.file.filename : null;
    var status = 0;
    const sql = "INSERT INTO loginlogo (image, status) VALUES (?,?)";
    db.query(sql, [image, status], (err, result) => {
        if (err) {
            console.log(err);
            return res.render("addLoginLogoPage", { user: req.session.user, message: "Error Inserting Data!" });
        }
        //res.status(200).json({ message: "User added successfully!", userId: result.insertId });
        return res.render("addLoginLogoPage", { user: req.session.user, message: "added successfully!" });
    });
};


export const addFooterPage = (req, res) =>{
    res.render('addFooterPage', { user: req.session.user, message: null })

};

export const addFooterForm  = (req, res) => {
    const { footer } = req.body;
    var status = 0;
    const sql = "INSERT INTO footer (footer, status) VALUES (?,?)";
    db.query(sql, [footer, status], (err, result) => {
        if (err) {
            console.log(err);
            return res.render("addFooterPage", { user: req.session.user, message: "Error Inserting Data!" });
        }
        //res.status(200).json({ message: "User added successfully!", userId: result.insertId });
        return res.render("addFooterPage", { user: req.session.user, message: "added successfully!" });
    });
};
export const getAllDiagnosis = (req, res) => {
    const sql = "SELECT * FROM diagnosis";

    db.query(sql, (err, results) => {
        if (err) {
            console.error("Error fetching diagnosis:", err);
            return res.status(500).send("Error loading diagnosis");
        }

        // Ensure results is always an array
        res.render("allDiagnosis", { user: req.session.user, diagnosisList: results || [] });
    });
};
