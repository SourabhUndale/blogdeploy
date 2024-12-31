import axios from 'axios';
import cheerio from 'cheerio';

const url = 'https://chat.whatsapp.com/invite/K6kAucuZx62GyvfJ4F7TSm';

// Make a GET request to the URL using axios
axios.get(url)
  .then(response => {
    // Check if the response is successful
    if (!response.data) {
      throw new Error(`Failed to fetch the page. Status code: ${response.status}`);
    }

    // Parse the HTML content using Cheerio
    const $ = cheerio.load(response.data);

    // Fetch elements with both specified classes (_9vd5 and _9scb)
    const elementsWithBothClasses = $('._9vd5._9scb');

    // Log the text content of the found elements
    elementsWithBothClasses.each((index, element) => {
      console.log(`Element ${index + 1} Text: ${$(element).text()}`);
    });

    // Fetch image elements with the specified class (_9vx6)
    const imageElements = $('._9vx6');

    // Log the src attribute of each image element
    imageElements.each((index, element) => {
      const src = $(element).attr('src');
      console.log(`Image ${index + 1} Source: ${src}`);
    });

    // You can further process or manipulate the found elements and image sources as needed

  })
  .catch(error => {
    console.error('Error during fetch operation:', error);
  });
