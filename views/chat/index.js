
import { currentGroupId, groupChat } from './group.js';

export const frontendBaseUrl = "http://127.0.0.1:5501";
export const backendBaseUrl = "http://localhost:3000";

export const token = localStorage.getItem('token');

export const messageForm = document.querySelector('#message-form');
export const messageInput = document.querySelector('#messageInput');
export const messageContainer = document.querySelector('#message-container');

window.addEventListener('DOMContentLoaded', async () => {
    // getAllChats();
    // getChatsById();
})

messageForm.addEventListener('submit',  async (event) => {
    event.preventDefault();
    console.log(groupChat)
    
    try {

        if (!groupChat) {
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
        else {
                    console.log(groupChat)
                    const chat = messageInput.value;
                    console.log(chat)
                    const dateTime = new Date();
                    const chatObj = {
                        chat,
                        dateTime,
                        groupId: currentGroupId
                    }
        
                    console.log(chatObj)
            
                    const response = await axios.post(`${backendBaseUrl}/group/postGroupChat`, chatObj, { headers: {'Authorization': token}});
                    const data = response.data;
                    displayData(data);


        }
    }
    catch(error) {
        console.log(error);
    }

    event.target.reset();
});

export function displayData(obj) {
    const messageElement = document.createElement('li');
    const id = Number(localStorage.getItem('id'));
    const isCurrentUser = obj.userId === id;
    // console.log(isCurrentUser)
    // console.log(obj.id + " ---- " + id)
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
        localStorage.setItem('chats', allChats)
        allChats.forEach(user => {
            displayData(user);
        })  
    }
    catch(error) {
        console.log(error);
    }
}

let lastId = 0;
async function getChatsById() {
    let localChats = localStorage.getItem('localChats');
    if (localChats === null) {
        localStorage.setItem('localChats', '[]');
        localChats = localStorage.getItem('localChats')
    }
    const chatsArr = JSON.parse(localChats);
    if (chatsArr.length != 0) {
        lastId = chatsArr[chatsArr.length - 1].id;
    }
    const response = await axios.get(`${backendBaseUrl}/chat/getChats/${lastId}`, {headers: {'Authorization': token}});
    const data = response.data;
    // if (data.change) {
        const mergedArray = chatsArr.concat(data.formattedChats);
        // console.log(mergedArray)
        const resultString = JSON.stringify(mergedArray);
        localStorage.setItem('localChats', resultString);
        mergedArray.forEach(user => {
            displayData(user);
        })
    // }

}

function scrollToBottom() {
    messageContainer.scrollTo(0, messageContainer.scrollHeight);
}

// setInterval(() => {
//     messageContainer.innerHTML = '';
//     getChatsById();
// }, 2000);