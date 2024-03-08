const express = require("express");
const puppeteer = require("puppeteer");
const abs = require("absolutify");

const path = require("path");

const app = express();

const PORT = process.env.PORT || 4002;

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.send("/index.html");
});

app.get("/proxy", async (req, res) => {
  const { url } = req.query;

  if (!url) {
    res.send("Url is required");
  } else {
    try {
      const browser = await puppeteer.launch();
      const page = await browser.newPage();

      await page.goto(`https://${url}`);

      let document = await page.evaluate(
        () => document.documentElement.outerHTML
      );

      document = abs(document, `/proxy?url=${url}`);

      await browser.close();

      res.send(document);
    } catch (error) {
      console.log(error);
      res.send(error.message);
    }
  }
});

app.listen(PORT, () => console.log(`Server responded at ${PORT} port...`));
