// 引入你刚才的 db-helper 和 auth
import { auth } from './firebase.js';
import { insertData } from './db-helper.js';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

// --- 1. 用户注册 ---
export async function registerUser(id_pengguna, kata_laluan, fullName, role = "user") {
  try {
    // A. 在 Firebase Auth 中创建账号密码
    const userCredential = await createUserWithEmailAndPassword(auth, id_pengguna, kata_laluan);
    const user = userCredential.user;
    console.log("Auth 注册成功，UID:", user.uid);

    // B. 利用你的 db-helper 将用户的额外信息存入 Firestore 的 "users" 集合中
    // 注意：我们用 user.uid 作为数据库中的文档 ID，方便以后对应
    const userData = {
      uid: user.uid,
      id_pengguna: id_pengguna,
      fullName: fullName,
      role: role, // 例如 "admin" 或 "user"
      createdAt: new Date()
    };
    
    // 这里我们可以直接调用底层写好的存入逻辑，或者扩展 db-helper
    // 为了省事，我们直接用 insertData（或者指定 uid 的方法）
    await insertData("users", userData);
    
    alert("注册成功！");
    return user;
  } catch (error) {
    console.error("注册失败:", error.message);
    alert("注册失败: " + error.message);
    throw error;
  }
}

// --- 2. 用户登录 ---
export async function loginUser(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    console.log("登录成功，当前用户:", user.email);
    alert("登录成功！");
    return user;
  } catch (error) {
    console.error("登录失败:", error.message);
    alert("登录失败，请检查邮箱或密码。");
    throw error;
  }
}

// --- 3. 用户登出 ---
export async function logoutUser() {
  try {
    await signOut(auth);
    console.log("已成功登出");
    alert("已退出登录");
  } catch (error) {
    console.error("登出失败", error);
  }
}

// --- 4. 监听当前登录状态 (常用于检查用户是否已经登录) ---
export function checkAuthState(onLoginCallback, onLogoutCallback) {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      // 用户已登录
      console.log("当前已登录用户 UID:", user.uid);
      if (onLoginCallback) onLoginCallback(user);
    } else {
      // 用户未登录
      console.log("当前未登录");
      if (onLogoutCallback) onLogoutCallback();
    }
  });
}