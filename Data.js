document.getElementById("loginForm").addEventListener("submit", async function(event) {
    event.preventDefault();  // Prevent form from refreshing the page

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    try {
        const response = await fetch("http://localhost:5000/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password }),
        });

        const data = await response.json();
        
        if (response.ok) {
            alert(data.message);
            window.location.href = "index.html";  // Redirect on successful login
        } else {
            alert(data.error);  // Show error message if login fails
        }
    } catch (error) {
        console.error("Login error:", error);
        alert("Something went wrong!");
    }
});
