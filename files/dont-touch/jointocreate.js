const jointocreatemap = new Map();
const { partnermanagerrole } = require("../config/constants/roles.json")
const { jointocreatechannel, jointocreatecategory } = require("../config/constants/channel.json")
const { serverID } = require("../config/constants/channel.json")

module.exports = function (client) {
    const description = {
        name: "jointocreate",
        filename: "jointocreate.js",
    }
     //just checks a few things
  new Promise(resolve => {
    setInterval(() => {
      resolve(2);
        try{
          const guild = client.guilds.cache.get(serverID);
          const channels = guild.channels.cache.map(ch => ch.id)
          for (let i = 0; i < channels.length; i++) {
            const key = `tempvoicechannel_${guild.id}_${channels[i]}`;
            if (jointocreatemap.get(key)) {
              var vc = guild.channels.cache.get(jointocreatemap.get(key));
              if (vc.members.size < 1) {
                jointocreatemap.delete(key);
                return vc.delete();
              } else {}
            }
          }
      }catch{}
    }, 10000)
  })

    
//log that the module is loaded
//voice state update event to check joining/leaving channels
  client.on("voiceStateUpdate", (oldState, newState) => {
  //ignore but dont delete
  let oldparentname = "unknown"
  let oldchannelname = "unknown"
  let oldchanelid = "unknown"
  if (oldState && oldState.channel && oldState.channel.parent && oldState.channel.parent.name) oldparentname = oldState.channel.parent.name
  if (oldState && oldState.channel && oldState.channel.name) oldchannelname = oldState.channel.name
  if (oldState && oldState.channelID) oldchanelid = oldState.channelID
  let newparentname = "unknown"
  let newchannelname = "unknown"
  let newchanelid = "unknown"
  if (newState && newState.channel && newState.channel.parent && newState.channel.parent.name) newparentname = newState.channel.parent.name
  if (newState && newState.channel && newState.channel.name) newchannelname = newState.channel.name
  if (newState && newState.channelID) newchanelid = newState.channelID
  if (oldState.channelID) {
      if (typeof oldState.channel.parent !== "undefined")  oldChannelName = `${oldparentname}\n\t**${oldchannelname}**\n*${oldchanelid}*`
       else  oldChannelName = `-\n\t**${oldparentname}**\n*${oldchanelid}*`
  }
  if (newState.channelID) {
      if (typeof newState.channel.parent !== "undefined") newChannelName = `${newparentname}\n\t**${newchannelname}**\n*${newchanelid}*`
      else newChannelName = `-\n\t**${newchannelname}**\n*${newchanelid}*`
  }
  if (!oldState.channelID && newState.channelID) {
    if(newState.channelID !== jointocreatechannel) return;  //if its not the jointocreatechannel skip
    jointocreatechannel(newState);   //load the function
  }
  if (oldState.channelID && !newState.channelID) {
            //get the jointocreatechannel id from the map
          if (jointocreatemap.get(`tempvoicechannel_${oldState.guild.id}_${oldState.channelID}`)) {
            //fetch it from the guild
            var vc = oldState.guild.channels.cache.get(jointocreatemap.get(`tempvoicechannel_${oldState.guild.id}_${oldState.channelID}`));
            //if the channel size is below one
            if (vc.members.size < 1) { 
              //delete it from the map
              jointocreatemap.delete(`tempvoicechannel_${oldState.guild.id}_${oldState.channelID}`); 
              //log that it is deleted
              //delete the voice channel
              return vc.delete(); 
          }
            else {
            }
          }
  }
  // Switch v12
  if (oldState.channelID && newState.channelID) {
  
    if (oldState.channelID !== newState.channelID) {
      //if its the join to create channel
      if(newState.channelID === jointocreatechannel) 
      //make a new channel
      jointocreatechannel(oldState);  
      //BUT if its also a channel ín the map (temp voice channel)
      if (jointocreatemap.get(`tempvoicechannel_${oldState.guild.id}_${oldState.channelID}`)) {
        //fetch the channel
        var vc = oldState.guild.channels.cache.get(jointocreatemap.get(`tempvoicechannel_${oldState.guild.id}_${oldState.channelID}`));
        //if the size is under 1
        if (vc.members.size < 1) { 
          //delete it from the map
          jointocreatemap.delete(`tempvoicechannel_${oldState.guild.id}_${oldState.channelID}`); 
         //log it 
        //delete the room
          return vc.delete(); 
      }
      else {
      }
      }
    }
}
  })
    async function jointocreatechannel(user) {
      //log it 
      //user.member.user.send("This can be used to message the member that a new room was created")
      await user.guild.channels.create(`${user.member.user.username}'s room`, {
        type: 'voice',
        parent: jointocreatecategory, //or set it as a category id
				userLimit: 14 //lock to 14 users only
      }).then(async vc => {
        //move user to the new channel
        user.setChannel(vc);
        //set the new channel to the map
        jointocreatemap.set(`tempvoicechannel_${vc.guild.id}_${vc.id}`, vc.id);
        //change the permissions of the channel
        await vc.overwritePermissions([
          {
            id: user.id,
            allow: ['MANAGE_CHANNELS'],
          },
          {
            id: user.guild.id,
            allow: ['VIEW_CHANNEL'],
          },
        ]);
      })
    }
}
