import { supabase } from "./supabase-config.js";

lucide.createIcons();

document.addEventListener("DOMContentLoaded", () => {
    const fileInput = document.getElementById("fileInput");
    const chooseBtn = document.getElementById("chooseFileBtn");
    const uploadBtn = document.getElementById("uploadBtn");
    const fileInfo = document.getElementById("fileInfo");
    const dropArea = document.getElementById("dropArea");

    ["dragenter", "dragover", "dragleave", "drop"].forEach(event => {
        document.addEventListener(event, (e) => {
            e.preventDefault();
            e.stopPropagation();
        });
    });

    chooseBtn.onclick = () => fileInput.click();
    fileInput.onchange = () => {
        if (fileInput.files.length > 0) {
            fileInfo.textContent = "Đã chọn: " + fileInput.files[0].name;
        }
    };
    dropArea.addEventListener("dragover", (e) => {
        e.preventDefault();
    });
    dropArea.addEventListener("drop", (e) => {
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            fileInput.files = files;
            fileInfo.textContent = "Đã chọn: " + files[0].name;
        }
    });

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
            const fileName = `${Date.now()}.${ext}`;

            const { error } = await supabase.storage
                .from("PrismUploadDocuments2026")
                .upload(fileName, file);

            if (error) throw error;

            const { data } = supabase.storage
                .from("PrismUploadDocuments2026")
                .getPublicUrl(fileName);

            sessionStorage.setItem("fileName", file.name);
            sessionStorage.setItem("fileUrl", data.publicUrl);

            window.location.href = "discript.html";
        } catch (err) {
            console.error(err);
            alert("Upload thất bại. Kiểm tra Storage policy!");
        }
    };
});
