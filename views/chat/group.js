import { frontendBaseUrl, backendBaseUrl, token, messageForm, messageInput, messageContainer, displayData } from './index.js';

const groupForm = document.querySelector('#group-form');
const memberForm = document.querySelector('#member-form');
const memberItems = document.querySelector('#member-items');
const groupSetting = document.querySelector('.group-setting');
const memberContainer = document.querySelector('.member-container');
const showGroupsBtn = document.querySelector('#show-groups');
const groupsContainer = document.querySelector('.groups-container');
const groupItems = document.querySelector('#group-items');
const grpName = document.querySelector('#grpName');

const currentUserId = localStorage.getItem('id');
console.log(currentUserId)

let editGroup = false;
let lastId = 0;
export let currentGroupId = null;
export let groupChat = false;
let groupsFlag = false;

groupSetting.style.display = 'none';
groupsContainer.style.display = 'none';

function displayAllGroupMembers(group, user) {
    grpName.textContent = group.name;
    const elementDiv = document.createElement('div');
    const element = document.createElement('li');
    element.className = 'member-item';
    element.id = user.id;
    element.textContent = user.username;
    console.log(group)
    console.log(user)

    const obj = {
        usergroup: {

        }
    }
    obj.usergroup.groupId = group.id;
    obj.usergroup.userId = user.id;


    const delBtn = document.createElement('button');
    delBtn.className = 'delMember';
    delBtn.textContent = 'delete';


    let num = user.usergroup.isadmin === true ? 1 : 0;

    const adminBtn = document.createElement('button');
    adminBtn.className = 'adminMember';
    adminBtn.textContent = 'make-admin';
    adminBtn.id = num;
    console.log(num);
    if (adminBtn.id === '1') {
        adminBtn.textContent = 'remove-admin';
        adminBtn.style.backgroundColor = 'darkRed';
        adminBtn.style.color = 'white';
    }
    else {
        adminBtn.textContent = 'make-admin';
        adminBtn.style.backgroundColor = 'white';
        adminBtn.style.color = 'black';
    }

    

    delBtn.addEventListener('click', async (event) => {
        event.preventDefault();
        try {
            const groupId = group.id;
            const userId = user.id;
            await axios.delete(`${backendBaseUrl}/group/deleteMember`, { data: { groupId, userId } });
            memberItems.removeChild(elementDiv);
        } catch (error) {
            console.error(error);
        }
    });

    let isAdmin = false;
    adminBtn.addEventListener('click', async (event) => {
        event.preventDefault();
        let admin = event.target.id;
        console.log(admin)
        try {
            if (admin === '0') {
                admin = 1;
                console.log(admin);

                const response = await axios.patch(`${backendBaseUrl}/group/updateAdmin`, { admin: admin, obj: obj }, { headers: { 'Authorization': token } });
                const data = response.data;
                console.log(data);

                adminBtn.textContent = 'remove-admin';
                adminBtn.style.backgroundColor = 'darkRed';
                adminBtn.style.color = 'white';
                adminBtn.id = admin;
                isAdmin = true;
            }
            else {
                admin = 0;

                const response = await axios.patch(`${backendBaseUrl}/group/updateAdmin`, { admin: admin, obj: obj }, { headers: { 'Authorization': token } });
                const data = response.data;
                console.log(data);

                adminBtn.textContent = 'make-admin';
                adminBtn.style.backgroundColor = 'white';
                adminBtn.style.color = 'black';
                adminBtn.id = admin;
                isAdmin = false;
            }

        }
        catch(error) {
            console.log(error);
        }
    })

    element.append(adminBtn, delBtn);
    elementDiv.appendChild(element);
    memberItems.appendChild(elementDiv);
}


groupItems.addEventListener('click', async (e) => { 
    e.preventDefault();

    if (e.target.tagName !== 'LI') return;
    
    groupChat = true;
    editGroup = true;
    currentGroupId = e.target.id;
    
    try {
        const response = await axios.get(`${backendBaseUrl}/group/getGroupById/${currentGroupId}`, { headers: { 'Authorization': token } });
        const { group, users } = response.data;

        memberItems.innerHTML = '';
        
        users.forEach(user => displayAllGroupMembers(group, user));

        groupsContainer.style.display = 'none';
        groupSetting.style.display = 'block';
        memberContainer.style.display = 'block';
        groupForm.style.display = 'none';
        
        await getGroupChats();
    } catch (error) {
        console.error(error);
    }
});

showGroupsBtn.addEventListener('click', async (e) => {
    e.preventDefault();
    try {
        groupsContainer.style.display = groupsContainer.style.display === 'none' ? 'block' : 'none';
        groupSetting.style.display = 'none';
        memberContainer.style.display = groupsContainer.style.display === 'block' ? 'none' : 'block';
        groupForm.style.display = groupsContainer.style.display === 'block' ? 'none' : 'flex';
    
        if (!groupsFlag && groupsContainer.style.display === 'block') {
            await getGroups();
            groupsFlag = true;
        }
    }
    catch(error) {
        console.log(error);
    }
    
});

