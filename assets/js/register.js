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
const submit = document.getElementById("register-btn");
if (submit) {
  submit.addEventListener("click", async function (event) {
    event.preventDefault();
    const emailInput = document.getElementById("register-email");
    const passwordInput = document.getElementById("register-password");
    const usernameInput = document.getElementById("register-username");

    const email =
      emailInput && "value" in emailInput ? emailInput.value.trim() : "";
    const password =
      passwordInput && "value" in passwordInput ? passwordInput.value : "";
    const displayName =
      usernameInput && "value" in usernameInput
        ? usernameInput.value.trim()
        : "";

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      if (displayName) {
        await updateProfile(userCredential.user, { displayName });
      }
      try {
        await set(ref(db, `roles/${userCredential.user.uid}`), {
          role: "user",
        });
      } catch (_) {}
      alert("Account created. Please log in.");
      try {
        await signOut(auth);
      } catch (_) {}
      window.location.href = "./index.html";
    } catch (error) {
      alert("Registration failed");
    }
  });
}
