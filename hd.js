
let hudouter;
let hudtarget;
let hudslider;
let sliderangle = 0.0;
let sliderspeed = 0.25;
const sliderbase = 0.25;
const slideraccel = 0.01;
const hitmax = 20;
const hitangle = 16;
let hitcounter = 0;
let prevstamp;
let targetangle;


window.onload = function() {
    hudouter = document.getElementById("hudouter");
    hudtarget = document.getElementById("hudtarget");
    hudslider = document.getElementById("hudslider");
    
    document.addEventListener('keydown', onkeyboard);
    window.requestAnimationFrame(animate);

    resetgame();
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
        targetangle = Math.random() * 360.0;
        positionelement(hudtarget, targetangle);
        prevstamp = timestamp;
    }

    const elapsed = timestamp - prevstamp;
    prevstamp = timestamp;

    sliderangle += sliderspeed * elapsed;
    positionelement(hudslider, sliderangle);

    if (Math.abs((sliderangle % 360) - targetangle) < hitangle) {
        hudtarget.style.border = "green solid 1px";
    } else {
        hudtarget.style.border = "none";
    }

    window.requestAnimationFrame(animate);
}

function onkeyboard(event) {
    if (event.key === " ") {
        ontrigger();
    }
}
function ontrigger() {
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

}


function resetgame() {
    sliderspeed = sliderbase;
    let odo = document.getElementById("odometer");
    odo.innerHTML = hitmax * 10;
}