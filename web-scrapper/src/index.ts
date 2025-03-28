import {
  scrapeLinkedInCompany,
  scrapeLinkedInPerson,
} from "./scrapper/linkedin";

scrapeLinkedInPerson("https://www.linkedin.com/in/shawngranniss")
  .then((result) => {
    console.log(result);
  })
  .catch((err) => {
    console.log(err);
  });
