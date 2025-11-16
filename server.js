import express from 'express'
import path from 'path'
import { fileURLToPath } from "url";
import session from "express-session";
import flash from 'connect-flash';
import dotenv from "dotenv";
import bodyParser from "body-parser";

import router from "./routes/authRoutes.js";

import {h_index, logiPage, MainPage} from "./controller/mainController.js";
import {
    addOrgForm,
    addOrgPage,
    addPlan,
    addPlanForm, assignPlanForm, AssignPlanPage, getActiveUsers,
    getAllPlans, getNewUsers, getUnActiveUsers, deleteOrg, addUserPlan
} from "./controller/organizationController.js";
import {getLogin, login, logout} from "./controller/authController.js";
import {addDiagnosisForm, addDiagnosisPage, DeleteDiagnosis, updateDiagnosis} from "./controller/diagnosisController.js";
import {addSymptomsForm, addSymptomsPage, DeleteSymptom, updateSymptom} from "./controller/symptomsController.js";
import {addSpecialityPage, addSpecialityForm, DeleteSpeciality, updateSpeciality} from "./controller/specialityController.js";
import {
    DeleteUserType,
    updateUserType,
    userTypeForm,
    userTypePage,
    addUserPage,
    addUserForm,
    getAllUsers,
    deleteUser, updateUser
} from "./controller/userTypeController.js";
import {setUserForViews} from './middleware/userMiddleWare.js';
import {upload} from "./middleware/upload.js";
import {uploadLoginLogo} from "./middleware/uploadLogoImage.js";
import {isAuthenticated} from "./middleware/auth.js";
import {addDoctorForm, addDoctorPage, fetchDoctors} from "./controller/doctorsController.js";
import {setUserForSession} from "./middleware/session.js";
import {addImageForm, addLoginImagePage, addLoginlogoPage, addLogoForm, addFooterPage, addFooterForm} from "./controller/settingController.js";
import {uploadLoginImage} from "./middleware/uploadLoginImage.js";
//import {session} from "express-session";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express()




// Middleware

app.use(express.json());
app.use(setUserForViews);
app.use(setUserForSession);
// ✅ Session middleware (MUST come before routes)
app.use(
    session({
        secret: "supersecretkey",
        resave: false,
        saveUninitialized: true,
        cookie: { secure: false },

    })
);
app.use(flash());
app.use((req, res, next) => {
    res.locals.message = req.flash('message');
    next();
});
app.set('view engine', 'ejs');

app.use(express.urlencoded({extended:false}))

app.set("views", path.join(__dirname, "view"));

// Serve static files
app.use(express.static(path.join(__dirname, "public")));
/*app.use(express.static(publicPath))*/


//app.get('/', MainPage);

app.get("/",  isAuthenticated, MainPage);
app.get('/h_index', isAuthenticated, h_index)

//app.get('/login', logiPage)
app.get("/login",  getLogin);
app.post("/login", login);
app.get("/logout", logout);
/*logout*/

/*plans*/
app.get('/addPlan', isAuthenticated, addPlan)
app.post('/addPlanForm', isAuthenticated, addPlanForm)
app.get('/allPlans', isAuthenticated, getAllPlans)
app.get("/assignPlan", isAuthenticated, AssignPlanPage);
app.post("/assignPlanForm", isAuthenticated, assignPlanForm);

/*organization*/
app.get('/add_organization', isAuthenticated, addOrgPage)
app.post("/addOrgForm", upload.single("logo"), addOrgForm);
app.get("/allOrganization", isAuthenticated, getNewUsers);
app.get("/activeOrganization", isAuthenticated, getActiveUsers);
app.get("/unActiveOrganization", isAuthenticated, getUnActiveUsers);
app.get('/organization/delete/:id', isAuthenticated, deleteOrg);
app.post('/user/plan/add', isAuthenticated, addUserPlan);
//app.post('/addOrgForm', addOrgForm)

/*symptoms*/
app.get('/addSymptoms', isAuthenticated,  addSymptomsPage)
app.post('/addSymptoms', addSymptomsForm)
app.get('/DeleteSymptom/:id', isAuthenticated, DeleteSymptom);
app.post('/symptom/update/:id', isAuthenticated, updateSymptom);
/*daignosis*/
app.get('/addDiagnosis', isAuthenticated,  addDiagnosisPage)
app.post('/addDiagnosis', addDiagnosisForm)
app.get('/DeleteDiagnosis/:id', isAuthenticated, DeleteDiagnosis);
app.post('/diagnosis/update/:id', isAuthenticated, updateDiagnosis);
/*speciality*/
app.get('/addSpeciality', isAuthenticated,  addSpecialityPage)
app.post('/addSpeciality', addSpecialityForm)
app.get('/DeleteSpeciality/:id', isAuthenticated, DeleteSpeciality);
app.post('/speciality/update/:id', isAuthenticated, updateSpeciality);
/*userType*/
app.get('/userType', isAuthenticated,  userTypePage)
app.post('/userType', userTypeForm)
app.get('/DeleteUserType/:id', isAuthenticated, DeleteUserType);
app.post('/userType/update/:id', isAuthenticated, updateUserType);

/*User Module*/
app.get('/addUser', isAuthenticated, addUserPage);
app.post('/user/add', addUserForm);
app.get('/allUsers', getAllUsers);
app.post('/user/delete/:id', deleteUser);
app.post('/user/update/:id', updateUser);

/*doctors*/
app.get('/addDoctor', isAuthenticated, addDoctorPage);
app.post('/addDoctorForm',  addDoctorForm);
app.get('/allDoctors', isAuthenticated, fetchDoctors);

/*setting*/
app.get('/addLoginImagePage', isAuthenticated, addLoginImagePage)
app.post('/addImageForm', isAuthenticated, uploadLoginImage.single('image'), addImageForm)

app.get('/addLoginLogoPage', isAuthenticated, addLoginlogoPage)
app.post('/addLogoForm', isAuthenticated, uploadLoginLogo.single('image'), addLogoForm)

app.get('/addFooterPage', isAuthenticated, addFooterPage)
app.post('/addFooterForm', isAuthenticated, addFooterForm)

//app.listen('3400')

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log("Server running on port " + PORT));

