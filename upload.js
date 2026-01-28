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
        const allowedTypes = [
            "application/pdf",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        ];

        const allowedExt = ["pdf", "doc", "docx"];
        const ext = file.name.split(".").pop().toLowerCase();
        if (!allowedTypes.includes(file.type) || !allowedExt.includes(ext)) {
            alert("Chỉ cho phép upload file PDF, DOC, DOCX");
            return;
        }
        const MAX_SIZE = 10 * 1024 * 1024;
        if (file.size > MAX_SIZE) {
            alert("File tối đa 10MB");
            return;
        }
        try {
            const ext = file.name.split(".").pop();
            const fileName = `${Date.now()}.${ext}`;
            const filePath = fileName;
            const { error } = await supabase.storage
                .from("PrismUploadDocuments2026")
                .upload(filePath, file);

            if (error) throw error;

            const { data } = supabase.storage
                .from("PrismUploadDocuments2026")
                .getPublicUrl(filePath);

            sessionStorage.setItem("fileName", file.name);
            sessionStorage.setItem("fileUrl", data.publicUrl);
            window.location.href = "discript.html";
        } catch (err) {
            console.error(err);
            alert("Upload thất bại. Kiểm tra Storage policy!");
        }
    };
});
