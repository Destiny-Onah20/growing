require("dotenv").config()
const express = require("express");
const { api } = require("./helpers/cloudinary");
const adminRoute = require("./routers/adminRoutes");
const routes = require("./routers/post");
const userRoute = require("./routers/userRoutes");


const port = process.env.PORT;

const app = express();
app.use(express.json());
app.use(express.static("./uploads"));

app.listen(port, ()=>{
    console.log(`Listening to port: ${port}`)
});

app.use("/uploaded", express.static(process.cwd() + "/uploads"))
app.use("/api", adminRoute);
app.use("/api", userRoute);
app.use("/api", routes);
