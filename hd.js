
let hudouter;
let hudtarget;
let hudslider;
let gametimer = 0.0;
let statetimer = 0.0;
let sliderangle = 0.0;
let sliderspeed = 0.10;
const sliderbase = 0.20;
const slideraccel = 0.004;
const hitmax = 30;
const hitangle = 22.0;
let hitcounter = 0;
let prevstamp;
let targetangle;
let gamestate = "play";
let sound;
let coinsound;


window.onload = function() {
    hudouter = document.getElementById("hudouter");
    hudtarget = document.getElementById("hudtarget");
    hudslider = document.getElementById("hudslider");
    
    document.addEventListener('keydown', onkeyboard);
    window.requestAnimationFrame(animate);

    sound = new Audio();
    coinsound = new Audio("coin.wav");

//    changeStateStart();

    let clouds = document.getElementById("clouds");
    for (var i = 0; i < 16; i++) {
        let cloud = document.createElement("img");
        clouds.appendChild(cloud);
        let cnum = (i % 2 + 1);
        let cx = Math.random() * 150 - 25;
        let cy = 30 + Math.random() * 10;
        let ct = Math.random() + 4;
        let cp = Math.random() * 5;
        // let cf = (Math.random() < 0.5) ? -1.0 : 1.0;
        // cf *= Math.random() * 0.2 + 0.9;
        cloud.src = "cloud" + cnum + ".png";
        cloud.style.left = cx + "%";
        cloud.style.top = cy + "%";
        cloud.style.animation = "swoop " + ct + "s infinite";
        cloud.style.animationDelay = cp + "s"; 
    }

    gamestate = "win";
    postStateChange();
    var name = document.getElementById("name");
    name.innerText = "Salem Nights";
    name.style.opacity = 1;    
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

        let hti = document.getElementById("hudtargetimg");
        hti.style.transform = "rotate(" + (gametimer * sliderspeed * -0.5) + "deg)";
    }

    let slowroll = perlin.get(gametimer * .0003 + 2.2, gametimer * .0002) * 40;

    let rot = perlin.get(gametimer * .001, 0.2) * 10 ;
    let tx = perlin.get(0.3, gametimer * .001) * 2;
    let ty = perlin.get(0.7, (gametimer * .001 + 4.4) * .01) * 2;
    let cpi = document.getElementById("cockpitimg");
    cpi.style.transform = "rotate(" + (rot + slowroll) + "deg) translate(" + tx + "%, " + ty + "%)";
    tx = perlin.get(0.5, gametimer * .0001) * 40 - 20;
    ty = perlin.get(0.7, (gametimer * .0005 + 4.4) * .01) * 30 - 20;
    let hz = document.getElementById("horizon");
    hz.style.transform = "rotate(" + (rot * 0.5) + "deg) translate(" + tx + "%, " + ty + "%)";

    gametimer += elapsed;
    statetimer += elapsed;
    window.requestAnimationFrame(animate);
}



function unflip(num) {
    while (num < 0.0) {
        num += 360.0;
    }
    while (num >= 360.0) {
        num -= 360.0;
    }
    return num;
}


function isSliderOnTarget() {
    let slider = unflip(sliderangle);
    let target = unflip(targetangle);

    let delta1 = Math.abs(slider - target);
    let delta2 = Math.abs((slider + 360.0) - target);
    let delta3 = Math.abs(slider - (target + 360.0));
    let delta = Math.min(delta1, delta2, delta3);

    return delta < hitangle;
}


function onkeyboard(event) {
    if (event.key === " ") {
        ontrigger();
    }
}


function ontrigger() {
    if (gamestate !== "play") {
        if (statetimer > 2000.0) {
            changeStateStart();
        }
        return;
    }

    if (!isSliderOnTarget()) {
        changeStateEndPlay();
        return;
    }

    coinsound.pause();
    coinsound.currentTime = 0;
    coinsound.play();
    sliderspeed = -sliderspeed;

    let pings = document.getElementById("hudpings");
    let ping = document.createElement("div");
    ping.classList.add("ping");
    pings.appendChild(ping);
    positionelement(ping, targetangle);

    const offset = Math.random() * 180.0 + 100.0;
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

function playsound(media) {
    sound.pause();
    sound.src = media;
    sound.play();
}

function changeStateStart() {
    playsound("main.mp3");
    gamestate = "start";
    postStateChange();
    setTimeout(changeStatePlay, 2000);

    var redx = document.getElementById("redx");
    redx.style.top = "15%";

    let cp = document.getElementById("cockpit");
    cp.style.marginTop = "0";

    let pings = document.getElementById("hudpings");
    pings.innerHTML = "";

    let odo = document.getElementById("odometer");
    odo.innerHTML = hitmax * 10;
}  


function changeStatePlay() {
    var name = document.getElementById("name");
    name.style.opacity = 0;

    gamestate = "play";
    hitcounter = 0;
    sliderangle = 0.0;
    sliderspeed = sliderbase;
    targetangle = 180.0;

    positionelement(hudtarget, targetangle);
    positionelement(hudslider, sliderangle);

    postStateChange();
}


function changeStateEndPlay() {
    if (hitcounter >= 3) {
        playsound("win.mp3");
        gamestate = "think";
        setTimeout(changeStateWin, 2000);
    } else {
        var redx = document.getElementById("redx");
        redx.style.top = "40%";
    
        playsound("fail.mp3");
        gamestate = "dead";
    }
    let name = document.getElementById("name");
    name.style.opacity = 0;

    let cp = document.getElementById("cockpit");
    cp.style.marginTop = "50%";

    postStateChange();
}


function changeStateWin() {   
    gamestate = "win";
    postStateChange();

    setTimeout(() => {
        var name = document.getElementById("name");
        name.innerText = "GOOSE";
        name.style.opacity = 1;    
    }, 1000);
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