async function getGroups() {
    try {
        const response = await axios.get(`${backendBaseUrl}/group/getUserGroups`, { headers: { 'Authorization': token } });
        groupItems.innerHTML = '';
        // console.log(response.data);
        response.data.forEach(displayGroups);
    } catch (error) {
        console.error(error);
    }
}

groupForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    editGroup = false;
    
    try {
        const groupName = event.target.groupName.value;
        const response = await axios.post(`${backendBaseUrl}/group/postGroup`, { groupName }, { headers: { 'Authorization': token } });
        grpName.textContent = response.data.name;
        currentGroupId = response.data.id;

        memberItems.innerHTML = '';

        if (groupSetting.style.display === 'none') {
            groupSetting.style.display = 'block';
            groupForm.style.display = 'none';
        }
    } catch (error) {
        console.error(error);
    }
    event.target.reset();
});

memberForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    try {
        const member = e.target.selectMember.value;
        await postMember({ groupId: currentGroupId, memberName: member });
    } catch (error) {
        console.error(error);
    }
    e.target.reset();
});

async function postMember(userGroup) {
    try {
        const response = await axios.post(`${backendBaseUrl}/group/postMember`, userGroup, { headers: { 'Authorization': token } });
        console.log(response.data);
        displayGroupMembers(response.data);
    } catch (error) {
        console.error(error);
    }
}

function displayGroupMembers(obj) {
    const elementDiv = document.createElement('div');
    const element = document.createElement('li');
    element.className = 'member-item';
    element.id = obj.user.id;
    element.textContent = obj.user.username;
    
    const delBtn = document.createElement('button');
    delBtn.className = 'delMember';
    delBtn.textContent = 'delete';
    
    const adminBtn = document.createElement('button');
    adminBtn.className = 'adminMember';
    adminBtn.textContent = 'make-admin';
    adminBtn.id = 0;

    delBtn.addEventListener('click', async (event) => {
        event.preventDefault();
        try {
            const groupId = obj.usergroup.groupId;
            const userId = obj.user.id;
            await axios.delete(`${backendBaseUrl}/group/deleteMember`, { data: { groupId, userId } });
            memberItems.removeChild(elementDiv);
        } catch (error) {
            console.error(error);
        }
    });

    let isAdmin = false;
    adminBtn.addEventListener('click', async (event) => {
        event.preventDefault();
        let admin = event.target.id;
        console.log(admin)
        try {
            if (admin === '0') {
                admin = 1;
                console.log(admin);

                const response = await axios.patch(`${backendBaseUrl}/group/updateAdmin`, { admin: admin, obj: obj }, { headers: { 'Authorization': token } });
                const data = response.data;
                console.log(data);

                adminBtn.textContent = 'remove-admin';
                adminBtn.style.backgroundColor = 'darkRed';
                adminBtn.style.color = 'white';
                adminBtn.id = admin;
                isAdmin = true;
            }
            else {
                admin = 0;

                const response = await axios.patch(`${backendBaseUrl}/group/updateAdmin`, { admin: admin, obj: obj }, { headers: { 'Authorization': token } });
                const data = response.data;
                console.log(data);

                adminBtn.textContent = 'make-admin';
                adminBtn.style.backgroundColor = 'white';
                adminBtn.style.color = 'black';
                adminBtn.id = admin;
                isAdmin = false;
            }

        }
        catch(error) {
            console.log(error);
        }
    })
    
    element.append(adminBtn, delBtn);
    elementDiv.appendChild(element);
    memberItems.appendChild(elementDiv);
}

function displayGroups(obj) {
    const elementDiv = document.createElement('div');
    const element = document.createElement('li');
    element.className = 'group-item';
    element.id = obj.id;
    element.textContent = `Name: ${obj.name} | Creator: ${obj.creator}`;

    const delBtn = document.createElement('button');
    delBtn.className = 'delGroup';
    delBtn.textContent = 'delete';
    
    delBtn.addEventListener('click', async () => {
        try {
            await axios.delete(`${backendBaseUrl}/group/deleteGroup`, { data: { groupId: obj.id } });
            elementDiv.remove();
        } catch (error) {
            console.error(error);
        }
    });
    
    element.appendChild(delBtn);
    elementDiv.appendChild(element);
    groupItems.appendChild(elementDiv);
}

async function getGroupChats() {
    try {
        const response = await axios.get(`${backendBaseUrl}/group/getGroupChats/${currentGroupId}`, { headers: { 'Authorization': token } });
        messageContainer.innerHTML = '';
        response.data.formattedChats.forEach(displayData);
    } catch (error) {
        console.error(error);
    }
}
