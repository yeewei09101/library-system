// 引入你的 db_helper.js 里的 insertData 功能
import { insertData } from './db_helper.js';

// 集合名称必须跟 Admin 端读取的一模一样
const COLLECTION_NAME = 'laporan_kehadiran';

// 监听表单的提交事件
document.getElementById('punchInForm').addEventListener('submit', async function(event) {
    event.preventDefault(); // 阻止页面刷新

    const namaInput = document.getElementById('nama').value.trim();
    let laporanInput = document.getElementById('laporan').value.trim();
    
    // 如果用户没填报告，给一个默认值
    if (laporanInput === '') {
        laporanInput = 'Tiada catatan';
    }

    const submitBtn = document.getElementById('submitBtn');
    const statusMessage = document.getElementById('statusMessage');

    // 1. 按钮防多次点击状态
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sedang menghantar... (发送中)';
    statusMessage.innerHTML = '';

    // 2. 自动获取当前系统的日期和时间 (防止用户作弊填写假时间)
    const now = new Date();
    
    // 格式化日期：DD/MM/YYYY
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0'); // 月份从 0 开始，所以要 +1
    const year = now.getFullYear();
    const tarikh = `${day}/${month}/${year}`;

    // 格式化时间：12小时制 (contoh: 02:30 PM)
    const masa = now.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit', 
        hour12: true 
    });

    // 3. 准备要传给 Firebase 的数据包
    const dataToSave = {
        nama: namaInput,
        tarikh: tarikh,
        masa: masa,
        laporan: laporanInput
    };

    // 4. 调用 db_helper 插入数据
    try {
        await insertData(COLLECTION_NAME, dataToSave);
        
        // 成功提示
        statusMessage.innerHTML = `<span style="color: #4ade80;">✅ Berjaya Punch-in! Masa direkodkan: ${masa}</span>`;
        
        // 清空表单，方便下一个人填
        document.getElementById('punchInForm').reset();
        
    } catch (error) {
        console.error("Ralat semasa punch-in:", error);
        // 失败提示
        statusMessage.innerHTML = `<span style="color: #f87171;">❌ Gagal! Sila periksa sambungan internet.</span>`;
    } finally {
        // 恢复按钮状态
        submitBtn.disabled = false;
        submitBtn.textContent = 'Sahkan Kehadiran';
    }
});