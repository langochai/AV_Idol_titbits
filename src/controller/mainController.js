const fs = require("fs");
const qs = require("qs");
const handlers = {};
const ActressModel = require("../model/actress.model");
const url = require("url");
const UserModel = require("../model/user.model");
const userTemplate = require("./userIconTemplate.js");

handlers.readFileData = async (filePath) => {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, "utf-8", (err, data) => {
      if (err) reject(err);
      resolve(data);
    });
  });
};

handlers.checkUserStatus = () => {
  return new Promise((resolve, reject) => {
    fs.readFile("./session/user.json", "utf-8", (err, data) => {
      if (err) {
        reject(err);
      } else {
        if (data.length === 0) {
          resolve("null");
        } else {
          let user = JSON.parse(data).userName;
          if (user === "admin") {
            resolve("admin");
          } else {
            resolve("user");
          }
        }
      }
    });
  }).catch((err) => {
    console.log(err);
  });
};

handlers.signIn = async (req, res) => {
  if (req.method === "GET") {
    let currentUser = fs.readFileSync("././session/user.json", "utf-8");
    if (currentUser === "") {
      fs.readFile("./src/views/signin.html", "utf-8", (err, data) => {
        if (err) {
          console.log(err.message);
        } else {
          res.writeHead(200, { "Content-Type": "text/html" });
          res.write(data);
          res.end();
        }
      });
    } else {
      currentUser = JSON.parse(currentUser); //giờ ta đã lấy được user đã log in
      res.end();
    }
  } else {
    let loggedInData = "";
    req.on("data", (chunk) => {
      loggedInData += chunk;
    });
    req.on("end", async () => {
      let userInfo = JSON.stringify(qs.parse(loggedInData));
      let { userName, userPassword } = qs.parse(loggedInData);
      let checkSignIn = await UserModel.checkSignIn(
        userName,
        userPassword
      ).catch((err) => {
        console.log(err);
      });
      if (checkSignIn[0]) {
        await fs.writeFile(
          "././session/user.json",
          userInfo,
          "utf-8",
          (err) => {
            if (err) {
              console.log(err.message);
            }
          }
        );
        res.writeHead(301, { Location: "/" });
        res.end("log in success");
      } else {
        res.writeHead(301, { Location: "/signin" });
        fs.readFile("././src/views/signin.html", "utf-8", (err, data) => {
          if (err) {
            console.log(err.message);
          } else {
            let beforeData = `Chưa có tài khoản?`;

            let afterData = `Tên đăng nhập hoặc mật khẩu không đúng! `;

            data = data.replace(beforeData, afterData);
            res.writeHead(200, { "Content-Type": "text/html" });
            res.write(data);
            res.end();
          }
        });
      }
    });
  }
};

handlers.signUp = (req, res) => {
  if (req.method === "GET") {
    fs.readFile("./src/views/signup.html", "utf-8", (err, data) => {
      if (err) {
        console.log(err.message);
      } else {
        res.writeHead(200, { "Content-Type": "text/html" });
        res.write(data);
        res.end();
      }
    });
  } else {
    let signUpData = "";
    req.on("data", (chunk) => {
      signUpData += chunk;
    });
    req.on("end", async () => {
      signUpData = qs.parse(signUpData);
      let {
        userSignInName,
        userPassword,
        userName,
        userEmail,
        userAge,
        userPhoneNum,
      } = signUpData;
      await UserModel.addUser(
        userSignInName,
        userPassword,
        userName,
        userEmail,
        userAge,
        userPhoneNum
      ).catch((err) => {
        console.log(err);
      });
      console.log("sign up success");
      res.writeHead(301, { Location: "/signin" });
      res.end();
    });
  }
};

handlers.signOut = (req, res) => {
  let data = "";
  fs.writeFile("./session/user.json", data, (err) => {
    if (err) {
      console.log(err.message);
    }
  });
  res.writeHead(301, { Location: "/" });
  res.end();
};

handlers.deleteUser = async (req, res) => {
  let id = qs.parse(url.parse(req.url).query).id;
  if (id !== 1) {
    await UserModel.deleteUser(id).catch((err) => {
      console.log(err);
    });
  } else {
    console.log(`Can't delete admin!`);
  }
  handlers.displayDashboard(req, res);
};

// ACTRESS HANDLER

handlers.getRandomActress = async (req, res) => {
  let order = await ActressModel.displayAllActress();
  let randomNum = Math.floor(Math.random() * order.length);
  res.writeHead(301, { Location: `/detail?id=${order[randomNum].id}` });
  res.end();
};

