    const form = document.getElementById("form");
    const btn = document.getElementById("btn");
    const pass = document.getElementById("pass");
    const toggle = document.getElementById("toggle");

    const toast = document.getElementById("toast");
    const text = document.getElementById("text");
    const bar = document.getElementById("bar");

    const USER = "Allanadmin";
    const PASSWORD = "Alan@123";

    toggle.onclick = () => {
    pass.type = pass.type === "password" ? "text" : "password";
    toggle.classList.toggle("fa-eye");
    toggle.classList.toggle("fa-eye-slash");
    };

    function showToast(message, type) {
    text.innerText = message;
    bar.className = "toast-bar " + type;
    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 3000);
    }
        
    form.addEventListener("submit", (e) => {
    e.preventDefault();

    btn.classList.add("loading");
    btn.innerText = "Entrando...";

    const user = document.getElementById("user").value.trim();
    const password = pass.value.trim();

    setTimeout(() => {
        if (user === USER && password === PASSWORD) {
        localStorage.setItem("auth", "true");

        showToast("Login realizado com sucesso!", "success");

        setTimeout(() => {
            window.location.href = "../Admin/Pages/Dashboard.html";
        }, 1000);
        } else {
        showToast("Usuário ou senha inválidos", "error");

        btn.classList.remove("loading");
        btn.innerText = "Entrar";
        }
    }, 800);
    });
