import {
  initializeApp,
  getApp,
  getApps,
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut,
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";
import {
  getDatabase,
  ref,
  set,
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyCF9JWqiousPIvzRvw48gLsmhqY26tne_Y",
  authDomain: "summer-training-web-proj-b86da.firebaseapp.com",
  databaseURL:
    "https://summer-training-web-proj-b86da-default-rtdb.firebaseio.com",
  projectId: "summer-training-web-proj-b86da",
  storageBucket: "summer-training-web-proj-b86da.firebasestorage.app",
  messagingSenderId: "904545031791",
  appId: "1:904545031791:web:996b2228fc670af3b75f9a",
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

async function handleAdminRegister(event) {
  event.preventDefault();
  const email =
    document.getElementById("admin-register-email")?.value.trim() || "";
  const password =
    document.getElementById("admin-register-password")?.value || "";
  const displayName =
    document.getElementById("admin-register-username")?.value.trim() || "";
  const secret = document.getElementById("admin-secret-key")?.value || "";

  if (secret !== "1111") {
    alert("Invalid admin secret key.");
    return;
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    if (displayName) await updateProfile(userCredential.user, { displayName });
    try {
      await set(ref(db, `roles/${userCredential.user.uid}`), { role: "admin" });
    } catch (_) {}
    try {
      localStorage.setItem(`role:${email.toLowerCase()}`, "admin");
    } catch (_) {}
    alert("Admin account created. Please log in.");
    try {
      await signOut(auth);
    } catch (_) {}
    window.location.href = "./login&register.html";
  } catch (error) {
    alert(error?.message || "Admin registration failed");
  }
}

const adminBtnEl = document.getElementById("admin-register-btn");
if (adminBtnEl) adminBtnEl.addEventListener("click", handleAdminRegister);
const adminFormEl = document.getElementById("admin-register-form");
if (adminFormEl) adminFormEl.addEventListener("submit", handleAdminRegister);
