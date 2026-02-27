lucide.createIcons();
import { supabase } from "./supabase-config.js";

//1. Phần tử của xem trước.
const docViewer = document.getElementById('docViewer');
const viewerContainer = document.getElementById('viewerContainer');
const modalDocTitle = document.getElementById('modalDocTitle');
const closeBtn = document.querySelector('.close-viewer');
//2. Mở tài liệu.
function openDocument(url, name) {
    modalDocTitle.textContent = name;
    viewerContainer.innerHTML = `<div class="loading-spinner">Đang tải tài liệu...</div>`;
    docViewer.style.display = "block";
    if (url.toLowerCase().endsWith('.pdf')) {
        viewerContainer.innerHTML = `<embed src="${url}#toolbar=0" type="application/pdf" width="100%" height="100%">`;
    } else {
        const googleViewerUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=true`;
        viewerContainer.innerHTML = `<iframe src="${googleViewerUrl}" style="width:100%; height:100%;" frameborder="0"></iframe>`;
    }

    docViewer.oncontextmenu = (e) => e.preventDefault();
}

// Đóng Viewer
closeBtn.onclick = () => {
    docViewer.style.display = "none";
    viewerContainer.innerHTML = ""; 
};

// Đóng khi click ra ngoài vùng trắng
window.addEventListener('click', (e) => {
    if (e.target == docViewer) {
        closeBtn.onclick();
    }
});

// ----------- 3. SIDEBAR & MENU ----------------
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

/*-------------------SELECT OPTIONS------------------------------------*/
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

const yearSelect = document.getElementById("year");
const currentYear = new Date().getFullYear();
for (let i = currentYear - 5; i <= currentYear; i++) {
    const option = document.createElement("option");
    option.value = i + "-" + (i + 1);
    option.textContent = i + " - " + (i + 1);
    yearSelect.appendChild(option);
}

/* ----------------- 4.SUPABASE FILTER & LOAD --------------------------- */

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
        const docCard = document.createElement("div");
        docCard.className = "document-link"; 
        docCard.style.cursor = "pointer";

        docCard.innerHTML = `
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

        docCard.onclick = () => openDocument(doc.url, doc.name);
        container.appendChild(docCard);
    });
}
// Chạy load lần đầu
document.addEventListener("DOMContentLoaded", () => {
    loadDocuments();
});
// Xử lý Filter
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
