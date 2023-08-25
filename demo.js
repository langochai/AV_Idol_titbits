const fs = require("fs");
const util = require("util");

// const readFile = util.promisify(fs.readFile);

// const demo = () => {
//   let result = "";
//   readFile("./session/user.json", "utf-8", (err, data) => {
//     if (err) {
//       console.log(err.message);
//     } else {
//       if (data.length === 0) {
//         result = "null";
//       } else {
//         let user = JSON.parse(data).userName;
//         if (user === "admin") {
//           result = "admin";
//         } else {
//           result = "user";
//         }
//       }
//     }
//   });
//   console.log(result);
//   return result;
// };

const readFile = async (filePath) => {
  try {
    const data = await fs.promises.readFile(filePath, "utf-8");
    return data;
  } catch (err) {
    console.log(err);
  }
};

const demo = async () => {
  let abc = await readFile("./session/user.json");
  return abc;
};

// console.log(demo());
