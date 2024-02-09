import express from "express";
import "dotenv/config";

const app = express();

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const port = process.env.NODE_PORT || 3000;

app.get("/users", async (req, res) => {
  const limit = +req.query.limit || 10;
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/users?_limit=${limit}`
  );
  const users = await response.json();

  res.status(200).send(`
    <h1 class="text-2xl">Users<h1>
    <ul>
      ${users.map((user) => `<li id="${user.id}">${user.name}</li>`).join("")}
    </ul>
  `);
});

app.post("/convert", async (req, res) => {
  const { farenheit } = req.body;
  const celsius = ((+farenheit - 32) * (5 / 9)).toFixed(2);
  console.log(celsius);

  res.send(`${farenheit}°F correspond à ${celsius}°C`);
});

app.get("/poll", (req, res) => {
  const randValue = Math.random(1, 100);
  res.send(`${randValue}`);
});

const response = await fetch(`https://jsonplaceholder.typicode.com/users`);
const contacts = await response.json();

app.post("/search", async (req, res) => {
  const searchTerm = req.body.search.toLowerCase();
  let filteredUsers = [];

  if (!searchTerm) {
    filteredUsers = contacts;
  } else {
    filteredUsers = contacts.filter((contact) => {
      const name = contact.name.toLowerCase();
      const email = contact.email.toLowerCase();
      return name.includes(searchTerm) || email.includes(searchTerm);
    });
  }

  const searchHtml = `${filteredUsers
    .map(
      (user) => `
      <tr>
        <td>
          <div class="my-2 p-2">${user.name}</div>
        </td>
        <td>
          <div class="my-2 p-2"><a target="_blank" href="mailto:${user.email}">${user.email}</a></div>
        </td>
      <tr>`
    )
    .join("")}`;

  res.send(searchHtml);
});

app.post("/contact/email", (req, res) => {
  const { email } = req.body;

  const emailRegex = /^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/;

  const isValid = {
    class: "text-green-700",
    message: "Email valide",
  };

  const isInvalid = {
    class: "text-red-700",
    message: "Email invalide",
  };

  const feedback = emailRegex.test(email) ? isValid : isInvalid;

  res.send(
    `<span class="text-sm ${feedback.class}">${feedback.message}</span>`
  );
});

app.listen(port, () => {
  console.log(`Serveur lancé sur cette adresse : http://localhost:${port}`);
});
