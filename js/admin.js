import {
auth,
db,
ADMIN_EMAIL,
COLLECTIONS
}
from "../firebase/firebase-config.js";

import {
onAuthStateChanged
}
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {

collection,
getDocs,
doc,
updateDoc,
query,
where

}
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

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

if(
user.email !==
ADMIN_EMAIL
){

window.location.href =
"login.html";

return;

}

await loadDashboard();

}
);

/* ==========================================
Dashboard
========================================== */

async function loadDashboard(){

await loadStats();

await loadPendingDrivers();

await loadRiders();

await loadDrivers();

await loadAnalytics();

}

/* ==========================================
Statistics
========================================== */

async function loadStats(){

const users =
await getDocs(
collection(
db,
COLLECTIONS.USERS
)
);

const drivers =
await getDocs(
collection(
db,
COLLECTIONS.DRIVERS
)
);

const rides =
await getDocs(
collection(
db,
COLLECTIONS.RIDES
)
);

let riderCount = 0;
let pendingCount = 0;

users.forEach(docu=>{

if(
docu.data().role ===
"rider"
){

riderCount++;

}

});

drivers.forEach(docu=>{

if(
docu.data()
.approvalStatus ===
"pending"
){

pendingCount++;

}

});

document.getElementById(
"totalRiders"
).innerText =
riderCount;

document.getElementById(
"totalDrivers"
).innerText =
drivers.size;

document.getElementById(
"pendingDriversCount"
).innerText =
pendingCount;

document.getElementById(
"totalTrips"
).innerText =
rides.size;

}

/* ==========================================
Pending Drivers
========================================== */

async function loadPendingDrivers(){

const container =
document.getElementById(
"pendingDrivers"
);

const q =
query(
collection(
db,
COLLECTIONS.DRIVERS
),
where(
"approvalStatus",
"==",
"pending"
)
);

const snapshot =
await getDocs(q);

if(snapshot.empty){

container.innerHTML =

`

<div class="empty-state">No Pending Drivers

</div>
`;return;

}

container.innerHTML = "";

snapshot.forEach(docu=>{

const driver =
docu.data();

container.innerHTML += `

<div class="driver-card"><h3>${driver.vehicleNumber || "Driver"}

</h3><p>Vehicle:
${driver.vehicleType}

</p><p>License:
${driver.licenseNumber}

</p><div class="driver-actions"><button
class="approve-btn"
onclick="approveDriver(
'${docu.id}'
)">

Approve

</button><button
class="reject-btn"
onclick="rejectDriver(
'${docu.id}'
)">

Reject

</button></div></div>`;

});

}

/* ==========================================
Approve Driver
========================================== */

window.approveDriver =
async function(uid){

await updateDoc(
doc(
db,
COLLECTIONS.DRIVERS,
uid
),
{
approvalStatus:
"approved"
}
);

loadDashboard();

};

/* ==========================================
Reject Driver
========================================== */

window.rejectDriver =
async function(uid){

await updateDoc(
doc(
db,
COLLECTIONS.DRIVERS,
uid
),
{
approvalStatus:
"rejected"
}
);

loadDashboard();

};

/* ==========================================
Rider List
========================================== */

async function loadRiders(){

const container =
document.getElementById(
"riderList"
);

const users =
await getDocs(
collection(
db,
COLLECTIONS.USERS
)
);

container.innerHTML = "";

users.forEach(docu=>{

const user =
docu.data();

if(
user.role !==
"rider"
) return;

container.innerHTML += `

<div class="rider-card"><h3>${user.name}

</h3><p>${user.email}

</p><p>${user.phone}

</p></div>`;

});

}

/* ==========================================
Driver List
========================================== */

async function loadDrivers(){

const container =
document.getElementById(
"driverList"
);

const drivers =
await getDocs(
collection(
db,
COLLECTIONS.DRIVERS
)
);

container.innerHTML = "";

drivers.forEach(docu=>{

const driver =
docu.data();

container.innerHTML += `

<div class="driver-item"><h3>${driver.vehicleNumber}

</h3><p>Type:
${driver.vehicleType}

</p><p>Status:
${driver.approvalStatus}

</p><p>Online:
${driver.online}

</p><p>Earnings:
৳${driver.earnings || 0}

</p></div>`;

});

}

/* ==========================================
Analytics
========================================== */

async function loadAnalytics(){

const users =
await getDocs(
collection(
db,
COLLECTIONS.USERS
)
);

const rides =
await getDocs(
collection(
db,
COLLECTIONS.RIDES
)
);

const drivers =
await getDocs(
collection(
db,
COLLECTIONS.DRIVERS
)
);

let completed = 0;
let activeDrivers = 0;

rides.forEach(docu=>{

if(
docu.data().status ===
"completed"
){

completed++;

}

});

drivers.forEach(docu=>{

if(
docu.data().online
){

activeDrivers++;

}

});

document.getElementById(
"todayRegistrations"
).innerText =
users.size;

document.getElementById(
"completedTrips"
).innerText =
completed;

document.getElementById(
"activeDrivers"
).innerText =
activeDrivers;

}

/* ==========================================
Search
========================================== */

const searchInput =
document.getElementById(
"searchInput"
);

if(searchInput){

searchInput.addEventListener(
"keyup",
function(){

const term =
this.value
.toLowerCase();

document
.querySelectorAll(
".rider-card,.driver-item"
)
.forEach(card=>{

card.style.display =
card.innerText
.toLowerCase()
.includes(term)
?
"block"
:
"none";

});

}
);

}