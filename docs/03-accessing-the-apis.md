# Accessing the APIs

> Source: [https://api.sproutsocial.com/docs/#accessing-the-apis](https://api.sproutsocial.com/docs/#accessing-the-apis)

### Pre-requisites

- **Plan**: Your account needs to be on the **appropriate plan** which enables API access. If you are unsure, please contact your sales representative or contact support.
- **Permissions**: Users need to have the **API Permissions** permission in order to manage the configurations for API access. If you are unsure, please contact your sales representative or contact support.
![Reference image: Sprout Social API Permissions settings page](https://api.sproutsocial.com/docs/static/8391b014b742c0df6607090e40742c8d/a76f4/settings-api-permissions.png)
- **Terms of Service**: If you haven't already done so, accept **Sprout’s Analytics API Terms of Service**. To do so,

1. Log in to Sprout
2. Navigate to the [Settings > Global Features > API Page](https://app.sproutsocial.com/settings/analytics-api/).
3. Accept Sprout’s Analytics API Terms of Service.

Once you have completed the pre-requisites, Sprout supports 2 ways to make authenticated API requests:

- [Using OAuth 2.0](https://api.sproutsocial.com/docs/#using-oauth-20) **(Recommended)**

- [Using API Tokens](https://api.sproutsocial.com/docs/#using-api-tokens)


### Using OAuth 2.0

Sprout's API support [OAuth 2.0](https://datatracker.ietf.org/doc/html/rfc6749) to access the API. With this method, Sprout will issue short lived credentials i.e. JSON Web Token (JWT) access tokens, which should be used to authenticate with Sprout's APIs.

#### OAuth Client Management

To view & manage OAuth client configurations,

- Log in to Sprout

- Navigate to the [Settings > Global Features > API Page](https://app.sproutsocial.com/settings/analytics-api/).

![Reference image: Sprout Social API Tokens settings page](https://api.sproutsocial.com/docs/static/aa6894aed1a8f504d44815530b259f72/6f3f2/settings-api-tokens.png)

- Navigate to **OAuth Client Management** section.

[![Reference image: OAuth Client Management configuration list](https://api.sproutsocial.com/docs/static/851c91e290035e1c779ced598efc1605/fcda8/settings-list-oauth-configs.png)](https://api.sproutsocial.com/docs/static/851c91e290035e1c779ced598efc1605/5440e/settings-list-oauth-configs.png)

- Here you will be able to view and manage previously created OAuth client configurations.


#### Creating OAuth Client Configuration

Sprout supports the following authentication methods,

- **Machine-to-machine authentication (recommended)**: Use this when you are integrating with Sprout's APIs via a custom integration or via Sprout native integration offered by our partners asking you for Client ID & Client Secret.

- **User-based authentication**: Use this when you are integrating with Sprout’s APIs and want to access data on behalf of a user. Recommended if you intend to build a custom application integration requiring users to login with Sprout.


To create a new OAuth client configuration,

- Log in to Sprout

- Navigate to the [Settings > Global Features > API Page](https://app.sproutsocial.com/settings/analytics-api/).

![Reference image: Sprout Social API Tokens settings page](https://api.sproutsocial.com/docs/static/aa6894aed1a8f504d44815530b259f72/6f3f2/settings-api-tokens.png)

- Navigate to **OAuth Client Management** section.

[![Reference image: OAuth Client Management configuration list](https://api.sproutsocial.com/docs/static/851c91e290035e1c779ced598efc1605/fcda8/settings-list-oauth-configs.png)](https://api.sproutsocial.com/docs/static/851c91e290035e1c779ced598efc1605/5440e/settings-list-oauth-configs.png)

- Click **Generate configuration** in the upper right corner.

- Select the authentication method e.g. Machine-to-machine authentication

![Reference image: Generate Machine-to-Machine OAuth configuration](https://api.sproutsocial.com/docs/static/9a516e47ecaed6ffdf07c8f1d6bc3d94/b6272/settings-generate-m2m-config.png)

- Enter the name for your client along with a description.

- **(Optionally)** If you selected User-based authentication, you will need to provide the list of allowed redirect URIs.

[![Reference image: Generate User-based OAuth configuration with redirect URIs](https://api.sproutsocial.com/docs/static/7b89ffcde4098c9a2ad77b90a21d78b3/fcda8/settings-generate-native.png)](https://api.sproutsocial.com/docs/static/7b89ffcde4098c9a2ad77b90a21d78b3/3dd3e/settings-generate-native.png)

- Save the configuration!

- Retrieve the client id and secret, by navigating the OAuth Client Management section and copy the client id and secret. **Be sure to store these securely!**

[![Reference image: OAuth Client Management configuration list](https://api.sproutsocial.com/docs/static/851c91e290035e1c779ced598efc1605/fcda8/settings-list-oauth-configs.png)](https://api.sproutsocial.com/docs/static/851c91e290035e1c779ced598efc1605/5440e/settings-list-oauth-configs.png)


#### Obtaining JSON Web Token (JWT) Access Token

To obtain JSON Web Token (JWT) access token from Sprout, you will integrate with Sprout's Authorization Server

- Authorization Server URL: [https://identity.sproutsocial.com/oauth2/84e39c75-d770-45d9-90a9-7b79e3037d2c/.well-known/oauth-authorization-server](https://identity.sproutsocial.com/oauth2/84e39c75-d770-45d9-90a9-7b79e3037d2c/.well-known/oauth-authorization-server)

For machine-to-machine authentication method, to retrive a token, you will use the client id & secret and make a call to the token api e.g.

```
curl --location 'https://identity.sproutsocial.com/oauth2/84e39c75-d770-45d9-90a9-7b79e3037d2c/v1/token' \
--header 'Content-Type: application/x-www-form-urlencoded' \
--data-urlencode 'client_id=<paste_your_client_id_here>' \
--data-urlencode 'client_secret=<paste_your_client_secret_here>' \
--data-urlencode 'grant_type=client_credentials' \
--data-urlencode 'scope=organization_id'
```

For user-based authentication, you will use the,

- OAuth client configuration that you generated in the previous step
- Authorization Endpoint & Token Endpoint listed on the [Authorization Server](https://identity.sproutsocial.com/oauth2/84e39c75-d770-45d9-90a9-7b79e3037d2c/.well-known/oauth-authorization-server)
- Integrate into your custom application requiring users to login with Sprout.

### Using API Tokens

Any user with the API Permissions permission can create new API tokens via the API Tokens settings page. They can also view or invalidate existing tokens (i.e. prevent the tokens from being used for client requests).

- Log in to Sprout

- Navigate to the [Settings > Global Features > API Page](https://app.sproutsocial.com/settings/analytics-api/).

![Reference image: Sprout Social API Tokens settings page](https://api.sproutsocial.com/docs/static/aa6894aed1a8f504d44815530b259f72/6f3f2/settings-api-tokens.png)

- Click **Generate API Token** in the **API Token Management** section.


[![Reference image: Create API Token dialog](https://api.sproutsocial.com/docs/static/646f80087f6c2f463136c0c4d07ef70f/fcda8/create-api-token.png)](https://api.sproutsocial.com/docs/static/646f80087f6c2f463136c0c4d07ef70f/de766/create-api-token.png)

4. Enter a name for your token.

![Reference image: Name your API token dialog](https://api.sproutsocial.com/docs/static/fb697aaba603b69a623bb1112bf9cb49/01e7c/name-token.png)

5. Copy the token for use. **Be sure to store these securely!**

### X Data: X Content End User License Agreement

**Note: X has additional compliance requirements around exposing data through the API. You’re required to review and accept the Sprout API X Content End User License Agreement before you can access X's data through the Sprout API.**

Unless X does not approve your specific use case, any Sprout user with the API Permissions permission will need to accept the Sprout API X Content End User License Agreement to access X’s data. This appears at the top of the API page under Global Features in Settings.

[![Reference image: X Content End User License Agreement acceptance](https://api.sproutsocial.com/docs/static/c5902147f07d3f161b96f06797003def/fcda8/x-eula.png)](https://api.sproutsocial.com/docs/static/c5902147f07d3f161b96f06797003def/29007/x-eula.png)
