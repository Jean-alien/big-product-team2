const withMT = require("@material-tailwind/html/utils/withMT");
 
module.exports = withMT({
  content: [
   "./views/*.{html,ejs,js}",
   "./node_modules/tw-elements/js/*.js"
  ],
  theme: {
    extend: {},
  },
  plugins: [],
});