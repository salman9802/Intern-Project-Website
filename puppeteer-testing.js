/* import puppeteer from 'puppeteer';

(async () => {
  // Launch the browser and open a new blank page
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // Navigate the page to a URL
  await page.goto('https://developer.chrome.com/');

  // Set screen size
  await page.setViewport({width: 1080, height: 1024});

  // Type into search box
  await page.type('.devsite-search-field', 'automate beyond recorder');

  // Wait and click on first result
  const searchResultSelector = '.devsite-result-item-link';
  await page.waitForSelector(searchResultSelector);
  await page.click(searchResultSelector);

  // Locate the full title with a unique string
  const textSelector = await page.waitForSelector(
    'text/Customize and automate'
  );
  const fullTitle = await textSelector?.evaluate(el => el.textContent);

  // Print the full title
  console.log('The title of this blog post is "%s".', fullTitle);

  await browser.close();
})(); */

const puppeteer = require('puppeteer');

async function convertToPDF() {
    // const browser = await puppeteer.launch();
    const browser = await puppeteer.launch({ 
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
        timeout: 0,
        headless: true,
        defaultViewport: null
    });
    
    const page = await browser.newPage();

    // Set the HTML content
    const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>HTML to PDF</title>
            <style>
                /* Your CSS styles here */
            </style>
        </head>
        <body>
            <h1>Hello, World!</h1>
            <p>This is a sample HTML content.</p>
        </body>
        </html>
    `;

    // Set a longer timeout
    await page.setDefaultNavigationTimeout(0); // Set to 0 for no timeout

    await page.setContent(htmlContent);

    // Convert to PDF
    await page.pdf({ path: 'output.pdf', format: 'A4' });

    await browser.close();
}

convertToPDF();
