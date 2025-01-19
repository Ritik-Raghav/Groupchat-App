const frontendBaseUrl = "http://127.0.0.1:5501";
const backendBaseUrl = "http://localhost:3000";

const token = localStorage.getItem('token');

const messageForm = document.querySelector('#message-form');
const messageInput = document.querySelector('#message-input');
const messageContainer = document.querySelector('#message-container');

window.addEventListener('DOMContentLoaded', async () => {
    getAllChats();
})

messageForm.addEventListener('submit',  async (event) => {
    event.preventDefault();

    try {
        const chat = messageInput.value;
        const dateTime = new Date();
        const chatObj = {
            chat,
            dateTime
        }

        const response = await axios.post(`${backendBaseUrl}/chat/postChat`, chatObj, { headers: {'Authorization': token}});
        const data = response.data;
        displayData(data);
    }
    catch(error) {
        console.log(error);
    }

    event.target.reset();
});

function displayData(obj) {
    const messageElement = document.createElement('li');
    const id = Number(localStorage.getItem('id'));
    const isCurrentUser = obj.id === id;
    console.log(isCurrentUser)
    console.log(obj.id + " ---- " + id)
    messageElement.className = isCurrentUser ? 'message-right' : 'message-left';
    messageElement.innerHTML = `
        <p class="message">
            ${obj.chat}
            <span>${obj.username} ⚫ ${moment(obj.dateTime).fromNow()}</span>
        </p>
    `;
    messageContainer.appendChild(messageElement);

    scrollToBottom();
}

async function getAllChats() {
    try {
        const response = await axios.get(`${backendBaseUrl}/chat/getChats`, {headers: {'Authorization': token}});
        const allChats = response.data;
        allChats.forEach(user => {
            displayData(user);
        })
    }
    catch(error) {
        console.log(error);
    }
}

function scrollToBottom() {
    messageContainer.scrollTo(0, messageContainer.scrollHeight);
}