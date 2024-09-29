async function signup(){
    const username = document.getElementById("signup-username").value;
    const password = document.getElementById("signup-password").value;
    const response = await axios("http://localhost:3000/signup",{
        username,
        password
    });
    alert(response.data.message);
}