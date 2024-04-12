// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

const WickrIOAPI = require('wickrio_addon');
const WickrIOBotAPI = require('wickrio-bot-api');
const util = require('util')
const logger = require('wickrio-bot-api').logger
const { v4: uuidv4 } = require('uuid');
const {execSync} = require('child_process');


console.log = function () {
  logger.info(util.format.apply(null, arguments))
}
console.error = function () {
  logger.error(util.format.apply(null, arguments))
}

var fs = require('fs');
const { message } = require('prompt');

module.exports = WickrIOAPI;
process.stdin.resume(); // so the program will not close instantly
var bot;

let fileName = uuidv4();

async function exitHandler(options, err) {
  try {
    var closed = await bot.close();
    console.log(closed);
    if (err) {
      console.log("Exit Error:", err);
      process.exit();
    }
    if (options.exit) {
      process.exit();
    } else if (options.pid) {
      process.kill(process.pid);
    }
  } catch (err) {
    console.log(err);
  }
}

//catches ctrl+c and stop.sh events
process.on('SIGINT', exitHandler.bind(null, {
  exit: true
}));

// catches "kill pid" (for example: nodemon restart)
process.on('SIGUSR1', exitHandler.bind(null, {
  pid: true
}));
process.on('SIGUSR2', exitHandler.bind(null, {
  pid: true
}));

//catches uncaught exceptions
process.on('uncaughtException', exitHandler.bind(null, {
  exit: true
}));

/////////////////////////////////////

// Respond to user's input.
async function createResponse(message, vGroupID) {
  // setup the clients
  bot.processesJsonToProcessEnv()

  console.log('entered createResponse');

  async function testSh() {
  const test = execSync(`./llm.sh \"${message}\"`, {
    cwd: '/home/wickriouser/ggllm/ggllm.cpp/build/bin'
});
  console.log(test);
WickrIOAPI.cmdSendRoomMessage(vGroupID, test);
  }  
testSh()
}


async function main() { // entry point
  logger.info('entering main')
  try {
    var status;
    if (process.argv[2] === undefined) {
      var bot_username = fs.readFileSync('client_bot_username.txt', 'utf-8');
      bot_username = bot_username.trim();
      bot = new WickrIOBotAPI.WickrIOBot();
      status = await bot.start(bot_username)
    } else {
      bot = new WickrIOBotAPI.WickrIOBot();
      status = await bot.start(process.argv[2])
    }
    if (!status) {
      exitHandler(null, {
        exit: true,
        reason: 'Client not able to start'
      });
    }

    await bot.startListening(listen); 
  } catch (err) {
    logger.error(err);
  }
}

async function listen(rMessage) {
  logger.info('entering listen')
  rMessage = JSON.parse(rMessage);
  var sender = rMessage.sender;
  var vGroupID = rMessage.vgroupid;
  var userArr = [];
  userArr.push(sender);
  if (rMessage.message) {
    var request = rMessage.message;

    console.log('calling createResponse()')
    await createResponse(request, vGroupID)
  }
}

main();