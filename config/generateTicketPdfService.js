const puppeteer = require("puppeteer");
const handlebars = require("handlebars");
const path = require("path");
const fs = require("fs-extra");

async function generatePdf(ticket) {
  // compile html from given data
  const compile = async function (templateName, _data) {
    const filePath = path.join(
      process.cwd(),
      "templates",
      `${templateName}.hbs`
    );

    // generate HTML
    const html = await fs.readFile(filePath, "utf-8");

    return handlebars.compile(html)(_data);
  };

  async function init() {
    try {
      const browser = await puppeteer.launch();
      const page = await browser.newPage();

      // PDF content
      const content = await compile("ticketTemplate", ticket);

      await page.setContent(content, { waitUntil: "networkidle2" });

      // create PDF
      await page.pdf({
        path: "invoice.pdf",
        format: "A4",
        // width: "302.36220472441 px",
        printBackground: true,
      });

      console.log(`Ticket pdf generated for user `);
      // shutdown the puppeteer browser
      await browser.close();

      return path.join(process.cwd(), "invoice.pdf");
    } catch (err) {
      console.log(
        `Error: Something went wrong in the Generate PDF module more info available(${
          err ? err : "no"
        })`
      );
    }
  }
  const response = await init();
  return response;
}

module.exports = generatePdf;
