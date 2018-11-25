let sW = document.body.clientWidth;
let sH = document.body.clientHeight;

let caroContainer = document.getElementsByClassName("caro-container");
let caroPanel = document.querySelector(".caro-panel");
let caroPanelUnit = document.getElementsByClassName("caro-panel-unit");
let uW = caroPanelUnit[0].offsetWidth;

let mR = document.querySelector(".caro-panel-wrapper").offsetLeft;


let caroLen = caroContainer.length;
let caroULen = caroPanelUnit.length;

let sliderWrappers = document.querySelectorAll(".slider-wrapper");
const sldWLen = sliderWrappers.length;

let xCur, xBgn, xVar;
let mDown = false;

caroShow(parseInt(caroLen / 2));


function caroScrollto(x) {
    for (let i = 0; i < caroULen; i++) {
        caroPanelUnit[i].querySelector("img").style.width = "60%";
        caroPanelUnit[i].querySelector("span").style.opacity = "0";
    }
    let nW = sW / 2 - (x + 0.5) * uW - mR;
    caroPanel.style.marginLeft = nW + "px";
    caroPanelUnit[x].querySelector("img").style.width = "100%";
    caroPanelUnit[x].querySelector("span").style.opacity = "1";
}
function caroBack(x) {
    //caroPanel.classList.add("non-animate");
    //setTimeout(caroScrollto(3),10);
    //setTimeout(caroPanel.classList.remove("non-animate",15);
    //console.log("3!");

    //setTimeout(caroScrollto(3),10);
    //console.log
    var rmv = function () { caroPanel.classList.remove("non-animate") };
    caroPanel.classList.add("non-animate");
    setTimeout(caroScrollto(x + 2), 10);
    setTimeout(rmv, 11);
}

function caroCenterize(element) {

}

function caroShow(x) {
    for (let i = 0; i < caroLen; i++) {
        if (i != x) {
            caroContainer[i].querySelector(".caro-info").style.display = "none";
            //caroContainer[i].querySelector(".caro-btnset").style.opacity = "0";
            caroContainer[i].querySelectorAll(".caro-btn")[0].style.opacity = "0";
            caroContainer[i].querySelectorAll(".caro-btn")[1].style.opacity = "0";
        } else {
            caroContainer[i].querySelector(".caro-info").style.display = "";
            caroContainer[i].querySelector(".caro-info").style.opacity = "1";
            setTimeout(function () { caroContainer[i].querySelectorAll(".caro-btn")[0].style.opacity = "0.9"; }, 50);;
            setTimeout(function () { caroContainer[i].querySelectorAll(".caro-btn")[1].style.opacity = "0.9"; }, 200);;

        }
    }
    for (let i = 0; i < caroLen; i++) {
        if (i != x) {
            caroContainer[i].classList.remove("active");
        } else {
            caroContainer[i].classList.add("active");
        }
    }
    caroScrollto(x + 2);
}


function getX(event) {
    return event.clientX;
}

let cW = sliderWrappers[0].querySelector(".slider-section").offsetWidth;

function sldShow(wrapper, section) {
    let c = document.querySelectorAll(".slider-wrapper")[wrapper];
    let s = c.querySelectorAll(".slider-section");
    let cML = c.offsetLeft;
    let nW;
    const rmv = () => { c.classList.remove("non-animate"); }
    const mov = () => {
        nW = sW / 2 - (section + 0.5) * cW;
        c.style.marginLeft = nW + "px";
        s[section - 1].classList.remove("on");
        s[section + 1].classList.remove("on");
        s[section].classList.add("on");
    }
    if (section == 0) {
        console.log("Backing!");
        nW = sW / 2 - (s.length - 2 + 0.5) * cW;
        c.classList.add("non-animate");
        c.style.marginLeft = nW + "px";
        section = s.length - 3;
        setTimeout(rmv, 2);

    }
    else if (section == s.length - 2) {
        console.log("Backing!");
        nW = sW / 2 - (1 + 0.5) * cW;
        c.classList.add("non-animate");
        c.style.marginLeft = nW + "px";
        section = 2;
        setTimeout(rmv, 2);
    }
    setTimeout(mov, 3);

}

sldShow(0, parseInt(4));
sldShow(1, parseInt(4));

