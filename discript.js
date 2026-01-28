import { supabase } from "./supabase-config.js";

const submit = document.getElementById("submit");
const fileNameEl = document.getElementById("nameOfFile");

// Hiển thị tên file
fileNameEl.textContent = sessionStorage.getItem("fileName") || "Không có file";

submit.addEventListener("click", async () => {
    const fileName = sessionStorage.getItem("fileName");
    const fileUrl = sessionStorage.getItem("fileUrl");

    const school = document.getElementById("school").value.trim();
    const subject = document.getElementById("subject").value.trim();
    const description = document.getElementById("discript").value.trim();

    if (!fileName || !fileUrl || !school || !subject || !description) {
        Swal.fire("Thiếu thông tin", "Vui lòng nhập đầy đủ!", "error");
        return;
    }

    const { error } = await supabase
        .from("PrismUploadDocuments2026")
        .insert([
            {
                name: fileName,
                school: school,
                subject: subject,
                discription: description, 
                url: fileUrl
            }
        ]);

    if (error) {
        console.error(error);
        Swal.fire("Lỗi", "Không thể lưu dữ liệu!", "error");
        return;
    }

    Swal.fire("Thành công", "Tài liệu đã được lưu!", "success")
        .then(() => {
            sessionStorage.clear();
            window.location.href = "index.html";
        });
});
