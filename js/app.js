/* ==========================================================
BOALKHALI GO
Global Application Bootstrap
File: app.js
========================================================== */

/* ==========================================
App Information
========================================== */

export const APP = {

name:
"Boalkhali Go",

version:
"1.0.0",

environment:
"production"

};

/* ==========================================
Global Error Handler
========================================== */

window.addEventListener(
"error",
(event)=>{

console.error(

"[APP ERROR]",

event.error

);

}
);

/* ==========================================
Promise Error Handler
========================================== */

window.addEventListener(
"unhandledrejection",
(event)=>{

console.error(

"[PROMISE ERROR]",

event.reason

);

}
);

/* ==========================================
Network Monitor
========================================== */

window.addEventListener(
"online",
()=>{

showToast(
"Internet Connected"
);

}
);

window.addEventListener(
"offline",
()=>{

showToast(
"Internet Disconnected"
);

}
);

/* ==========================================
Toast System
========================================== */

export function showToast(message){

const toast =
document.createElement(
"div"
);

toast.className =
"global-toast";

toast.innerText =
message;

document.body.appendChild(
toast
);

setTimeout(()=>{

toast.classList.add(
"show"
);

},100);

setTimeout(()=>{

toast.remove();

},3000);

}

/* ==========================================
Loading Overlay
========================================== */

export function showLoading(){

let loader =
document.getElementById(
"globalLoader"
);

if(loader) return;

loader =
document.createElement(
"div"
);

loader.id =
"globalLoader";

loader.innerHTML =

`

<div class="loader"></div>
`;document.body.appendChild(
loader
);

}

export function hideLoading(){

const loader =
document.getElementById(
"globalLoader"
);

if(loader){

loader.remove();

}

}

/* ==========================================
Page Ready
========================================== */

document.addEventListener(
"DOMContentLoaded",
()=>{

console.log(

APP.name,
APP.version

);

}
);