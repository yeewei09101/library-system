import { db } from './firebase.js';
import { 
  collection, 
  addDoc, 
  getDocs, 
  getDoc,
  doc,
  query, 
  orderBy, 
  where,
  updateDoc,
  deleteDoc
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

/**
 * 1. 写入/插入数据 (Insert Data)
 * @param {string} collectionName - 集合名称 (如 'pengumuman', 'laporan')
 * @param {Object} data - 要插入的数据对象
 * @returns {Promise<string>} - 返回新创建文档的 ID
 */
export async function insertData(collectionName, data) {
  try {
    const colRef = collection(db, collectionName);
    // 自动附加创建时间戳
    const dataToSave = {
      ...data,
      createdAt: new Date()
    };
    const docRef = await addDoc(colRef, dataToSave);
    console.log(`成功写入 [${collectionName}]，文档 ID:`, docRef.id);
    return docRef.id;
  } catch (error) {
    console.error(`写入 [${collectionName}] 失败:`, error);
    throw error;
  }
}

/**
 * 2. 读取整个集合的数据 (Read All Data)
 * @param {string} collectionName - 集合名称
 * @param {string|null} orderByField - (可选) 排序字段，如 'createdAt'
 * @param {string} orderDirection - (可选) 排序方向 'desc' 或 'asc'，默认 'desc'
 * @returns {Promise<Array>} - 返回包含文档 ID 和数据的数组
 */
export async function readAllData(collectionName, orderByField = null, orderDirection = 'desc') {
  try {
    const colRef = collection(db, collectionName);
    let q = colRef;

    if (orderByField) {
      q = query(colRef, orderBy(orderByField, orderDirection));
    }

    const querySnapshot = await getDocs(q);
    const dataList = [];

    querySnapshot.forEach((doc) => {
      dataList.push({
        id: doc.id,
        ...doc.data()
      });
    });

    return dataList;
  } catch (error) {
    console.error(`读取 [${collectionName}] 列表失败:`, error);
    throw error;
  }
}

/**
 * 3. 条件查询数据 (Query Data by Condition)
 * @param {string} collectionName - 集合名称
 * @param {string} field - 字段名 (如 'role', 'status')
 * @param {string} operator - 比较符 ('==', '>=', '<=', 'array-contains' 等)
 * @param {any} value - 匹配的值
 * @returns {Promise<Array>}
 */
export async function queryData(collectionName, field, operator, value) {
  try {
    const colRef = collection(db, collectionName);
    const q = query(colRef, where(field, operator, value));
    const querySnapshot = await getDocs(q);
    const dataList = [];

    querySnapshot.forEach((doc) => {
      dataList.push({
        id: doc.id,
        ...doc.data()
      });
    });

    return dataList;
  } catch (error) {
    console.error(`查询 [${collectionName}] 失败:`, error);
    throw error;
  }
}

/**
 * 4. 根据 ID 读取单个文档 (Read Single Document)
 * @param {string} collectionName - 集合名称
 * @param {string} docId - 文档 ID
 * @returns {Promise<Object|null>}
 */
export async function readDataById(collectionName, docId) {
  try {
    const docRef = doc(db, collectionName, docId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      console.warn(`未找到 [${collectionName}] ID 为 ${docId} 的文档`);
      return null;
    }
  } catch (error) {
    console.error(`读取单个文档失败:`, error);
    throw error;
  }
}

/**
 * 5. 更新已有数据 (Update Data)
 * @param {string} collectionName - 集合名称
 * @param {string} docId - 文档 ID
 * @param {Object} updateData - 需要更新的字段
 */
export async function updateData(collectionName, docId, updateData) {
  try {
    const docRef = doc(db, collectionName, docId);
    await updateDoc(docRef, {
      ...updateData,
      updatedAt: new Date()
    });
    console.log(`成功更新 [${collectionName}] ID: ${docId}`);
  } catch (error) {
    console.error(`更新数据失败:`, error);
    throw error;
  }
}

/**
 * 6. 删除数据 (Delete Data)
 * @param {string} collectionName - 集合名称
 * @param {string} docId - 文档 ID
 */
export async function deleteData(collectionName, docId) {
  try {
    const docRef = doc(db, collectionName, docId);
    await deleteDoc(docRef);
    console.log(`成功删除 [${collectionName}] ID: ${docId}`);
  } catch (error) {
    console.error(`删除数据失败:`, error);
    throw error;
  }
}