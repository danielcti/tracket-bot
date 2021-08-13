const puppeteer = require("puppeteer");
const { formatProduct } = require("./utils");

async function getCategories(item) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(item.url);
  await page.waitForSelector(item.categorySelectorParent);
  const value = await page.evaluate(
    (item) =>
      Array.from(
        document.querySelectorAll(
          `${item.categorySelectorParent}${item.categorySelectorChild}`
        ),
        (e) => e.textContent
      ),
    item
  );


  let result = "Escolha 1 das opções abaixo\n";
  value.forEach((item, i) => (result = `${result}${i + 1}) ${item}\n`));
  await browser.close();
  return result;
}

async function getItems(item, category) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(item.url);
  await page.waitForSelector(item.categorySelectorParent);

  let producttype = (await page.$(".close-btn")) || "";

  if (producttype) {
    await page.click(".close-btn");
  }

  await page.click(
    `${item.categorySelectorParent}:nth-child(${category})${item.categorySelectorChild}`
  );
  await page.waitForSelector(item.itemSelectorParent);
  const items = await page.evaluate(
    (item) =>
      Array.from(document.querySelectorAll(item.itemSelectorChild), (e) => {
        return {
          title: e.querySelector(item.titleSelector).textContent.trim(),
          price: e.querySelector(item.priceSelector).textContent.trim(),
          url: e.querySelector(item.urlSelector).href.trim(),
        };
      }),
    item
  );

  return formatProduct(items);
}

module.exports = { getCategories, getItems };
