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

document.addEventListener("DOMContentLoaded", () => {
    const data = sessionStorage.getItem("newDocument");
    if (!data) return;

    const doc = JSON.parse(data);
    const container = document.querySelector(".content-document");

    const link = document.createElement("a");
    link.className = "document-link";
    link.innerHTML = `
        <div class="document-item">
            <div class="dcmt-image">
                <img src="image/main_document-img.jpeg" alt="doc-sample" />
            </div>
            <div class="dcmt-info">
                <p class="dcmt-title">${doc.fileName}</p>
                <div class="dcmt-type">
                    <img src="image/main_doc.svg" alt="pdf-icon" />
                    <p>${doc.subject || "Document"}</p>
                </div>
            </div>
        </div>
    `;

    // Thêm lên đầu danh sách
    container.prepend(link);

    // XÓA SAU KHI DÙNG (tránh load lại tạo trùng)
    sessionStorage.removeItem("newDocument");
});