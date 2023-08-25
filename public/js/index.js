function hiddenCheck() {
  document.getElementById("adult-screencheck").style.display = "none";
}

let currentN = 6;
const button = document.querySelector("#see-more-btn");
const rows = document.querySelectorAll(".row");

button.addEventListener("click", () => {
  currentN += 3;
  rows.forEach((row, index) => {
    if (index < currentN) {
      row.style.display = "flex";
    }
  });
});

function userTable() {
  document.getElementById("user-mng-table").style.display = "block";
  document.getElementById("data-mng-table").style.display = "none";
}

function dataTable() {
  document.getElementById("user-mng-table").style.display = "none";
  document.getElementById("data-mng-table").style.display = "block";
}

document.getElementById("ord-oldest").addEventListener("click", function () {
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      document.getElementById("cards-display").innerHTML = this.responseText;
    }
  };
  xhr.open("GET", "/sort-by-id-desc", true);
  xhr.send();
});

document.getElementById("ord-newest").addEventListener("click", function () {
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      document.getElementById("cards-display").innerHTML = this.responseText;
    }
  };
  xhr.open("GET", "/sort-by-id-acd", true);
  xhr.send();
});

document.getElementById("ord-age").addEventListener("click", function () {
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      document.getElementById("cards-display").innerHTML = this.responseText;
    }
  };
  xhr.open("GET", "/sort-by-age-acd", true);
  xhr.send();
});
