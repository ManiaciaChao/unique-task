let searchBtn = document.querySelector(".SearchButton");
let searchInput = document.querySelector(".SearchHud__body");
let searchBtnIcon = searchBtn.querySelector("img");
searchBtn.addEventListener("click", () => {
    if (searchInput.style.width === "0px") {
        searchInput.style.width = "540px";
        searchBtn.style.background = "#FFF";
        searchBtnIcon.classList.add("inverted");
    } else {
        searchInput.style.width = "0";
        searchBtn.style.background = "#000";
        searchBtnIcon.classList.remove("inverted");
    }
})

let vBottom = window.scrollY + document.documentElement.clientHeight;
let vTop = window.scrollY;

window.addEventListener("scroll", () => {
    for (let i = 0; i < 6; i++) {
        if (window.scrollY + window.innerHeight >= document.querySelectorAll("section")[i].offsetTop) {
            document.querySelectorAll("section")[i].style.opacity = 1;
            console.log(i);
        }
    }
});
document.querySelectorAll("section")[0].style.opacity = 1
