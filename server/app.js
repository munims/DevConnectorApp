console.log("Hello from Node App");
console.log("Hello from Munim");

const express = require('express');
const app = express();

app.use(express.json());

app.use("/api/users", require("./routes/api/user"));
app.use("/api/profile", require("./routes/api/profile"));
app.use("/api/auth", require("./routes/api/auth"));
app.use("/api/posts", require("./routes/api/posts"));

const port = process.env.PORT || 5005;

//app.listen(5005, () => console.log(`Server Listening on port ${5005}`));

app.listen(port, () => {
    console.log(`Server Listening on port ${port}`);
});