import {
  initializeApp,
  getApp,
  getApps,
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";
import {
  getDatabase,
  ref,
  get,
  child,
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

const loginButton = document.getElementById("login-btn");
if (loginButton) {
  loginButton.addEventListener("click", async function (event) {
    event.preventDefault();
    const emailInput = document.getElementById("login-email");
    const passwordInput = document.getElementById("login-password");

    const email =
      emailInput && "value" in emailInput ? emailInput.value.trim() : "";
    const password =
      passwordInput && "value" in passwordInput ? passwordInput.value : "";

    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      const uid = cred.user.uid;
      const normalizedEmail = (email || "").toLowerCase();
      const adminEmails = ["admin@123.com"];
      if (adminEmails.includes(normalizedEmail)) {
        window.location.href = "./AdminPage.html";
        return;
      }
      let role = "user";
      try {
        const snap = await get(ref(db, `roles/${uid}`));
        if (snap.exists()) {
          role = snap.val()?.role || "user";
        }
      } catch (roleErr) {}
      window.location.href =
        role === "admin" ? "./AdminPage.html" : "./Homepage.html";
    } catch (error) {
      alert(error.message || "Login failed");
    }
  });
}
