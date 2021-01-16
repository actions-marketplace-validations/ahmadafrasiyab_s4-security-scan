# s4-scan-action
An action to run a scan using s4 each time a webhook event is fired. 

[![GitHub Release][ico-release]][link-github-release]
[![License][ico-license]](LICENSE)

A Github workflow action to call the remote S4 webhook endpoint with a JSON payload, and support for BASIC authentication. This action runs a scan based on the event that is configured in your workflow. The scan results are posted in a comment on the pull request. A link is generated to view the detailed results as well as shown:

![](s4-scan-action/src/results.png)

A hash signature is passed with each request, 
derived from the payload and a configurable secret token. The hash signature is 
identical to that which a regular Github webhook would generate, and sent in a header 
field named `X-Hub-Signature`. Therefore any existing Github webhook signature 
validation will continue to work. For more information on how to valiate the signature, 
see <https://docs.github.com/webhooks/securing/>.

By default, the values of the following GitHub workflow environment variables are sent in the 
payload: `GITHUB_REPOSITORY`, `GITHUB_REF`, `GITHUB_HEAD_REF`, `GITHUB_SHA`, `GITHUB_EVENT_NAME` 
and `GITHUB_WORKFLOW`. For more information on what is contained in these variables, see 
<https://help.github.com/en/actions/automating-your-workflow-with-github-actions/using-environment-variables>. 

These values map to the payload as follows:

```json
{
    "event": "GITHUB_EVENT_NAME",
    "repository": "GITHUB_REPOSITORY",
    "commit": "GITHUB_SHA",
    "ref": "GITHUB_REF",
    "head": "GITHUB_HEAD_REF",
    "workflow": "GITHUB_WORKFLOW"
}
```

If you are interested in receiving more comprehensive data about the GitHub event than just the 
above fields, then the action can be configured to send the whole JSON payload of the GitHub event, 
as per the `GITHUB_EVENT_PATH` variable in the environment variable documentation referenced above. 
The official documentation and reference for the payload itself can be found here: 
<https://developer.github.com/webhooks/event-payloads/>, and the details on how to configure it, 
is further down in the **Usage** section of this README.

Additional (custom) data can also be added/merged to the payload (see further down).


## Usage

The following are example snippets for a Github yaml workflow configuration. <br/>

Send the JSON (default) payload to a webhook:

```yml
 # This is a basic workflow that is manually triggered
name: learn-github-actions

# Controls when the action will run. Workflow runs when manually triggered using the UI or API.
on:
  # Trigger the workflow on push or pull request,
  # but only for the master branch
  pull_request:
    branches: master
    types: [labeled]

# A workflow run is made up of one or more jobs that can run sequentially or in parallel
jobs:
  s4_login:
      runs-on: ubuntu-latest
      steps:
        - name: Deploy Stage
          uses: owner/s4-scan-action@main
          with:
              timeout: 15000 
              loginUrl: ${{secrets.LOGIN_URL}}   
              payloadUrl: ${{secrets.WEBHOOK_URL}}
              webhookSecret: ${{secrets.WEBHOOK_SECRET}}
              username: ${{secrets.S4_USERNAME}}
              password: ${{secrets.S4_PASSWORD}}
              method: 'POST'
```

Will deliver a payload with the following properties:

```json
{
    "event": "push",
    "repository": "owner/project",
    "commit": "a636b6f0861bbee98039bf3df66ee13d8fbc9c74",
    "ref": "refs/heads/master",
    "head": "",
    "workflow": "Build and deploy"
}
```
<br/>

The sending of the whole GitHub payload
is only supported as JSON, and not currently available as urlencoded form parameters.

## Arguments

```yml 
  loginUrl: "https://your_login_url_for_basic_authentication"
```

*Required*. The HTTP URI of the login endpoint to invoke. The endpoint must accept 
an HTTP POST request. <br/><br/>


```yml 
  payloadUrl: "https://your_payloadUrl_for_receiving_the_sent_payload"
```

*Required*. The HTTP URI of the api endpoint for receiving the payload. <br/><br/>

```yml 
  webhookSecret: YOUR_WEBHOOK_SECRET
```
*Required*. The secret received from S4. This is used to authenticate the payload <br/><br/>

```yml 
  method: The HTTP method.
```
The HTTP method to be used. Only POST is supported at this point <br/><br/>

```yml 
  username: Your S4 username.
```
*Required*. Your S4 username for login <br/><br/>

```yml 
  password: Your S4 password.
```
*Required*. Your S4 password for login <br/><br/>

Credentials to be used for BASIC authentication against the endpoint.<br/><br/>


## License

The MIT License (MIT). Please see [License File](LICENSE) for more information.

[ico-release]: https://img.shields.io/github/tag/distributhor/workflow-webhook.svg
[ico-license]: https://img.shields.io/badge/license-MIT-brightgreen.svg
[link-github-release]: https://github.com/distributhor/workflow-webhook/releases
