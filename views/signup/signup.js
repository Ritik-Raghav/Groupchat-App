const frontendBaseUrl = "http://127.0.0.1:5501";
const backendBaseUrl = "http://localhost:3000";

const form = document.querySelector('#signup-form');

form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const username = event.target.username.value;
    const email = event.target.email.value;
    const mobile = event.target.mobile.value;
    const password = event.target.password.value;

    const userObj = {
        username,
        email,
        mobile,
        password
    };

    try {
        const response = await axios.post(`${backendBaseUrl}/signup/user`, userObj);
        const user = response.data;
        alert('User signed up successfully');
        console.log(user)
        window.location.href = `${frontendBaseUrl}/views/login/login.html`;
    }
    catch(error) {
        // Handle errors
        if (error.response) {
            if (error.response.status === 409) {
                alert('User already exists with this email or mobile');
            }
            else if (error.response.status === 400) {
                alert('All fields are required');
            }
            else {
                alert('Something went wrong!');
            }
        }
        else {
            // Network or server issues
            alert('Failed to connect to server');
        }
        console.log(error);
    }

    event.target.reset();
    
});
