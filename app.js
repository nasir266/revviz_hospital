import express from 'express'
import path from 'path'
import { fileURLToPath } from "url";
import {logiPage, MainPage} from "./controller/mainController.js";
import {addOrgForm, addOrgPage} from "./controller/organizationController.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express()
app.set('view engine', 'ejs');

app.use(express.urlencoded({extended:false}))

app.set("views", path.join(__dirname, "view"));

// Serve static files
app.use(express.static(path.join(__dirname, "public")));
/*app.use(express.static(publicPath))*/


app.get('/', MainPage);
app.get('/a_index', (req,res)=>{
    res.render('a_index')
})

app.get('/login', logiPage)
app.get('/add_organization', addOrgPage)
app.post('/addOrgForm', addOrgForm)
app.listen('3400')
