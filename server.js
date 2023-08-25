const http = require("http");
const fs = require("fs");
const url = require("url");
const path = require("path");
const handlers = require("./src/controller/mainController");
const qs = require("qs");

const server = http.createServer((req, res) => {
  let parsedUrl = url.parse(req.url, true).pathname;
  let id = qs.parse(url.parse(req.url).query).id;
  let chosenHandlers;
  if (typeof router[parsedUrl] !== "undefined") {
    chosenHandlers = router[parsedUrl];
  } else {
    chosenHandlers = handlers.notFound;
  }
  chosenHandlers(req, res);
});

const router = {
  "/": handlers.displayDefault,
  "/random": handlers.getRandomActress,
  "/signin": handlers.signIn,
  "/signup": handlers.signUp,
  "/signout": handlers.signOut,
  "/search": handlers.searchQuery,
  "/detail": handlers.getActressByID,
  "/create": handlers.createPost,
  "/dashboard": handlers.displayDashboard,
  "/delete": handlers.deleteActress,
  "/deleteuser": handlers.deleteUser,
  "/update": handlers.updateActress,
  "/public/css/style.css": handlers.writeCSS,
  "/public/images/logoBlackMain.png": handlers.writeMainLogo,
  "/public/images/footerLogo.png": handlers.writeFooterLogo,
  "/public/images/desktopHero1.jpg": handlers.writeCarousel1stIMG,
  "/public/images/desktopHero2.jpg": handlers.writeCarousel2ndIMG,
  "/public/images/desktopHero3.jpg": handlers.writeCarousel3rdIMG,
  "/public/images/favicon.ico": handlers.writeFavicon,
  "/public/js/index.js": handlers.writeClientJS,
  "/sort-by-id-desc": handlers.displayOldest,
  "/sort-by-id-acd": handlers.displayNewest,
  "/sort-by-age-acd": handlers.displayByAge,
  "/public/images/404.jpg": handlers.writeErrorImg,
  "/sort-by-tags": handlers.getTags,
};
server.listen(8000, () => console.log(`Server started!`));
