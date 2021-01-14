const core = require('@actions/core');
const github = require('@actions/github');
const axios = require('axios');

try {  
  
  //acquiring allrelevant inforamtion for posting request.
  const email = core.getInput('username');

  const password = core.getInput('password');

  const loginUrl = core.getInput('loginUrl');

  const payloadUrl = core.getInput('payloadUrl');

  const webhookSecret = core.getInput('webhookSecret');

  console.log(email);
  console.log(password);
  console.log(loginUrl);
  console.log(payloadUrl);
  console.log(webhookSecret);

  const payload = JSON.stringify(github.context.payload, undefined, 2)
  console.log(`The event payload: ${payload}`);

  var body = {
    email: email,
    password: password
  }

  axios.post(loginUrl, body).then((resp) => {
    console.log('inside post');
    console.log(resp);
    
  })
  .catch((err)=> {
    console.log(err);
  })

  


  // const payloadUrl = core.getInput('password');
  // console.log(`Hello ${password}!`);

  // const url = (new Date()).toTimeString();
  // core.setOutput("time", time);
  // // Get the JSON webhook payload for the event that triggered the workflow
  // const payload = JSON.stringify(github.context.payload, undefined, 2)
  // console.log(`The event payload: ${payload}`);
} catch (error) {
  core.setFailed(error.message);
}