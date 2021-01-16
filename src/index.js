const core = require('@actions/core');
const github = require('@actions/github');
const axios = require('axios');
const crypto = require('crypto');

try {  
  
  //acquiring allrelevant inforamtion for posting request.
  const email = core.getInput('username');

  const password = core.getInput('password');

  const loginUrl = core.getInput('loginUrl');

  const payloadUrl = core.getInput('payloadUrl');

  const webhookSecret = core.getInput('webhookSecret');

  var payload = JSON.stringify(github.context.payload, undefined, 2)
  payload = JSON.parse(payload);
  payload.email = email;

  const hmac = crypto.createHmac('sha1', webhookSecret);
  const self_signature = hmac.update(JSON.stringify(payload)).digest('hex');

  var options = {
    headers: {
      'x-hub-signature': 'sha1='+self_signature
    }

  }

  var body = {
    email: email,
    password: password
  }

  axios.post(loginUrl, body).then((resp) => {
    if (resp.data.auth == true) {
    console.log(resp.data.message);
    }else 
    {
      //console.log(res.data.message);
      core.setFailed(resp.data.message);
      //process.exit(1);
    }

    axios.post(payloadUrl, payload, options).then((resps) => {
    if(resps.status == 200) {
      if(resps.data.isVuln == false) {
        console.log(resps.data.message);
      }
      else {
        console.log(resps.data.message);
        core.setFailed(resps.data.message);
        //process.exit(1);
      }
    }else {
        core.setFailed(resps.data.message);
    }
    }).catch((err) => {
        if (err.response) {
          // Request made and server responded
          console.log("inside err.response");
          console.log(err.response.data);
          core.setFailed(err.response.data);
        } else if (err.request) {
          console.log("inside err.request");
          // The request was made but no response was received
          console.log(err.request);
          core.setFailed(err.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log('Error', err.message);
          core.setFailed(err.message);
        }
    })
  })
  .catch((err)=> {
    console.log(err);
    core.setFailed(err);
  })
}
catch (error) {
  core.setFailed(error.message);
}
