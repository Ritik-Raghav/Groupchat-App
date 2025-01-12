const frontendBaseUrl = "http://127.0.0.1:5501";
const backendBaseUrl = "http://localhost:3000";

const form = document.querySelector('#login-form');

form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const email = event.target.email.value;
    const password = event.target.password.value;

    const userObj = {
        email,
        password
    };

    try {
        const response = await axios.post(`${backendBaseUrl}/login/user`, userObj);
        const user = response.data;
        console.log(user.token);
        localStorage.setItem('token', user.token);
        alert('User logged in successfully');
        window.location.href = `${frontendBaseUrl}/views/chat/chat.html`;
        
    }
    catch(error) {
        console.log(error);
        alert(error.response.data.message);
    }
    
    event.target.reset();
})