import {
  initializeApp,
  getApp,
  getApps,
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import {
  getDatabase,
  ref,
  get,
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
const db = getDatabase(app);

async function loadUsers() {
  console.log("Loading users...");
  const tbody = document.getElementById("users-tbody");
  if (!tbody) {
    console.error("users-tbody element not found");
    return;
  }
  tbody.innerHTML = '<tr><td colspan="5">Loading...</td></tr>';
  try {
    console.log("Fetching users from database...");
    const snap = await get(ref(db, "users"));
    console.log("Database response:", snap.exists(), snap.val());
    if (!snap.exists()) {
      tbody.innerHTML = '<tr><td colspan="5">No users found.</td></tr>';
      return;
    }
    const users = snap.val();
    console.log("Users data:", users);
    tbody.innerHTML = "";
    Object.values(users).forEach((user) => {
      console.log("Processing user:", user);
      let decryptedPassword = "-";
      try {
        if (user.password) {
          const secretKey = "YOUR_SECRET_KEY"; // Must match the key used in register.js
          const bytes = CryptoJS.AES.decrypt(user.password, secretKey);
          decryptedPassword = bytes.toString(CryptoJS.enc.Utf8) || "-";
        }
      } catch (e) {
        console.error("Error decrypting password:", e);
        decryptedPassword = "(error)";
      }
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${user.name || "-"}</td>
        <td>${
          user.createdAt ? new Date(user.createdAt).toLocaleString() : "-"
        }</td>
        <td>${user.email || "-"}</td>
        <td>${user.uid || "-"}</td>
        <td>${decryptedPassword}</td>
      `;
      tbody.appendChild(tr);
    });
    console.log("Users loaded successfully");
  } catch (e) {
    console.error("Error loading users:", e);
    tbody.innerHTML = `<tr><td colspan="5">Error loading users: ${e.message}</td></tr>`;
  }
}

document.addEventListener("DOMContentLoaded", loadUsers);
