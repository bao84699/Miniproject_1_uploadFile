const submit = document.getElementById("submit");

document.getElementById("nameOfFile").textContent = sessionStorage.getItem("fileName");

submit.addEventListener("click", () => {
    const data = {
        fileName: sessionStorage.getItem("fileName"),
        school: document.getElementById("school").value.trim(),
        subject: document.getElementById("subject").value.trim(),
        description: document.getElementById("discript").value.trim()
    };

    sessionStorage.setItem("newDocument", JSON.stringify(data));
    
    if (!data.fileName || !data.school || !data.subject || !data.description) {
        Swal.fire({
            icon: "error",
            title: "Thiếu thông tin",
            text: "Vui lòng điền đầy đủ thông tin!"
        });
        return;
    }
    Swal.fire({
        title: "Gửi thành công!",
        text: "Thông tin đã được lưu.",
        icon: "success",
        draggable: true
    }).then(()=> {
        window.location.href = "./index.html";
    })
});