handlers.deleteActress = async (req, res) => {
  let id = qs.parse(url.parse(req.url).query).id;
  await ActressModel.deleteActressByID(id);
  handlers.displayDashboard(req, res);
};

handlers.getActressByID = async (req, res) => {
  try {
    let id = qs.parse(url.parse(req.url).query).id;
    let order = await ActressModel.getActressByID(id);
    // let order = await ActressModel.getTags(id);
    let name = order[0].name;
    let age = order[0].age;
    let height = order[0].height;
    let weight = order[0].weight;
    let bustsize = order[0].bust_size;
    let waistsize = order[0].waist_size;
    let hipsize = order[0].hip_size;
    // let tags = order[0].characteristic;
    let urltxt = order[0].urltxt;

    let data = await handlers.readFileData("./src/views/detail.html");
    data = data.replace(
      "https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/Solid_white.svg/2048px-Solid_white.svg.png",
      urltxt
    );
    data = data.replace("{name}", name);
    data = data.replace("{age}", age);
    data = data.replace("{height}", height);
    data = data.replace("{weight}", weight);
    data = data.replace("{bust_size}", bustsize);
    data = data.replace("{waist_size}", waistsize);
    data = data.replace("{hip_size}", hipsize);
    // data = data.replace("{tags}", tags);
    res.writeHead(200, { "Content-Type": "text/html" });
    res.write(data);
    res.end();
  } catch (err) {
    console.log(err.message);
  }
};

handlers.updateActress = async (req, res) => {
  let id = qs.parse(url.parse(req.url).query).id;
  let actress = await ActressModel.getActressByID(id);
  if (req.method === "GET") {
    fs.readFile("./src/views/updateIdol.html", "utf-8", (err, data) => {
      if (err) {
        console.log(err.message);
      } else {
        res.writeHead(200, { "Content-Type": "text/html" });
        data = data.replace("{idolName}", actress[0].name);
        data = data.replace("{idolAge}", actress[0].age);
        data = data.replace("{idolHeight}", actress[0].height);
        data = data.replace("{idolWeight}", actress[0].weight);
        data = data.replace("{idolBust}", actress[0].bust_size);
        data = data.replace("{idolBust}", actress[0].bust_size);
        data = data.replace("{idolWaist}", actress[0].waist_size);
        data = data.replace("{idolHip}", actress[0].hip_size);
        data = data.replace("{idolUrlTxt}", actress[0].urltxt);
        res.write(data);
        res.end();
      }
    });
  } else if (req.method === "POST") {
    let parsedData = "";
    req.on("data", (chunk) => {
      parsedData += chunk;
    });
    req.on("end", async () => {
      parsedData = qs.parse(parsedData);
      await ActressModel.updateActress(
        id,
        parsedData.idolName,
        parsedData.idolAge,
        parsedData.idolHeight,
        parsedData.idolWeight,
        parsedData.idolBust,
        parsedData.idolWaist,
        parsedData.idolHip,
        parsedData.idolUrlTxt
      ).catch((err) => {
        console.log(err);
      });
      res.writeHead(301, { Location: "./dashboard" });
      res.end();
    });
  }
};

// DISPLAY HANDLE

handlers.displayOldest = async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  let model = await ActressModel.displayOldest();
  let html = "";
  model.forEach((item) => {
    html += '<div class="row">';
    html += '<div class="col-sm">';
    html += '<div class="card" style="width: 18rem">';
    html += '<img class="card-img-top" src="';
    html += item.urltxt;
    html += '" alt="Card image cap"/>';
    html += '<div class="card-body">';
    html += '<h5 class="card-title">';
    html += item.name;
    html += '</h5><p class="card-text">';
    html += item.age;
    html += '</p><a href="/detail?id=';
    html += item.id;
    html += '" class="btn btn-primary cards-btn">';
    html += "Xem chi tiết!</a></div></div></div></div>";
  });
  res.writeHead(200, { "Content-Type": "text/html" });
  res.write(html);
  res.end();
};

handlers.displayNewest = async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  let model = await ActressModel.displayAllActress();
  let html = "";
  model.forEach((item) => {
    html += '<div class="row">';
    html += '<div class="col-sm">';
    html += '<div class="card" style="width: 18rem">';
    html += '<img class="card-img-top" src="';
    html += item.urltxt;
    html += '" alt="Card image cap"/>';
    html += '<div class="card-body">';
    html += '<h5 class="card-title">';
    html += item.name;
    html += '</h5><p class="card-text">';
    html += item.age;
    html += '</p><a href="/detail?id=';
    html += item.id;
    html += '" class="btn btn-primary cards-btn">';
    html += "Xem chi tiết!</a></div></div></div></div>";
  });
  res.writeHead(200, { "Content-Type": "text/html" });
  res.write(html);
  res.end();
};

