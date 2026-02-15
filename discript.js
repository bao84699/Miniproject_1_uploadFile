import { supabase } from "./supabase-config.js";
lucide.createIcons();

//Chọn năm học.
const select = document.getElementById("schoolYear");
const currentYear = new Date().getFullYear();
select.insertAdjacentHTML(
    "afterbegin",
    '<option value="" disabled selected hidden>Chọn năm học</option>'
);
for (let i = currentYear - 5; i <= currentYear; i++) {
    const option = document.createElement("option");
    option.value = i + "-" + (i + 1);
    option.textContent = i + " - " + (i + 1);
    select.appendChild(option);
}
/*---------------------------------------------------------------*/
//Chọn môn học
const subjectSelect = document.getElementById("subject");
const subjects = [
  { id: "HTML/ CSS", name: "HTML/ CSS" },
  { id: "HTMT", name: "Hệ thống máy tính" },
  { id: "KTCT", name: "Kĩ thuật lập trình" },
  { id: "TCC", name: "Toán cao cấp" },
  { id: "KTCT", name: "Kinh tế chính trị" },
  { id: "Mac-Lenin", name: "Triết học Mac-Lenin" }
];
subjects.forEach(sub => {
  const option = document.createElement("option");
  option.value = sub.id;        // dùng để lưu & filter
  option.textContent = sub.name;
  subjectSelect.appendChild(option);
});

/*--------------------Category---------------------------------*/
let selectedType = "";
const buttons = document.querySelectorAll(".doc-type");
buttons.forEach(btn => {
    btn.addEventListener("click", () => {
        selectedType = btn.dataset.value;
    });
});
/*---------------------------------------------------------------*/
//Đẩy file lên Supabase
const submit = document.getElementById("submit");
const fileNameEl = document.getElementById("nameOfFile");
fileNameEl.textContent = sessionStorage.getItem("fileName") || "Không có file";
submit.addEventListener("click", async () => {
    const fileName = sessionStorage.getItem("fileName");
    const fileUrl = sessionStorage.getItem("fileUrl");
    const school = document.getElementById("school").value.trim();
    const subject = document.getElementById("subject").value.trim();
    const description = document.getElementById("discript").value.trim();
    const Years = document.getElementById("schoolYear").value;
    let schoolYear = String(Years)
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
                url: fileUrl,
                years: schoolYear,
                category: selectedType
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

