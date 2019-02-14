const fs = require('fs');

const base_lib = JSON.parse(fs.readFileSync('./en.json'));

const words_arr = [];

const iterate = (obj, key, action, alt_action) => {
  if (typeof obj[key] === 'object') {
    for (const new_key in obj[key]) {
      alt_action(obj[key], new_key, action, alt_action);
    }
  } else {
    action(obj, key);
    return;
  }
};

iterate({ obj: base_lib }, 'obj', (obj, key) => words_arr.push(obj[key]), iterate);
console.log(words_arr.join(' ~ '));

module.exports = iterate;
