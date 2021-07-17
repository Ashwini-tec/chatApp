
const form = document.getElementById('chat-form');
const roomName = document.getElementById('room-name'); 
const user = document.getElementById('users'); 
const chatMessages = document.querySelector('.chat-messages');
const userList = document.getElementById('users');

// Get username and room from URL
const { userName, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true,
  });
  

var socket = io();

socket.emit('joinUser',{ userName , room })


socket.on('message', (msg)=>{
    outputMessage(msg);
})

// take the responce from the user 
form.addEventListener('submit',(e)=>{
    e.preventDefault();

    let msg = e.target.elements.input.value;

    msg = msg.trim();

  if (!msg) {
    return false;
  }

    socket.emit('chat massage' ,msg);

    e.target.elements.input.value="";  
    e.target.elements.input.focus();  
})

// register the  user and thge room to the UI
socket.on('roomUsers' , ({room , users})=>{
    outputRoomName(room);
    outputUsers(users)
  });

// Output message to DOM
const outputMessage=(message)=> {
    const div = document.createElement('div');
    div.classList.add('message');
    const p = document.createElement('p');
    p.classList.add('meta');
    p.innerText = message.userName+" ";
    p.innerHTML += `<span>${message.time}</span>`;
    div.appendChild(p);
    const para = document.createElement('p');
    para.classList.add('text');
    para.innerText = message.text;
    div.appendChild(para);
    document.querySelector('.chat-messages').appendChild(div);
  }
  
  
  
  
  // Add room name to DOM
  const outputRoomName=(room)=> {
    roomName.innerText = room;
  }
  
  // Add users to DOM
  const outputUsers=(users)=> {
    userList.innerHTML = '';
    users.forEach((user) => {
      const li = document.createElement('li');
      li.innerText = user.userName;
      userList.appendChild(li);
    });
  }
  
  //Prompt the user before leave chat room
  document.getElementById('leave-btn').addEventListener('click', () => {
    const leaveRoom = confirm('Are you sure you want to leave the chatroom?');
    if (leaveRoom) {
      window.location = '../index.html';
    } else {
    }
  });