handlers.displayByAge = async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  let model = await ActressModel.displayByAgeAcd();
  let html = "";
  model.forEach((item) => {
    html += '<div class="row">';
    html += '<div class="col-sm">';
    html += '<div class="card" style="width: 18rem">';
    html += '<img class="card-img-top" src="';
    html += item.urltxt;
    html += '" alt="Card image cap"/>';
    html += '<div class="card-body">';
    html += '<h5 class="card-title">';
    html += item.name;
    html += '</h5><p class="card-text">';
    html += item.age;
    html += '</p><a href="/detail?id=';
    html += item.id;
    html += '" class="btn btn-primary cards-btn">';
    html += "Xem chi tiết!</a></div></div></div></div>";
  });
  res.writeHead(200, { "Content-Type": "text/html" });
  res.write(html);
  res.end();
};

handlers.displayDefault = (req, res) => {
  fs.readFile("./src/views/index.html", "utf-8", async (err, data) => {
    if (err) {
      console.log(err.message);
    } else {
      try {
        let model = await ActressModel.displayOldest();
        let html = "";
        model.forEach((item) => {
          html += '<div class="row">';
          html += '<div class="col-sm">';
          html += '<div class="card" style="width: 18rem">';
          html += '<img class="card-img-top" src="';
          html += item.urltxt;
          html += '" alt="Card image cap"/>';
          html += '<div class="card-body">';
          html += '<h5 class="card-title">';
          html += item.name;
          html += '</h5><p class="card-text">';
          html += item.age;
          html += '</p><a href="/detail?id=';
          html += item.id;
          html += '" class="btn btn-primary cards-btn">';
          html += "Xem chi tiết!</a></div></div></div></div>";
        });
        data = data.replace("{card-template-model}", html);
        let userStatus = await handlers.checkUserStatus();
        if (userStatus === "admin") {
          data = data.replace("{user-template-icon}", userTemplate.admin);
        } else if (userStatus === "user") {
          data = data.replace("{user-template-icon}", userTemplate.user);
        } else {
          data = data.replace("{user-template-icon}", userTemplate.defaultUser);
        }
        res.writeHead(200, { "Content-Type": "text/html" });
        res.write(data);
        res.end();
      } catch (err) {
        console.log(err.message);
      }
    }
  });
};

handlers.displayDashboard = async (req, res) => {
  let userStatus = await handlers.checkUserStatus();
  let users = await UserModel.getAllUser();
  let idols = await ActressModel.displayAllActress();
  if (userStatus === "admin") {
    fs.readFile("./src/views/dashboard.html", "utf-8", (err, data) => {
      if (err) {
        console.log(err.message);
      } else {
        let html = "";
        users.forEach((item) => {
          html += `<tr>
          <td>${item.id}</td>
          <td>${item.username}</td>
          <td>${item.name}</td>
          <td>${item.email}</td>
          <td>${item.phone}</td>
          <td><a href="/updateuser?id=${item.id}" class="btn btn-warning btn-update">Update</a></td>
          <td><a href="/deleteuser?id=${item.id}" class="btn btn-warning btn-delete">Delete</a></td>
        </tr>`;
        });

        let idolHtml = "";
        idols.forEach((item) => {
          idolHtml += `<tr>
          <td>${item.id}</td>
          <td>${item.name}</td>
          <td>${item.age}</td>
          <td>${item.height} Cm</td>
          <td>${item.weight} Kg</td>
          <td><a href="/update?id=${item.id}" class="btn btn-warning btn-update">Update</a></td>
          <td><a href="/delete?id=${item.id}" class="btn btn-warning btn-delete">Delete</a></td>
        </tr>`;
        });
        data = data.replace("{update-users-info}", html);
        data = data.replace("{update-idols-info}", idolHtml);
        res.writeHead(200, { "Content-Type": "text/html" });
        res.write(data);
        res.end();
      }
    });
  } else {
    res.writeHead(301, { Location: "/" });
    res.end();
  }
};

handlers.writeCSS = (req, res) => {
  res.writeHead(200, { "Content-Type": "text/css" });
  res.write(fs.readFileSync("./public/css/style.css"));
  res.end();
};

