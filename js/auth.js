import {
  auth,
  db,
  ADMIN_EMAIL,
  COLLECTIONS
} from "../firebase/firebase-config.js";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
  doc,
  setDoc,
  getDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

/* ==========================================
   UI Helpers
========================================== */

function showError(message) {

  const box =
    document.getElementById(
      "errorBox"
    );

  if (!box) return;

  box.style.display = "block";
  box.innerText = message;

}

function showSuccess(message) {

  const box =
    document.getElementById(
      "successBox"
    );

  if (!box) return;

  box.style.display = "block";
  box.innerText = message;

}

function clearMessages() {

  const errorBox =
    document.getElementById(
      "errorBox"
    );

  const successBox =
    document.getElementById(
      "successBox"
    );

  if (errorBox) {

    errorBox.style.display =
      "none";

    errorBox.innerText = "";

  }

  if (successBox) {

    successBox.style.display =
      "none";

    successBox.innerText = "";

  }

}

/* ==========================================
   Driver Fields Toggle
========================================== */

const roleSelect =
  document.getElementById(
    "role"
  );

if (roleSelect) {

  roleSelect.addEventListener(
    "change",
    function () {

      const driverFields =
        document.getElementById(
          "driverFields"
        );

      if (!driverFields) return;

      driverFields.style.display =
        this.value === "driver"
          ? "block"
          : "none";

    }
  );

}

/* ==========================================
   Driver Photo Preview
========================================== */

const photoInput =
  document.getElementById(
    "photoURL"
  );

if (photoInput) {

  photoInput.addEventListener(
    "input",
    function () {

      const preview =
        document.getElementById(
          "photoPreview"
        );

      if (!preview) return;

      preview.src = this.value;

      preview.style.display =
        this.value
          ? "block"
          : "none";

    }
  );

}

/* ==========================================
   Register
========================================== */

const registerForm =
  document.getElementById(
    "registerForm"
  );

if (registerForm) {

  registerForm.addEventListener(
    "submit",
    registerUser
  );

}

async function registerUser(e) {

  e.preventDefault();

  clearMessages();

  try {

    const name =
      document.getElementById(
        "name"
      ).value.trim();

    const email =
      document.getElementById(
        "email"
      ).value.trim();

    const phone =
      document.getElementById(
        "phone"
      ).value.trim();

    const password =
      document.getElementById(
        "password"
      ).value;

    const role =
      document.getElementById(
        "role"
      ).value;

    if (
      !name ||
      !email ||
      !phone ||
      !password
    ) {

      showError(
        "Please fill all required fields."
      );

      return;

    }

    if (
      email.toLowerCase() ===
      ADMIN_EMAIL.toLowerCase()
    ) {

      showError(
        "Admin registration is not allowed."
      );

      return;

    }

    const credential =
      await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

    const uid =
      credential.user.uid;

    await setDoc(
      doc(
        db,
        COLLECTIONS.USERS,
        uid
      ),
      {
        uid,
        name,
        email,
        phone,
        role,
        createdAt:
          serverTimestamp()
      }
    );

    if (role === "driver") {

      const vehicleType =
        document.getElementById(
          "vehicleType"
        ).value.trim();

      const vehicleNumber =
        document.getElementById(
          "vehicleNumber"
        ).value.trim();

      const licenseNumber =
        document.getElementById(
          "licenseNumber"
        ).value.trim();

      const nidNumber =
        document.getElementById(
          "nidNumber"
        ).value.trim();

      const photoURL =
        document.getElementById(
          "photoURL"
        ).value.trim();

      if (
        !vehicleType ||
        !vehicleNumber ||
        !licenseNumber ||
        !nidNumber ||
        !photoURL
      ) {

        showError(
          "All driver fields are required."
        );

        return;

      }

      await setDoc(
        doc(
          db,
          COLLECTIONS.DRIVERS,
          uid
        ),
        {
          uid,

          approvalStatus:
            "pending",

          vehicleType,
          vehicleNumber,
          licenseNumber,
          nidNumber,
          photoURL,

          online: false,

          earnings: 0,

          createdAt:
            serverTimestamp()
        }
      );

    }

    showSuccess(
      "Registration successful."
    );

    setTimeout(() => {

      window.location.href =
        "login.html";

    }, 1500);

  }
  catch (error) {

    showError(
      error.message
    );

  }

}

/* ==========================================
   Login
========================================== */

const loginForm =
  document.getElementById(
    "loginForm"
  );

if (loginForm) {

  loginForm.addEventListener(
    "submit",
    loginUser
  );

}

async function loginUser(e) {

  e.preventDefault();

  clearMessages();

  try {

    const email =
      document.getElementById(
        "email"
      ).value.trim();

    const password =
      document.getElementById(
        "password"
      ).value;

    await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

  }
  catch (error) {

    showError(
      error.message
    );

  }

}

/* ==========================================
   Session Redirect
========================================== */

onAuthStateChanged(
  auth,
  async (user) => {

    if (!user) return;

    const currentPage =
      window.location.pathname;

    if (
      user.email.toLowerCase() ===
      ADMIN_EMAIL.toLowerCase()
    ) {

      if (
        currentPage.includes(
          "login.html"
        ) ||
        currentPage.includes(
          "register.html"
        )
      ) {

        window.location.href =
          "admin.html";

      }

      return;

    }

    const userDoc =
      await getDoc(
        doc(
          db,
          COLLECTIONS.USERS,
          user.uid
        )
      );

    if (!userDoc.exists())
      return;

    const userData =
      userDoc.data();

    if (
      userData.role ===
      "rider"
    ) {

      if (
        currentPage.includes(
          "login.html"
        ) ||
        currentPage.includes(
          "register.html"
        )
      ) {

        window.location.href =
          "rider.html";

      }

      return;

    }

    if (
      userData.role ===
      "driver"
    ) {

      const driverDoc =
        await getDoc(
          doc(
            db,
            COLLECTIONS.DRIVERS,
            user.uid
          )
        );

      if (
        !driverDoc.exists()
      ) {

        showError(
          "Driver profile missing."
        );

        return;

      }

      const driver =
        driverDoc.data();

      if (
        driver.approvalStatus !==
        "approved"
      ) {

        document.body.innerHTML = `

<div class="auth-card">

<h2>
Waiting For Admin Approval
</h2>

<p>
Your driver account is pending approval.
</p>

</div>

`;

        return;

      }

      if (
        currentPage.includes(
          "login.html"
        ) ||
        currentPage.includes(
          "register.html"
        )
      ) {

        window.location.href =
          "driver.html";

      }

    }

  }
);

/* ==========================================
   Logout
========================================== */

const logoutBtn =
  document.getElementById(
    "logoutBtn"
  );

if (logoutBtn) {

  logoutBtn.addEventListener(
    "click",
    async () => {

      await signOut(auth);

      window.location.href =
        "login.html";

    }
  );

}