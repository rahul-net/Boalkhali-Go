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
updateDoc,
collection,
query,
where,
getDocs

}
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import {
formatCurrency
}
from "./utils.js";

/* ==========================================
Variables
========================================== */

let currentUser = null;
let currentDriver = null;

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

await loadDriver();

}
);

/* ==========================================
Driver Profile
========================================== */

async function loadDriver(){

const snap =
await getDoc(
doc(
db,
COLLECTIONS.DRIVERS,
currentUser.uid
)
);

if(!snap.exists()){

alert(
"Driver profile not found"
);

return;

}

currentDriver =
snap.data();

if(
currentDriver.approvalStatus !==
"approved"
){

document.body.innerHTML =

`

<div style="
padding:40px;
text-align:center;
"><h2>Waiting For Admin Approval

</h2><p>Your driver account
is still pending.

</p></div>
`;return;

}

loadProfile();
loadRideRequests();
loadAcceptedRides();
loadDashboardStats();

}

/* ==========================================
Load Profile
========================================== */

function loadProfile(){

document.getElementById(
"vehicleType"
).value =
currentDriver.vehicleType || "";

document.getElementById(
"vehicleNumber"
).value =
currentDriver.vehicleNumber || "";

document.getElementById(
"licenseNumber"
).value =
currentDriver.licenseNumber || "";

document.getElementById(
"nidNumber"
).value =
currentDriver.nidNumber || "";

document.getElementById(
"photoURL"
).value =
currentDriver.photoURL || "";

document.getElementById(
"earnings"
).innerText =
formatCurrency(
currentDriver.earnings || 0
);

if(currentDriver.photoURL){

document.getElementById(
"avatarPreview"
).src =
currentDriver.photoURL;

}

}

/* ==========================================
Save Profile
========================================== */

const saveBtn =
document.getElementById(
"saveProfileBtn"
);

if(saveBtn){

saveBtn.addEventListener(
"click",
saveProfile
);

}

async function saveProfile(){

const data = {

vehicleType:
document.getElementById(
"vehicleType"
).value,

vehicleNumber:
document.getElementById(
"vehicleNumber"
).value,

licenseNumber:
document.getElementById(
"licenseNumber"
).value,

nidNumber:
document.getElementById(
"nidNumber"
).value,

photoURL:
document.getElementById(
"photoURL"
).value

};

await updateDoc(
doc(
db,
COLLECTIONS.DRIVERS,
currentUser.uid
),
data
);

alert(
"Profile Updated"
);

}

/* ==========================================
Avatar Preview
========================================== */

const photoInput =
document.getElementById(
"photoURL"
);

if(photoInput){

photoInput.addEventListener(
"input",
function(){

document.getElementById(
"avatarPreview"
).src =
this.value;

}
);

}

/* ==========================================
Online / Offline
========================================== */

const toggleBtn =
document.getElementById(
"toggleStatusBtn"
);

if(toggleBtn){

toggleBtn.addEventListener(
"click",
toggleStatus
);

}

async function toggleStatus(){

const status =
!currentDriver.online;

await updateDoc(
doc(
db,
COLLECTIONS.DRIVERS,
currentUser.uid
),
{
online:status
}
);

currentDriver.online =
status;

document.getElementById(
"statusBadge"
).innerText =
status
?
"Online"
:
"Offline";

toggleBtn.innerText =
status
?
"Go Offline"
:
"Go Online";

}

/* ==========================================
Ride Requests
========================================== */

async function loadRideRequests(){

const container =
document.getElementById(
"rideRequests"
);

const q =
query(
collection(
db,
COLLECTIONS.RIDES
),
where(
"status",
"==",
"pending"
)
);

const snapshot =
await getDocs(q);

if(snapshot.empty){

container.innerHTML =

`

<div class="no-rides">No Ride Requests

</div>
`;return;

}

container.innerHTML = "";

snapshot.forEach(docu=>{

const ride =
docu.data();

container.innerHTML += `

<div class="request-card"><div class="request-route">${ride.pickup}
→
${ride.destination}

</div><div class="request-meta">Fare:
${formatCurrency(
ride.fare
)}

</div><button
class="accept-btn"
onclick="acceptRide(
'${docu.id}'
)">

Accept Ride

</button></div>`;

});

}

/* ==========================================
Accept Ride
========================================== */

window.acceptRide =
async function(rideId){

await updateDoc(
doc(
db,
COLLECTIONS.RIDES,
rideId
),
{

status:"accepted",

driverId:
currentUser.uid,

driverName:
currentUser.email

}
);

loadRideRequests();
loadAcceptedRides();

};

/* ==========================================
Accepted Rides
========================================== */

async function loadAcceptedRides(){

const container =
document.getElementById(
"acceptedRides"
);

const q =
query(
collection(
db,
COLLECTIONS.RIDES
),
where(
"driverId",
"==",
currentUser.uid
)
);

const snapshot =
await getDocs(q);

container.innerHTML = "";

snapshot.forEach(docu=>{

const ride =
docu.data();

if(
ride.status !==
"accepted"
) return;

container.innerHTML += `

<div class="request-card"><div class="request-route">${ride.pickup}
→
${ride.destination}

</div><div class="request-meta">Fare:
${formatCurrency(
ride.fare
)}

</div><button
class="complete-btn"
onclick="completeRide(
'${docu.id}',
${ride.fare}
)">

Complete Ride

</button></div>`;

});

}

/* ==========================================
Complete Ride
========================================== */

window.completeRide =
async function(
rideId,
fare
){

await updateDoc(
doc(
db,
COLLECTIONS.RIDES,
rideId
),
{
status:"completed"
}
);

const earnings =
(currentDriver.earnings || 0)

+ fare;

await updateDoc(
doc(
db,
COLLECTIONS.DRIVERS,
currentUser.uid
),
{
earnings
}
);

currentDriver.earnings =
earnings;

loadAcceptedRides();
loadDashboardStats();

};

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
"driverId",
"==",
currentUser.uid
)
);

const snapshot =
await getDocs(q);

let completed = 0;

snapshot.forEach(docu=>{

if(
docu.data().status ===
"completed"
){

completed++;

}

});

document.getElementById(
"completedTrips"
).innerText =
completed;

document.getElementById(
"todayTrips"
).innerText =
completed;

document.getElementById(
"earnings"
).innerText =
formatCurrency(
currentDriver.earnings || 0
);

}