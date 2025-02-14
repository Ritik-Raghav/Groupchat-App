import { currentGroupId, groupChat } from './group.js';

export const frontendBaseUrl = "http://127.0.0.1:5501";
export const backendBaseUrl = "http://localhost:3000";

export const token = localStorage.getItem('token');

export const messageForm = document.querySelector('#message-form');
export const messageInput = document.querySelector('#messageInput');
export const messageContainer = document.querySelector('#message-container');
export const fileInput = document.querySelector('#fileInput');

window.addEventListener('DOMContentLoaded', async () => {
    getChatsById();
});

fileInput.addEventListener('change', async (event) => {
    event.preventDefault(); // ✅ Ensure no form submission occurs
    console.log("File selected, preventing form submission...");

    const file = fileInput.files[0];
    if (!file) return;

    const fileUrl = await uploadFile(file);

    if (fileUrl) {
        displayData({
            chat: fileUrl,
            username: "You",
            dateTime: new Date().toISOString(),
            userId: Number(localStorage.getItem('id'))
        });

        fileInput.value = null; // ✅ Reset file input
    }
});

messageForm.addEventListener('submit', async (e) => {
    e.preventDefault(); // ✅ Prevents form submission refresh

    try {
        const chat = messageInput.value.trim();
        let fileUrl = fileInput.files.length ? await uploadFile(fileInput.files[0]) : null;

        if (!chat && !fileUrl) return; // Prevent empty messages

        const chatObj = {
            chat: fileUrl ? fileUrl : chat,
            groupId: currentGroupId
        };

        const response = await axios.post(`${backendBaseUrl}/group/postGroupChat`, chatObj, {
            headers: { 'Authorization': token }
        });

        displayData(response.data); // ✅ Update chat UI immediately

        // ✅ Clear inputs
        messageInput.value = '';
        fileInput.value = null; // Properly reset file input

    } catch (error) {
        console.error("Error sending message:", error);
    }
});


async function uploadFile(file) {
    try {
        const formData = new FormData();
        formData.append('file', file);

        const response = await axios.post(`${backendBaseUrl}/chat/file`, formData, {
            headers: {
                'Authorization': token,
                'group-id': currentGroupId,
                'Content-Type': 'multipart/form-data'
            }
        });

        console.log(response.data.fileUrl);
        return response.data.fileUrl; // Ensure backend returns the correct URL
    } catch (error) {
        console.error("File upload failed:", error);
        return null;
    }
}


export function displayData(obj) {
    const messageElement = document.createElement('li');
    const id = Number(localStorage.getItem('id'));
    const isCurrentUser = obj.userId === id;

    messageElement.className = isCurrentUser ? 'message-right' : 'message-left';

    let messageContent;
    if (obj.chat.startsWith('/uploads/')) {
        messageContent = `<a href="${backendBaseUrl}${obj.chat}" target="_blank">📎 Download File</a>`;
    } else {
        messageContent = obj.chat;
    }

    messageElement.innerHTML = `
        <p class="message">
            ${messageContent}
            <span>${obj.username} ⚫ ${moment(obj.dateTime).fromNow()}</span>
        </p>
    `;

    messageContainer.appendChild(messageElement);
    scrollToBottom();
}

async function getChatsById() {
    try {
        let localChats = localStorage.getItem('localChats');
    if (!localChats) {
        localStorage.setItem('localChats', '[]');
        localChats = '[]';
    }

    const chatsArr = JSON.parse(localChats);
    const lastId = chatsArr.length ? chatsArr[chatsArr.length - 1].id : 0;

    const response = await axios.get(`${backendBaseUrl}/chat/getChats/${lastId}`, {
        headers: { 'Authorization': token }
    });

    const mergedArray = chatsArr.concat(response.data.formattedChats);
    localStorage.setItem('localChats', JSON.stringify(mergedArray));

    mergedArray.forEach(displayData);
    }
    catch(error) {
        console.log(error);
    }
    
}

function scrollToBottom() {
    messageContainer.scrollTo(0, messageContainer.scrollHeight);
}
