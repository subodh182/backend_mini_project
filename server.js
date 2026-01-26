import http from "http";
import fs from "fs";
import path from "path";

const server = http.createServer((req, res) => {
  console.log(req.url, req.method);

  // HOME PAGE
  if (req.url === "/") {
    fs.readFile("./pages/home.html", (err, data) => {
      res.writeHead(200, { "Content-Type": "text/html" });
      res.write(data);
      return res.end();
    });
  }

  // REGISTER PAGE
  else if (req.url === "/register" && req.method === "GET") {
    fs.readFile("./pages/register.html", (err, data) => {
      res.writeHead(200, { "Content-Type": "text/html" });
      res.write(data);
      return res.end();
    });
  }

  // FORM SUBMIT
  else if (req.url === "/submit" && req.method === "POST") {
    const body = [];

    req.on("data", (chunk) => {
      body.push(chunk);
    });

    req.on("end", () => {
      const parsedData = Buffer.concat(body).toString();
      const params = new URLSearchParams(parsedData);

      const username = params.get("username");
      const password = params.get("password");

      const userInfo = `Name: ${username}, Password: ${password}\n`;

      fs.appendFile("users.txt", userInfo, (err) => {
        if (err) throw err;
        console.log("User data saved");
      });

      res.statusCode = 302;
      res.setHeader("Location", "/userprofile");
      return res.end();
    });
  }

  // USER PROFILE
  else if (req.url === "/userprofile") {
    fs.readFile("users.txt", "utf8", (err, data) => {
      if (err) data = "";

      const lines = data.trim().split("\n");
      let cards = "";

      lines.forEach((line) => {
        cards += `
          <div style="border:1px solid black; padding:10px; margin:10px; width:250px;">
            ${line}
          </div>
        `;
      });

      fs.readFile("./pages/profile.html", "utf8", (err, html) => {
        const finalPage = html.replace("{{CARDS}}", cards);
        res.writeHead(200, { "Content-Type": "text/html" });
        res.write(finalPage);
        return res.end();
      });
    });
  }
});

server.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
