let gW = document.getElementsByClassName("game-wrapper")[0];
let gWW = gW.offsetWidth;
let gWNeedB = 0;

for (let i = 0; i < 23; i++) {
    let gCC = gW.querySelector(".game-card").cloneNode(true);
    gW.appendChild(gCC);
}

let gCL = gW.querySelectorAll(".game-card").length;
//let gCW = parseInt(gCL/2) * gW.querySelector(".game-card").offsetWidth;
let gCW = parseInt(gCL / 2) * 288;

let gWML;

gW.addEventListener('mousedown', function (event) {
    mDown = true;
    xBgn = getX(event);
    gWML = parseInt(gW.style.marginLeft.split("px")[0]);
});
gW.addEventListener('mouseup', function (event) {
    if (mDown) {
        if (gWNeedB != 0) {
            gW.classList.add("bounce");

            if (gWNeedB == -1) {
                gW.style.marginLeft = "0px";
            } else if (gWNeedB == 1) {
                gW.style.marginLeft = -gCW + sW + "px";
            }
            //gW.classList.remove("bounce");
        }
    }
    mDown = false;
    //sliderWrappers[i].style.marginLeft = 0 + "px";
});
gW.addEventListener('transitionend', () => {
    gW.classList.remove("bounce");
    gWNeedB = 0;
});
gW.addEventListener('mouseout', function (event) {
    //mDown = false;
    //sliderWrappers[i].style.marginLeft = 0 + "px";
});
gW.addEventListener('mousemove', function (event) {
    if (mDown) {
        //console.log("is "+sML);
        xCur = getX(event);
        xVar = xCur - xBgn;
        let gWMLN = parseInt(gW.style.marginLeft.split("px")[0]);
        xVar = xCur - xBgn;
        console.log("var:" + xVar);
        if (gWMLN >= 0 && xVar > 0) {
            gWNeedB = -1;
            console.log("zing!");
        } else if (gWMLN < -gCW + sW && xVar < 0) {
            gWNeedB = 1;
            console.log("zing!");
        } else {
        }
        gW.style.marginLeft = gWML + xVar + "px";
    }
});

gW.previousElementSibling.addEventListener('mousemove', function (event) {
    if (mDown) {
        if (gWNeedB != 0) {
            gW.classList.add("bounce");

            if (gWNeedB == -1) {
                gW.style.marginLeft = "0px";
            } else if (gWNeedB == 1) {
                gW.style.marginLeft = -gCW + sW + "px";
            }
            //gW.classList.remove("bounce");
        }
    }
    mDown = false;
    //sliderWrappers[i].style.marginLeft = 0 + "px";
});
gW.nextElementSibling.addEventListener('mousemove', function (event) {
    if (mDown) {
        if (gWNeedB != 0) {
            gW.classList.add("bounce");

            if (gWNeedB == -1) {
                gW.style.marginLeft = "0px";
            } else if (gWNeedB == 1) {
                gW.style.marginLeft = -gCW + sW + "px";
            }
            //gW.classList.remove("bounce");
        }
    }
    mDown = false;
    //sliderWrappers[i].style.marginLeft = 0 + "px";
});


gW.addEventListener('touchstart', function (event) {
    mDown = true;
    xBgn = event.changedTouches[0].clientX;
    gWML = parseInt(gW.style.marginLeft.split("px")[0]);
});
gW.addEventListener('touchend', function (event) {
    if (mDown) {
        if (gWNeedB != 0) {
            gW.classList.add("bounce");

            if (gWNeedB == -1) {
                gW.style.marginLeft = "0px";
            } else if (gWNeedB == 1) {
                gW.style.marginLeft = -gCW + sW + "px";
            }
            //gW.classList.remove("bounce");
        }
    }
    mDown = false;
    //sliderWrappers[i].style.marginLeft = 0 + "px";
});
gW.addEventListener('touchleave', function (event) {
    mDown = false;
    //sliderWrappers[i].style.marginLeft = 0 + "px";
});
gW.addEventListener('touchmove', function (event) {
    if (mDown) {
        //console.log("is "+sML);
        xCur = event.changedTouches[0].clientX;;
        xVar = xCur - xBgn;
        let gWMLN = parseInt(gW.style.marginLeft.split("px")[0]);
        xVar = xCur - xBgn;
        console.log("var:" + xVar);
        if (gWMLN >= 0 && xVar > 0) {
            gWNeedB = -1;
            console.log("zing!");
        } else if (gWMLN < -gCW + sW && xVar < 0) {
            gWNeedB = 1;
            console.log("zing!");
        } else {
        }
        gW.style.marginLeft = gWML + xVar + "px";
    }
});