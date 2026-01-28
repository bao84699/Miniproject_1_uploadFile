import { supabase } from "./supabase-config.js";

lucide.createIcons();

document.addEventListener("DOMContentLoaded", () => {
    const fileInput = document.getElementById("fileInput");
    const chooseBtn = document.getElementById("chooseFileBtn");
    const uploadBtn = document.getElementById("uploadBtn");
    const fileInfo = document.getElementById("fileInfo");

    chooseBtn.onclick = () => fileInput.click();

    fileInput.onchange = () => {
        if (fileInput.files.length > 0) {
            fileInfo.textContent = "Đã chọn: " + fileInput.files[0].name;
        }
    };

    uploadBtn.onclick = async () => {
        const file = fileInput.files[0];
        if (!file) {
            alert("Vui lòng chọn file");
            return;
        }

        try {
            const ext = file.name.split(".").pop();
            const fileName = `${Date.now()}.${ext}`;

            // ✅ KHÔNG public/
            const filePath = fileName;

            // 1️⃣ Upload
            const { error } = await supabase.storage
                .from("PrismUploadDocuments2026")
                .upload(filePath, file);

            if (error) throw error;

            // 2️⃣ Public URL
            const { data } = supabase.storage
                .from("PrismUploadDocuments2026")
                .getPublicUrl(filePath);

            // 3️⃣ Lưu session
            sessionStorage.setItem("fileName", file.name);
            sessionStorage.setItem("fileUrl", data.publicUrl);

            // 4️⃣ Chuyển trang
            window.location.href = "discript.html";

        } catch (err) {
            console.error(err);
            alert("Upload thất bại. Kiểm tra Storage policy!");
        }
    };
});
