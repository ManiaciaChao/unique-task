const theDivison2 = "the-division-2";
const assassinCreed = "assassins-creed-odyssey";
const forHonor = "for-honor";
const r6 = "rainbow-six-siege";
const newsCate = ["all", assassinCreed, forHonor, theDivison2, r6];

let newsStorage = [];
function renderNew(id, title, date, content, link, imgSrc) {

    return newsExample = `
        <div id="${id}" class="news-post" onclick="location.herf='${link}'">
            <div class="news-image">
                <img src="${imgSrc}">
            </div>
            <div class="news-content">
                <h3 class="news-title">${title}</h3>
                <p class="news-date">${date}</p>
                <div class="news-article">${content}</div>
            </div>
        </div>`
}
/**
 * typescript 
 * aaaaaa
 * @description hhhhhh
 * @param {string} keyword
 * @returns {boolean}
 */
function getNews(keyword) {

    return new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest();
        let xhrBody = '{"languages":["en-us"],"channels":["marketing"],"types":["article"],"filters":[{"field":"typeSlug","values":["news"]}],"size":6,"from":0,"sorts":[{"field":"createdAt","direction":"desc"}],"keyword":"' + keyword + '","fields":["categorySlug"],"appId":"f35adcb5-1911-440c-b1c9-48fdc1701c68"}';
        let xhrAll = '{"languages":["en-us"],"channels":["marketing"],"types":["article"],"filters":[{"field":"typeSlug","values":["news"]}],"size":6,"from":0,"sorts":[{"field":"createdAt","direction":"desc"}],"appId":"f35adcb5-1911-440c-b1c9-48fdc1701c68"}';
        xhr.open("POST", "https://search.ubisoft.com/api/v2/search", true);
        xhr.setRequestHeader("Content-Type", "application/json");

        xhr.onreadystatechange = function () {
            if (this.readyState === 4) {
                if (this.status === 200) {
                    resolve(JSON.parse(this.responseText), this);
                } else {
                    let resJson = { code: this.status, response: this.response }
                    reject(resJson, this);
                }
            }
        }

        if (keyword == "all") {
            xhr.send(xhrAll);
        } else {
            xhr.send(xhrBody);
        }
    })
}
//let keyword = assassinCreed;

//xhr.setRequestHeader();

class News {
    constructor(source) {
        this.id = source.id;
        this.title = source.title;
        this.link = source.link;
        this.content = source.content;
        this.thumbnail = source.thumbnail;
        this.author = source.author;
        this.date = source.createdAt;
    }
    getHTML() {
        return renderNew(this.id, this.title, this.date, this.content, this.link, this.thumbnail);
    }
}

class NewsSets {
    constructor(hits) {
        this.raw = hits;
        this.value = [];
        for (let i = 0; i < this.raw.length; i++) {
            this.value[i] = new News(this.raw[i]._source);
        }
    };
}

const newsModel = document.querySelector("#news-model");
const newsWrapper = document.querySelector(".news-wrapper");
const newsArea = newsWrapper.querySelector(".news-area");
const newsPosts = newsWrapper.querySelectorAll(".news-post");

//newsModel.style.display = "none";

const newsTabber = document.querySelectorAll(".news-tabber");

for (let i = 0; i < newsTabber.length; i++) {
    newsTabber[i].addEventListener("click", (event) => {
        if (newsStorage[i] === undefined) {
            newsStorage[i] = getNews(newsCate[i]);
        }
        newsStorage[i].then(
            (data) => {
            newsArea.innerHTML = "";
            const newsSet = new NewsSets(data.hits.hits);
            console.log(newsSet);
            for (let j = 0; j < newsSet.value.length; j++) {
                newsArea.innerHTML = newsArea.innerHTML.concat(newsSet.value[j].getHTML());
            }
        });
    })
}