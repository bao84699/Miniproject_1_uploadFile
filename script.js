import { supabase } from "./supabase-config.js";
lucide.createIcons();
const toggleBtn = document.getElementById('toggleSidebar');
const sidebar = document.getElementById('sidebar');
toggleBtn.onclick = function(e) {
    e.stopPropagation(); 
    sidebar.classList.toggle('active');
};
document.onclick = function(e) {
    if (window.innerWidth <= 768) {
        if (!sidebar.contains(e.target) && sidebar.classList.contains('active')) {
            sidebar.classList.remove('active');
        }
    }
};
 
/*-------------------SELECT------------------------------------*/
//-----MÔN HỌC------
const subjects = [
  { id: "HTML/ CSS", name: "HTML/ CSS" },
  { id: "HTMT", name: "Hệ thống máy tính" },
  { id: "KTCT", name: "Kĩ thuật lập trình" },
  { id: "TCC", name: "Toán cao cấp" },
  { id: "KTCT", name: "Kinh tế chính trị" },
  { id: "Mac-Lenin", name: "Triết học Mac-Lenin" }
];

const subjectSelect = document.getElementById("subject");
subjects.forEach(s => {
  const option = document.createElement("option");
  option.value = s.id;
  option.textContent = s.name;
  subjectSelect.appendChild(option);
});


//-----LOẠI TÀI LIỆU------
const types = [
  { id: "exam", name: "Đề thi / Kiểm tra" },
  { id: "slide", name: "Giáo trình / Slide" },
  { id: "exercise", name: "Bài tập" },
  { id: "project", name: "Đồ án / Tiểu luận" }
];
const typeSelect = document.getElementById("type");
types.forEach(t => {
  const option = document.createElement("option");
  option.value = t.id;
  option.textContent = t.name;
  typeSelect.appendChild(option);
});
//-----MÔN-------
const yearSelect = document.getElementById("year");
const currentYear = new Date().getFullYear();
for (let i = currentYear - 5; i <= currentYear; i++) {
  const option = document.createElement("option");
  option.value = i + "-" + (i + 1);
  option.textContent = i + " - " + (i + 1);
  yearSelect.appendChild(option);
}
// //-------TRƯỜNG-------
// const schools = [
//   { id: "iuh", name: "Đại học Công nghiệp HCM" },
//   { id: "hcmus", name: "Đại học B" },
//   { id: "ute", name: "Đại học C" }
// ];
// const schoolSelect = document.getElementById("school");
// schools.forEach(s => {
//   const option = document.createElement("option");
//   option.value = s.id;
//   option.textContent = s.name;
//   schoolSelect.appendChild(option);
// });

/* ---------------- SUPABASE FILTER -------------------- */

const subjectFilter = document.getElementById("subject");
const typeFilter = document.getElementById("type");
const yearFilter = document.getElementById("year");
const schoolFilter = document.getElementById("school");

async function loadDocuments(filters = {}) {
    const container = document.querySelector(".content-document");

    let query = supabase
        .from("PrismUploadDocuments2026")
        .select("*")
        .order("id", { ascending: false });

    // áp điều kiện lọc nếu có
    if (filters.subject) query = query.eq("subject", filters.subject);
    if (filters.category) query = query.eq("category", filters.category);
    if (filters.years) query = query.eq("years", filters.years);
    if (filters.school) query = query.eq("school", filters.school);

    const { data, error } = await query;

    if (error) {
        console.error(error);
        container.innerHTML = "<p>Không thể tải tài liệu</p>";
        return;
    }

    container.innerHTML = "";

    if (data.length === 0) {
        container.innerHTML = "<p>Không tìm thấy tài liệu</p>";
        return;
    }

    data.forEach(doc => {
        const link = document.createElement("a");
        link.href = doc.url;
        link.className = "document-link";
        link.target = "_blank";

        link.innerHTML = `
            <div class="document-item">
                <div class="dcmt-image">
                    <img src="image/main_document-img.jpeg" alt="doc" />
                </div>
                <div class="dcmt-info">
                    <p class="dcmt-title">${doc.name}</p>
                    <div class="dcmt-type"><p>${doc.subject || ""}</p></div>
                    <div class="dcmt-type"><p>${doc.school || ""}</p></div>
                    <div class="dcmt-type"><p>${doc.category || ""}</p></div>
                    <div class="dcmt-type"><p>${doc.years || ""}</p></div>
                </div>
            </div>
        `;
        container.appendChild(link);
    });
}

/* load lần đầu */
document.addEventListener("DOMContentLoaded", () => {
    loadDocuments();
});

/* khi đổi filter */
function applyFilter() {
    const filters = {
        subject: subjectFilter.value,
        category: typeFilter.value,
        years: yearFilter.value,
        school: schoolFilter.value
    };

    loadDocuments(filters);
}

subjectFilter.addEventListener("change", applyFilter);
typeFilter.addEventListener("change", applyFilter);
yearFilter.addEventListener("change", applyFilter);
schoolFilter.addEventListener("change", applyFilter);


/*-------------------SUPABASE------------------------------------*/

document.addEventListener("DOMContentLoaded", async () => {
    const container = document.querySelector(".content-document");
    const { data, error } = await supabase
        .from("PrismUploadDocuments2026")
        .select("*")
        .order("id", { ascending: false });

    if (error) {
        console.error(error);
        container.innerHTML = "<p>Không thể tải tài liệu</p>";
        return;
    }
    container.innerHTML = "";
    data.forEach(doc => {
        const link = document.createElement("a");
        link.href = doc.url;
        link.className = "document-link";
        link.target = "_blank";
        link.innerHTML = `
            <div class="document-item">
                <div class="dcmt-image">
                    <img src="image/main_document-img.jpeg" alt="doc" />
                </div>
                <div class="dcmt-info">
                    <p class="dcmt-title">${doc.name}</p>
                    <div class="dcmt-type">
                        <img src="image/main_doc.svg" alt="icon" />
                        <p>${doc.subject || "Document"}</p>
                    </div>
                    <div class="dcmt-type">
                        <img src="image/main_doc.svg" alt="icon" />
                        <p>${doc.school || "Document"}</p>
                    </div>
                    <div class="dcmt-type">
                        <img src="image/main_doc.svg" alt="icon" />
                        <p>${doc.category || "Document"}</p>
                    </div>
                    <div class="dcmt-type">
                        <img src="image/main_doc.svg" alt="icon" />
                        <p>${doc.years || "Document"}</p>
                    </div>
                </div>
            </div>
        `;
        container.appendChild(link);
    });
});
