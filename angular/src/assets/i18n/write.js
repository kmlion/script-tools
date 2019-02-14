const fs = require('fs');
const iterate = require('./generate.js');

const translations = {
  fr: ``
  de: ``,
  es: ``,
};

const english = JSON.parse(fs.readFileSync('./en.json'));

Object.keys(translations).forEach((lang) => {
  const lib = Object.assign({}, english);
  const translation = translations[lang].split(' ~ ');
  let index = 0;

  iterate(
    { obj: lib },
    'obj',
    (obj, key) => {
      obj[key] = translation[index];
      index++;
    },
    iterate
  );
  fs.writeFileSync(`${lang}.json`, JSON.stringify(lib));
  console.log(`wrote ${lang}.json`);
});