class sldWrapper {
    constructor(value) {
        this.value = value;
        this.ptr = sldWrapper[value];
        this.sct = sldWrapper[value].querySelectorAll(".slider-section");
    };
    show(wrapper, section) {
        let cML = document.querySelectorAll(".slider-wrapper")[wrapper].offsetLeft;
        let nW = cW / 2 - (section + 0.5) * cW - cML;
        caroPanel.style.marginLeft = nW + "px";
    };
}


// Event Registers
// Event of Carousel

for (let i = 0; i < caroLen; i++) {
    caroPanelUnit[i + 2].addEventListener('click', function () {
        caroShow(i);
    });
    caroPanelUnit[i + 2].addEventListener('mousedown', function () {
        console.log("mouseDown");
        getX(event);
    });
}
for (let i = 0; i < 2; i++) {
    caroPanelUnit[i].addEventListener('click', function () {
        caroShow(caroLen + i - 2);
        caroBack(caroLen + i - 2);

    });
}
for (let i = 0; i < 2; i++) {
    caroPanelUnit[caroULen - 2 + i].addEventListener('click', function () {
        caroShow(i);
        caroBack(i);
    });
}


// Event of Slider
let sML;
for (let i = 0; i < sldWLen; i++) {
    let sldSlen = sliderWrappers[i].querySelectorAll(".slider-section").length;
    console.log(sldSlen);
    for (let j = 0; j < sldSlen; j++) {
        let sldS = sliderWrappers[i].querySelectorAll(".slider-section")[j];
        sldS.addEventListener('mousedown', function (event) {
            if (!mDown) {
                mDown = true;
                xBgn = getX(event);
                xBgnT = Date.now();
                sML = parseInt(sliderWrappers[i].style.marginLeft.split("px")[0]);
            }

        });
        sldS.addEventListener('mouseup', function (event) {
            if (mDown) {
                if (Math.abs(xVar) <= 768 && xSpd <= 2) {
                    sldShow(i, j);
                }
            }
            mDown = false;

        });
        sldS.addEventListener('mouseout', function (event) {
            if (mDown) {
                if (Math.abs(xVar) <= 768 && xSpd <= 2) {
                    sldShow(i, j);
                }
            }
            mDown = false;
        });
        sldS.addEventListener('mousemove', function (event) {
            if (mDown) {
                //console.log("is "+sML);
                xCur = getX(event);
                xCurT = Date.now();
                xVar = xCur - xBgn;
                xSpd = Math.abs(xVar / (xCurT - xBgnT));
                console.log("speed is: " + xSpd);
                console.log("distance is: " + xVar);
                sliderWrappers[i].style.marginLeft = sML + xVar + "px";
                if (xSpd >= 2 || Math.abs(xVar) >= 768) {
                    mDown = false;
                    console.log("Zing!");
                    if (xVar > 0) {
                        sldShow(i, j - 1);
                    } else {
                        sldShow(i, j + 1);
                    }
                }
            }
        });
        /* sldS.addEventListener('touchstart', function (event) {
             mDown = true;
             xBgn = event.changedTouches[0].clientX;
             xBgnT = Date.now();
             sML = parseInt(sliderWrappers[i].style.marginLeft.split("px")[0]);
             console.log("start " + xBgn);
         });
         sldS.addEventListener('touchend', function (event) {
             mDown = false;
             console.log("end");
             //sliderWrappers[i].style.marginLeft = 0 + "px";
         });
         sldS.addEventListener('touchleave', function (event) {
             mDown = false;
             if (Math.abs(xVar)<=256 && xSpd<=2) {
                 sldShow(i,j);
             }
             console.log("end");
 
             //sliderWrappers[i].style.marginLeft = 0 + "px";
         });
         sldS.addEventListener('touchmove', function (event) {
             console.log("move");
             xCur = event.changedTouches[0].clientX;
             xCurT = Date.now();
             xVar = xCur - xBgn;
             xSpd = Math.abs(xVar / (xCurT - xBgnT));
 
             if (mDown) {
                 console.log("speed is: " + xSpd);
                 console.log("distance is: " + xVar);
                 sliderWrappers[i].style.marginLeft = sML + xVar + "px";
                 //sliderWrappers[i].style.marginLeft= (xCur-xBgn)/1.5 + "px";
                 if (xSpd >= 2 || Math.abs(xVar) >= 256) {
                     mDown = false;
                     console.log("Zing!");
                     if (xVar > 0) {
                         sldShow(i, j - 1);
                     } else {
                         sldShow(i, j + 1);
                     }
                 }
             }
         });*/
    }
}

