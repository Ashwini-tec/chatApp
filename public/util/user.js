const moment = require('moment');

const users =[];

const userJoin =(id ,userName , room )=>{
    if(userName && room)
    {
        let user = { id , userName , room };
        users.push(user);
        return user ;
    }
}

const formatMessage = (userName, text)=> {
    return {
      userName,
      text,
      time: moment().format('h:mm a')
    };
  }
  
  // User leaves chat
  const userLeave = (id) => {
    const index = users.findIndex(user => user.id === id);
  
    if (index !== -1) {
      return users.splice(index, 1)[0];
    }
  }
  
  // Get room users
  const getRoomUsers = (room)=> {
    return users.filter(user => user.room === room);
  }

const getUserDetail= (id)=>{
    return users.find(user => user.id === id);
}

module.exports ={
    userJoin,
    getUserDetail,
    formatMessage,
    userLeave,
    getRoomUsers
}