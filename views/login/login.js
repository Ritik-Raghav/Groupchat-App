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
        console.log(user)
        const obj = {
            id: user.userId,
            token: user.token
        }
        localStorage.setItem('id', obj.id);
        localStorage.setItem('token', obj.token);
        alert('User logged in successfully');
        window.location.href = `${frontendBaseUrl}/views/chat/index.html`;
        
    }
    catch(error) {
        console.log(error);
        alert(error.response.data.message);
    }
    
    event.target.reset();
})