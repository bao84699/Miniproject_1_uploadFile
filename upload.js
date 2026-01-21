lucide.createIcons();
export let fileInput;

document.addEventListener("DOMContentLoaded", () => {
    fileInput = document.getElementById("fileInput");
    const chooseBtn = document.getElementById("chooseFileBtn");
    const fileInfo = document.getElementById("fileInfo");
    chooseBtn.addEventListener("click", () => {
        fileInput.click();
    });

    fileInput.addEventListener("change", () => {
        if (fileInput.files.length > 0) {
            fileInfo.textContent = "Đã chọn: " + fileInput.files[0].name;
        }
        sessionStorage.setItem("fileName", fileInput.files[0].name);
    });
});
