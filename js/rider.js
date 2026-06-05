import {
auth,
db,
COLLECTIONS
}
from "../firebase/firebase-config.js";

import {
onAuthStateChanged
}
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {

doc,
getDoc,
collection,
addDoc,
getDocs,
query,
where,
orderBy,
serverTimestamp

}
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import {

calculateFare,
formatCurrency,
formatDate

}
from "./utils.js";

/* ==========================================
Current User
========================================== */

let currentUser = null;

/* ==========================================
Auth Check
========================================== */

onAuthStateChanged(
auth,
async(user)=>{

if(!user){

window.location.href =
"login.html";

return;

}

currentUser = user;

await loadProfile();

await loadTrips();

await loadDashboardStats();

await loadActiveRide();
  
await loadActiveRide();

}
);

/* ==========================================
Load Profile
========================================== */

async function loadProfile(){

const userRef =
await getDoc(
doc(
db,
COLLECTIONS.USERS,
currentUser.uid
)
);

if(!userRef.exists())
return;

const user =
userRef.data();

document.getElementById(
"riderName"
).innerText =
user.name;

document.getElementById(
"profileName"
).innerText =
user.name;

document.getElementById(
"profileEmail"
).innerText =
user.email;

}

/* ==========================================
Book Ride
========================================== */

const rideForm =
document.getElementById(
"rideForm"
);

if(rideForm){

rideForm.addEventListener(
"submit",
bookRide
);

}

async function bookRide(e){

e.preventDefault();

const pickup =
document.getElementById(
"pickup"
).value;

const destination =
document.getElementById(
"destination"
).value;

/* Temporary */

const distance = 5;

const fare =100
calculateFare(
distance
);

const userRef =
await getDoc(
doc(
db,
COLLECTIONS.USERS,
currentUser.uid
)
);

const user =
userRef.data();

await addDoc(
collection(
db,
COLLECTIONS.RIDES
),
{

riderId:
currentUser.uid,

riderName:
user.name,

driverId:"",
driverName:"",

pickup,
destination,

fare,

status:
"pending",

createdAt:
serverTimestamp()

}
);

rideForm.reset();

alert(
"Ride Booked Successfully"
);

loadTrips();

loadDashboardStats();

}

/* ==========================================
Load Trips
========================================== */

async function loadTrips(){

const container =
document.getElementById(
"tripHistory"
);

const q =
query(
collection(
db,
COLLECTIONS.RIDES
),
where(
"riderId",
"==",
currentUser.uid
)
);

const snapshot =
await getDocs(q);

if(snapshot.empty){

container.innerHTML =

`<div class="empty-rides">
No Trips Found

</div>`;return;

}

container.innerHTML = "";

snapshot.forEach(docu=>{

const ride =
docu.data();

container.innerHTML += `

<div class="trip-card"><div class="trip-route">${ride.pickup}
→
${ride.destination}

</div><div class="trip-meta"><span>Fare:
${formatCurrency(
ride.fare
)}

</span><span>Status:
${ride.status}

</span><span>${formatDate(
ride.createdAt
)}

</span></div></div>`;

});

}

/* ==========================================
Active Ride
========================================== */

async function loadActiveRide(){

const container =
document.getElementById(
"activeRideContainer"
);

const q =
query(
collection(
db,
COLLECTIONS.RIDES
),
where(
"riderId",
"==",
currentUser.uid
)
);

const snapshot =
await getDocs(q);

let activeRide = null;

snapshot.forEach(docu=>{

const ride =
docu.data();

if(
ride.status ===
"pending"
||
ride.status ===
"accepted"
){

activeRide =
ride;
}

});

if(!activeRide){

container.innerHTML =

`<div class="empty-rides">
No Active Ride

</div>`;return;

}

container.innerHTML = `

<div class="trip-card"><div class="trip-route">${activeRide.pickup}
→
${activeRide.destination}

</div><p>Driver:
${activeRide.driverName || "Waiting..."}

</p><p>Fare:
${formatCurrency(
activeRide.fare
)}

</p><p>Status:
${activeRide.status}

</p></div>`;

}

/* ==========================================
Dashboard Stats
========================================== */

async function loadDashboardStats(){

const q =
query(
collection(
db,
COLLECTIONS.RIDES
),
where(
"riderId",
"==",
currentUser.uid
)
);

const snapshot =
await getDocs(q);

let total = 0;
let completed = 0;

snapshot.forEach(docu=>{

total++;

if(
docu.data().status ===
"completed"
){

completed++;

}

});

document.getElementById(
"totalTrips"
).innerText =
total;

document.getElementById(
"completedTrips"
).innerText =
completed;

}
