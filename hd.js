
let hudouter;
let hudtarget;
let hudslider;
let statetimer = 0.0;
let sliderangle = 0.0;
let sliderspeed = 0.12;
const sliderbase = 0.25;
const slideraccel = 0.02;
const hitmax = 20;
const hitangle = 16;
let hitcounter = 0;
let prevstamp;
let targetangle;
let gamestate = "play";


window.onload = function() {
    hudouter = document.getElementById("hudouter");
    hudtarget = document.getElementById("hudtarget");
    hudslider = document.getElementById("hudslider");
    
    document.addEventListener('keydown', onkeyboard);
    window.requestAnimationFrame(animate);

    changeStatePlay();
}


function positionelement(element, angle) {
    const hudbox = hudouter.getBoundingClientRect();
    const box = element.getBoundingClientRect();

    const radius = hudbox.width * 0.5;

    const cx = hudbox.x + radius;
    const cy = hudbox.y + radius;

    const minioffset = box.width * 0.5;

    const rads = angle * Math.PI / 180.0;
    const px = Math.sin(rads) * (radius * 0.866) - minioffset + cx;
    const py = Math.cos(rads) * (radius * 0.866) - minioffset + cy;
    element.style.left = px + "px";
    element.style.top = py + "px";
}


function animate(timestamp) {
    if (prevstamp === undefined) {
        prevstamp = timestamp;
    }
    const elapsed = timestamp - prevstamp;
    prevstamp = timestamp;

    if (gamestate === "play") {
        sliderangle += sliderspeed * elapsed;
        positionelement(hudslider, sliderangle);

        if (isSliderOnTarget()) {
            hudtarget.style.border = "green solid 1px";
        } else {
            hudtarget.style.border = "none";
        }

    } else {
    }

    statetimer += elapsed;
    window.requestAnimationFrame(animate);
}


function isSliderOnTarget() {
    if (Math.abs((sliderangle % 360) - targetangle) < hitangle) {
        return true;
    } else {
        return false;
    }
}


function onkeyboard(event) {
    if (event.key === " ") {
        ontrigger();
    }
}


function ontrigger() {
    if (gamestate !== "play") {
        console.log(statetimer);
        if (statetimer > 2000.0) {
            changeStatePlay();
        }
        return;
    }

    if (!isSliderOnTarget()) {
        changeStateEndPlay();
        return;
    }

    sliderspeed = -sliderspeed;

    const offset = Math.random() * 180.0 + 80.0;
    if (sliderspeed < 0.0) {
        targetangle -= offset;
        sliderspeed -= slideraccel;
    } else {
        targetangle += offset;
        sliderspeed += slideraccel;
    }

    positionelement(hudtarget, targetangle);

    let odo = document.getElementById("odometer");
    hitcounter += 1;
    odo.innerHTML = (hitmax - hitcounter) * 10;

    if (hitcounter === hitmax) {
        changeStateEndPlay();
    }
}


function changeStatePlay() {
    gamestate = "play";
    hitcounter = 0;
    sliderangle = 0.0;
    sliderspeed = sliderbase;
    targetangle = 180.0;

    positionelement(hudtarget, targetangle);
    positionelement(hudslider, sliderangle);

    let odo = document.getElementById("odometer");
    odo.innerHTML = hitmax * 10;

    postStateChange();
}


function changeStateEndPlay() {
    if (hitcounter >= 3) {
        gamestate = "win";
    } else {
        gamestate = "dead";
    }
    postStateChange();
}

function changeStateDead() {   
    gamestate = "dead";
    postStateChange();
}


function changeStateWin() {   
    gamestate = "win";
    postStateChange();
}


function postStateChange() {
    statetimer = 0.0;
    var elems = document.getElementsByClassName("state");
    for (var elem of elems) {
        if (elem.classList.contains(gamestate)) {
            elem.style.opacity = 1;
        } else {
            elem.style.opacity = 0;
        }
    }
}