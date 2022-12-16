const xapi = require('xapi');
const ui = require('./ui');

// Variables
var ThePin = "";


function askForPin2(text = 'Enter PIN code') {
  xapi.Event.UserInterface.Message.TextInput.Response.on((event) => {
   if (event.FeedbackId === 'system-name') {
    xapi.Config.SystemUnit.Name.set(event.Text);
    
    ThePin = event.Text;
    console.log(ThePin);
    xapi.command('Standby Halfwake');
   }
  });

  xapi.Command.UserInterface.Message.TextInput.Display({
    FeedbackId: 'system-name',
    Title: 'Valider les chiffres de votre PIN code',
    Text: 'Il vous sera utile pour déverouiller votre système vidéo',
  });
}


function askForPin(text = 'Enter PIN code') {
  xapi.command('UserInterface Message TextInput Display', {
    FeedbackId: 'pin-code',
    Text: text,
    InputType: 'PIN',
    Placeholder: ' ',
    Duration: 0,
  });
}

function onResponse(code) {
  console.log('try pin', code);
  if (code === ThePin)
  {
    console.log('pin correct');
  }
  else {
    console.log('pin failed');
    askForPin('Incorrect PIN, try again');
  }
}

function listenToEvents() {
  xapi.event.on('UserInterface Message TextInput Response', (event) => {
    if (event.FeedbackId === 'pin-code')
      onResponse(event.Text);
  });
  xapi.event.on('UserInterface Message TextInput Clear', (event) => {
    if (event.FeedbackId === 'pin-code') {
      xapi.command('Standby Halfwake');
    }
  });
  xapi.status.on('Standby State', (state) => {
    if (state === 'Off') askForPin();
  });
}


function listenToGui() {

  xapi.Event.UserInterface.Extensions.Panel.Clicked.on((event) => {
    if (event.PanelId == 'Lock') {
      askForPin2();
    }});
}    

listenToGui();
listenToEvents();