/* ==========================================================
BOALKHALI GO
Utility Functions
File: utils.js
========================================================== */

/* ==========================================
Format Currency
========================================== */

export function formatCurrency(amount){

return new Intl.NumberFormat(
"en-BD",
{
style:"currency",
currency:"BDT",
maximumFractionDigits:0
}
).format(amount);

}

/* ==========================================
Format Date
========================================== */

export function formatDate(timestamp){

if(!timestamp) return "-";

const date =
timestamp.toDate
?
timestamp.toDate()
:
new Date(timestamp);

return date.toLocaleDateString(
"en-GB",
{
day:"2-digit",
month:"short",
year:"numeric"
}
);

}

/* ==========================================
Format Time
========================================== */

export function formatTime(timestamp){

if(!timestamp) return "-";

const date =
timestamp.toDate
?
timestamp.toDate()
:
new Date(timestamp);

return date.toLocaleTimeString(
"en-US",
{
hour:"2-digit",
minute:"2-digit"
}
);

}

/* ==========================================
Generate Ride ID
========================================== */

export function generateRideCode(){

const random =
Math.floor(
100000 +
Math.random() * 900000
);

return "BG-${random}";

}

/* ==========================================
Capitalize
========================================== */

export function capitalize(text){

if(!text) return "";

return text.charAt(0)
.toUpperCase()
+
text.slice(1);

}

/* ==========================================
Status Badge
========================================== */

export function getStatusClass(status){

switch(status){

case "pending":
return "status-pending";

case "accepted":
return "status-accepted";

case "completed":
return "status-completed";

case "cancelled":
return "status-cancelled";

default:
return "";

}

}

/* ==========================================
Calculate Fare
========================================== */

export function calculateFare(distance){

const baseFare = 50;

const perKm = 15;

return baseFare +
(distance * perKm);

}

/* ==========================================
Validate Phone
========================================== */

export function validatePhone(phone){

const regex =
/^(01[3-9]\d{8})$/;

return regex.test(phone);

}

/* ==========================================
Email Validation
========================================== */

export function validateEmail(email){

const regex =
/^[^\s@]+@[^\s@]+.[^\s@]+$/;

return regex.test(email);

}

/* ==========================================
Show Loader
========================================== */

export function showLoader(id){

const el =
document.getElementById(id);

if(el){

el.style.display =
"flex";

}

}

/* ==========================================
Hide Loader
========================================== */

export function hideLoader(id){

const el =
document.getElementById(id);

if(el){

el.style.display =
"none";

}

}

/* ==========================================
Show Notification
========================================== */

export function showToast(message){

alert(message);

}