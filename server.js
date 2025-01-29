let express = require("express");
let app = express();
let body_parser = require("body-parser");
let dbConnect = require("./config");
let jwt = require("jsonwebtoken");
let adminCollection = require("./models/admin");
let productCollection = require("./models/product");

let cookieParser = require("cookie-parser");
const { checkLoggedIn, checkNotLoggedIn } = require("./middleware/middleware");

app.set("view engine", "ejs");
app.use(body_parser.urlencoded({ extended: true }));
app.use(body_parser.json());
app.use(cookieParser());

app.get("/", checkLoggedIn, async (req, res) => {
  let products = await productCollection.find();
  res.render("dashboard.ejs", { products });
});

app.get("/register-admin", (req, res) => {
  res.render("AdminRegister.ejs");
});
app.post("/AdminRegister", async (req, res) => {
  let newAdminData = req.body;
  let result = new adminCollection({
    name: newAdminData.name,
    email: newAdminData.email,
    password: newAdminData.password,
  });
  let data = await result.save();
  console.log(data);

  res.redirect("/");
});

app.get("/login", checkNotLoggedIn, (req, res) => {
  res.render("auth/login.ejs", { alertMessage: "" });
});

app.post("/loginAdmin", async (req, res) => {
  let loginData = req.body;

  try {
    let user = await adminCollection.findOne({ email: loginData.email });

    if (loginData.password == user.password) {
      let token = jwt.sign({ id: user._id, role: user.role }, "Security_key", {
        expiresIn: "1h",
      });
      res.cookie("token", token, { httpOnly: true });
      res.redirect("/");
    } else {
      res.render("auth/login.ejs", {
        alertMessage: "Invalide User Or Password",
      });
    }
  } catch (err) {
    res.render("auth/login.ejs", { alertMessage: "Invalide User Or Password" });
  }
});

app.get("/add-product", (req, res) => {
  res.render("addProduct.ejs");
});
app.post("/add-product", async (req, res) => {
  let newProductData = req.body;
  let result = new productCollection({
    name: newProductData.name,
    price: newProductData.price,
    category: newProductData.category,
    availability: newProductData.availability,
    image: newProductData.image,
  });
  let data = await result.save();
  console.log(data);

  res.redirect("/");
});

app.get("/logout", async (req, res) => {
  try {
    res.clearCookie("token");
    res.redirect("/");
  } catch (err) {}
});

app.listen(4000, () => {
  console.log("Server Started on 4000");
});
