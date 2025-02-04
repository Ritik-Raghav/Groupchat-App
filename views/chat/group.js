
const groupForm = document.querySelector('#group-form');
const memberForm = document.querySelector('#member-form');
const memberItems = document.querySelector('#member-items');
const groupSetting = document.querySelector('.group-setting');
const memberContainer = document.querySelector('.member-container');
const showGroupsBtn = document.querySelector('#show-groups');
const groupsContainer = document.querySelector('.groups-container');
const groupItems = document.querySelector('#group-items');
const groupItem = document.querySelector('.group-item');
const grpName = document.querySelector('#grpName');

let currentGroupId = null;


groupSetting.style.display = 'none';

groupsContainer.style.display = 'none';

function displayAllGroupMembers(group, user) {
    grpName.textContent = group.name;
    const elementDiv = document.createElement('div');
    const element = document.createElement('li');
    element.className = 'member-item';
    element.id = user.id;
    element.textContent = user.username;

    // creating buttons
    const delBtn = document.createElement('button');
    delBtn.className = 'delMember';
    delBtn.textContent = 'delete';

    const adminBtn = document.createElement('button');
    adminBtn.className = 'adminMember';
    adminBtn.textContent = 'make-admin';

    element.appendChild(adminBtn);
    element.appendChild(delBtn);

    elementDiv.appendChild(element);
    memberItems.appendChild(elementDiv);

    // delete funtionality
    delBtn.onclick = async (event) => {
        event.preventDefault();
        try {
            const groupId = group.id;
            const userId = event.target.parentElement.id;
            const memberObj = {
                groupId,
                userId
            }
            console.log(event.target.parentElement);
            const response = await axios.delete(`${backendBaseUrl}/group/deleteMember`, {data: memberObj});
            const data = response.data;

            memberItems.removeChild(event.target.parentElement.parentElement);
            
        }
        catch(error) {
            console.log(error);
        }
    }
}

let groupChat = false;

groupItems.addEventListener('click', async (e) => { 
    e.preventDefault();
    groupChat = true;

    try {
        
        //if (groupChat) {
            if(e.target.tagName === 'LI') {
                const element = e.target;
                console.log(element);
                const groupId = element.id;
                currentGroupId = groupId;
    
                const response = await axios.get(`${backendBaseUrl}/group/getGroupById/${groupId}`, { headers: {'Authorization': token}});
                const data = response.data;
                console.log(data);
                const group = response.data.group;
                const users = response.data.users;
    
                memberItems.innerHTML = '';
                users.forEach(user => {
                    displayAllGroupMembers(group, user);
                });
    
                groupsContainer.style.display = 'none';
                groupSetting.style.display = 'block';
                memberContainer.style.display = 'block';
                groupForm.style.display = 'none';
                
                const userGroup = {
                    groupId
                }

                //if (groupChat) {
                    await something(userGroup);
    
                //     await postGroupChat(groupId);
                // }
    
                
                
            }
        }
        
    //}
    catch(error) {
        console.log(error);
    }
});



let groupsFlag = false;

showGroupsBtn.onclick = async (e) => {
    e.preventDefault();

    try {
        if (groupsContainer.style.display === 'none') {
            if (!groupsFlag) {
                await getGroups();
                groupsFlag = true;
            }
            memberContainer.style.display = 'none'
            groupsContainer.style.display = 'block';
            
        }
        else if (groupsContainer.style.display === 'block') {
            groupsContainer.style.display = 'none';
            memberContainer.style.display = 'block';
            groupForm.style.display = 'flex';
            groupSetting.style.display = 'none'
            
        }
    }
    catch(error) {
        console.log(error);
    }
}

async function getGroups() {
    try {
        const response = await axios.get(`${backendBaseUrl}/group/getUserGroups`, { headers: {'Authorization': token}});
            const data = response.data;
            console.log(data);

            groupItems.innerHTML = '';
            data.forEach(group => {
            displayGroups(group);
        });
    }
    catch(error) {
        console.log(error);
    }    
}

groupForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    try {
        const groupName = event.target.groupName.value;
        console.log(groupName);
        let groupDetails = {
            groupName
        }

        const response = await axios.post(`${backendBaseUrl}/group/postGroup`, groupDetails, { headers: {'Authorization': token}});
        const data = response.data;
        console.log(data);
        let userGroup = {
            groupId: data.id,
        }

        // const grpName = document.querySelector('#grpName');
        grpName.textContent = data.name;

        if (groupSetting.style.display === 'none') {
            groupSetting.style.display = 'block';
            groupForm.style.display = 'none';
        }

        await something(userGroup);

    }
    catch(error) {
        console.log(error);
    }
    event.target.reset();
});

async function something(userGroup) {
    memberForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        try {
            const member = e.target.selectMember.value;
            userGroup.memberName = member;
    
            // const response = await axios.post(`${backendBaseUrl}/group/postMember`, userGroup, { headers: {'Authorization': token}});
            // const data = response.data;
            // console.log(data);
            // displayGroupMembers(data);
            await postMember(userGroup);
        }
        catch(error) {
            console.log(error);
        }
        e.target.reset();
    });
}

async function postMember(userGroup) {
    const response = await axios.post(`${backendBaseUrl}/group/postMember`, userGroup, { headers: {'Authorization': token}});
    const data = response.data;
    console.log(data);
    displayGroupMembers(data);
}

function displayGroupMembers(obj) {
    const elementDiv = document.createElement('div');
    const element = document.createElement('li');
    element.className = 'member-item';
    element.id = obj.user.id;
    element.textContent = obj.user.username;

    // creating buttons
    const delBtn = document.createElement('button');
    delBtn.className = 'delMember';
    delBtn.textContent = 'delete';

    const adminBtn = document.createElement('button');
    adminBtn.className = 'adminMember';
    adminBtn.textContent = 'make-admin';

    element.appendChild(adminBtn);
    element.appendChild(delBtn);

    elementDiv.appendChild(element);
    memberItems.appendChild(elementDiv)
}

function displayGroups(obj) {
    const elementDiv = document.createElement('div');
    const element = document.createElement('li');
    element.className = 'group-item';
    element.id = obj.id;
    element.textContent = `Name : ${obj.name} | Creator : ${obj.creator}`;

    const delBtn = document.createElement('button');
    delBtn.className = 'delGroup';
    delBtn.textContent = 'delete';

    //appending
    element.appendChild(delBtn);
    elementDiv.appendChild(element);
    groupItems.appendChild(elementDiv);

    delBtn.onclick = async (e) => {
        e.preventDefault();
        try {
            const groupId = e.target.parentElement.id;
            const groupDetails = {
                groupId
            }
            const response = await axios.delete(`${backendBaseUrl}/group/deleteGroup`, { data: groupDetails});
            const data = response.data;
            groupItems.removeChild(e.target.parentElement.parentElement);
        }
        catch(error) {
            console.log(error);
        }
    }
}


// async function postGroupChat(groupId) {
    
        messageForm.addEventListener('submit',  async (e) => {
            e.preventDefault();
        
            try {
                console.log(groupChat)
                if (groupChat) {
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
        
            e.target.reset();
        });
    
    
// }







