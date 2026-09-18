// 引入你 db_helper.js 里的功能
import { readAllData, deleteData } from './db_helper.js';

// 设定 Firebase 中的集合名称 (Collection)
// 假设我们在 pengguna 打卡时，把数据存在名为 "laporan_kehadiran" 的 collection 里
const COLLECTION_NAME = 'laporan_kehadiran'; 

// 负责获取并显示数据的函数
async function loadKehadiranData() {
    const container = document.getElementById('kehadiranContainer');
    
    try {
        // 使用你的 db_helper 抓取所有数据，并根据 createdAt (创建时间) 降序排列 (最新的在最上面)
        const records = await readAllData(COLLECTION_NAME, 'createdAt', 'desc');

        // 如果没有数据 (文字颜色换成白色并加上阴影，适配雾面玻璃背景)
        if (records.length === 0) {
            container.innerHTML = `<p style="color: #ffffff; text-align: center; text-shadow: 1px 1px 2px rgba(0,0,0,0.3);">Tiada rekod kehadiran buat masa ini.</p>`;
            return;
        }

        // 构建表格 HTML
        let tableHTML = `
            <table>
                <thead>
                    <tr>
                        <th>Bil.</th>
                        <th>Nama Pengguna</th>
                        <th>Tarikh & Masa</th>
                        <th>Laporan / Catatan</th>
                        <th>Tindakan</th>
                    </tr>
                </thead>
                <tbody>
        `;

        // 循环遍历每一条打卡记录
        records.forEach((item, index) => {
            // 假设存入 Firebase 的数据有 nama, tarikh, masa, laporan 这些字段
            const nama = item.nama || 'Tidak diketahui';
            const tarikh = item.tarikh || '-';
            const masa = item.masa || '-';
            const laporan = item.laporan || 'Tiada catatan';

            // 去掉了 <small> 标签里的 color: gray，让外部 CSS 统一控制颜色
            tableHTML += `
                <tr>
                    <td>${index + 1}</td>
                    <td><strong>${nama}</strong></td>
                    <td>${tarikh} <br> <small>${masa}</small></td>
                    <td style="white-space: pre-line;">${laporan}</td>
                    <td>
                        <button class="btn-delete" onclick="window.padamRekod('${item.id}')">🗑️ Padam</button>
                    </td>
                </tr>
            `;
        });

        tableHTML += `</tbody></table>`;
        container.innerHTML = tableHTML;

    } catch (error) {
        console.error("Gagal memuat turun data: ", error);
        // 错误提示也调整了颜色和阴影，确保在背景图上能看清
        container.innerHTML = `<p style="color: #ffcccc; text-align: center; text-shadow: 1px 1px 2px rgba(0,0,0,0.5);">Ralat berlaku semasa mengambil data. Sila semak console.</p>`;
    }
}

// 设定删除功能的全局函数 (因为在 ES6 Module 中直接写 onclick 会找不到函数，所以挂载在 window 上)
window.padamRekod = async function(docId) {
    if (confirm("Adakah anda pasti mahu memadam rekod ini? (确定要删除此打卡记录吗？)")) {
        try {
            // 调用 db_helper.js 的 deleteData
            await deleteData(COLLECTION_NAME, docId);
            alert("Rekod berjaya dipadam!");
            // 删除成功后重新加载表格数据
            loadKehadiranData();
        } catch (error) {
            alert("Gagal memadam rekod.");
        }
    }
};

// 页面加载完成后，立刻执行获取数据的函数
document.addEventListener('DOMContentLoaded', loadKehadiranData);