handlers.writeClientJS = (req, res) => {
  fs.readFile("./public/js/index.js", "utf-8", (err, data) => {
    if (err) {
      console.log(err.message);
    } else {
      res.writeHead(200, { "Content-Type": "text/js" });
      res.write(data);
      res.end();
    }
  });
};

handlers.writeCarousel1stIMG = (req, res) => {
  fs.readFile("./public/images/desktopHero1.jpg", (err, data) => {
    if (err) {
      console.log(err.message);
    } else {
      res.writeHead(200, { "Content-Type": "image/jpg" });
      res.write(data);
      res.end();
    }
  });
};

handlers.writeCarousel2ndIMG = (req, res) => {
  fs.readFile("./public/images/desktopHero2.jpg", (err, data) => {
    if (err) {
      console.log(err.message);
    } else {
      res.writeHead(200, { "Content-Type": "image/jpg" });
      res.write(data);
      res.end();
    }
  });
};

handlers.writeCarousel3rdIMG = (req, res) => {
  fs.readFile("./public/images/desktopHero3.jpg", (err, data) => {
    if (err) {
      console.log(err.message);
    } else {
      res.writeHead(200, { "Content-Type": "image/jpg" });
      res.write(data);
      res.end();
    }
  });
};

handlers.writeErrorImg = (req, res) => {
  fs.readFile("./public/images/404.jpg", (err, data) => {
    if (err) {
      console.log(err.message);
    } else {
      res.writeHead(200, { "Content-Type": "image/jpg" });
      res.write(data);
      res.end();
    }
  });
};

handlers.writeErrorImg = (req, res) => {
  fs.readFile("./public/images/404.jpg", (err, data) => {
    if (err) {
      console.log(err.message);
    } else {
      res.writeHead(200, { "Content-Type": "image/jpg" });
      res.write(data);
      res.end();
    }
  });
};

handlers.writeMainLogo = (req, res) => {
  fs.readFile("./public/images/logoBlackMain.png", (err, data) => {
    if (err) {
      console.log(err.message);
    } else {
      res.writeHead(200, { "Content-Type": "image/jpg" });
      res.write(data);
      res.end();
    }
  });
};

handlers.writeFooterLogo = (req, res) => {
  fs.readFile("./public/images/footerLogo.png", (err, data) => {
    if (err) {
      console.log(err.message);
    } else {
      res.writeHead(200, { "Content-Type": "image/jpg" });
      res.write(data);
      res.end();
    }
  });
};

handlers.writeErrorImg = (req, res) => {
  fs.readFile("./public/images/404.jpg", (err, data) => {
    if (err) {
      console.log(err.message);
    } else {
      res.writeHead(200, { "Content-Type": "image/jpg" });
      res.write(data);
      res.end();
    }
  });
};

handlers.writeFavicon = (req, res) => {
  fs.readFile("./public/images/favicon.ico", (err, data) => {
    if (err) {
      console.log(err.message);
    } else {
      res.writeHead(200, { "Content-Type": "image/jpg" });
      res.write(data);
      res.end();
    }
  });
};

handlers.notFound = (req, res) => {
  fs.readFile("./src/views/404.html", "utf-8", (err, data) => {
    if (err) {
      console.log(err.message);
    } else {
      res.writeHead(200, { "Content-Type": "text/html" });
      res.write(data);
      res.end();
    }
  });
};

handlers.searchQuery = (req, res) => {
  let parsedData = "";
  if (req.method === "GET") {
    fs.readFile("./src/views/index.html", "utf8", (err, data) => {
      req.on("data", (chunk) => {
        parsedData += chunk;
      });
      req.on("end", () => {
        parsedData = qs.parse(parsedData);
        res.end();
      });
    });
  }
};

handlers.createPost = (req, res) => {
  let parsedData = "";
  if (req.method === "GET") {
    fs.readFile("./src/views/create.html", "utf-8", (err, data) => {
      if (err) {
        console.log(err.message);
      } else {
        res.writeHead(200, { "Content-Type": "text/html" });
        res.write(data);
        res.end();
      }
    });
  } else {
    req.on("data", (chunk) => {
      parsedData += chunk;
    });
    req.on("end", async () => {
      parsedData = qs.parse(parsedData);
      await ActressModel.addActress(
        parsedData.idolName,
        parsedData.idolAge,
        parsedData.idolHeight,
        parsedData.idolWeight,
        parsedData.idolBust,
        parsedData.idolWaist,
        parsedData.idolHip,
        parsedData.idolUrlTxt
      ).catch((err) => {
        console.log(err.message);
      });
      res.writeHead(301, { Location: "/" });
      res.end();
    });
  }
};

module.exports = handlers;
