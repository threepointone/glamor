// this will generate the prefixer data used by inline-style-prefixer
// prefixer data is placed inside `./src/plugins/prefixer-data.ts`
// run this script manually when you change your browser support
const generateData = require('inline-style-prefixer/generator');
const { join } = require('path');

const browserList = {
  chrome: 30,
  android: 4,
  firefox: 25,
  ios_saf: 7,
  safari: 7,
  ie: 10,
  ie_mob: 10,
  edge: 12,
  opera: 13,
  op_mini: 5,
  and_uc: 9,
  and_chr: 30
}

generateData(browserList, {
  staticPath: join(__dirname, '..', 'src', 'plugins', 'prefixer-data.ts')
});
