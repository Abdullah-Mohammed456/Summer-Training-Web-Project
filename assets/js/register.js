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
    console.log('Registration button clicked');
    
    // Check if CryptoJS is available
    if (typeof CryptoJS === 'undefined') {
      console.error('CryptoJS is not loaded!');
      alert('Error: CryptoJS library not loaded. Please refresh the page.');
      return;
    }
    
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

    console.log('Registration data:', { email, displayName, passwordLength: password.length });

    try {
      console.log('Creating user account...');
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log('User account created:', userCredential.user.uid);
      
      if (displayName) {
        await updateProfile(userCredential.user, { displayName });
        console.log('Profile updated with display name');
      }
      // Encrypt password before saving
      const secretKey = "YOUR_SECRET_KEY"; // Change this to a strong, private key!
      const encryptedPassword = CryptoJS.AES.encrypt(password, secretKey).toString();
      console.log('Password encrypted successfully');
      
      // Save user details in the database
      try {
        console.log('Saving user details to database...');
        await set(ref(db, `users/${userCredential.user.uid}`), {
          uid: userCredential.user.uid,
          name: displayName,
          email: email,
          password: encryptedPassword,
          createdAt: new Date().toISOString()
        });
        console.log('User details saved successfully');
      } catch (e) {
        console.error('Failed to save user details:', e);
      }
      try {
        await set(ref(db, `roles/${userCredential.user.uid}`), {
          role: "user",
        });
        console.log('User role saved');
      } catch (_) {}
      alert("Account created. Please log in.");
      try {
        await signOut(auth);
      } catch (_) {}
      window.location.href = "./login&register.html";
    } catch (error) {
      console.error('Registration failed:', error);
      alert("Registration failed: " + error.message);
    }
  });
}
