
# UAuth Secondary Validation

This example app provides a guideline on how to run a secondary validation on an Unstoppable Domains Login. The idea would be to run verifyLogin.js on your backend to defend against MitM.

### Install 
**NPM**
`npm install`

**Yarn**
`yarn install`

## Login Options

Follow the [Login Client Congifuration Docs](https://docs.unstoppabledomains.com/login-with-unstoppable/login-integration-guides/login-client-configuration/) on the Unstoppable Domains website to get setup with your clientID and redirectUri. 
**Note:** The Redirection URI value(s) in the client configuration MUST exactly match the redirect_uri parameter value used in `UauthInitOptions`. More specifics can be found in the [Rules for Redirect URIs Docs](https://docs.unstoppabledomains.com/login-with-unstoppable/login-integration-guides/login-client-configuration/#rules-for-redirect-uris).

```javascript
UauthInitOptions = {
  clientID: string // required and will throw an error if not included: links dapp to Unstoppable Domains for customization
  redirectUri: string // required and will throw an error if not included: used for pop-up and callback redirection
  scope: string // requires 'openid wallet' at minimum
}
```

## Usage

```javascript
import UAuth from '@uauth/js'
import verifyLogin from './verifyLogin'

UauthInitOptions = {
	clientID: "YOUR_CLIENT_ID",
	redirectUri: "YOUR_REDIRECT_URI",
	scope: "YOUR_SCOPES"
}

const uauth = new UAuth(UauthInitOptions)

window.login = async () => {
	try {
		const authorization = await uauth.loginWithPopup()
		console.log(authorization.idToken.sub)
		console.log(authorization.idToken.wallet_address)
	} catch (error) {
		console.error(error)
	}
}

window.logout = async () => {
	await uauth.logout()
	console.log('Logged out with Unstoppable')
}
```

**Running the Script**
`yarn add --dev parcel`
`yarn parcel --open --port 5001 index.html`

### Verifying the login

When the Unstoppable Domains object has been sent to the backend, you can pass it, along with the clientID used in `UauthInitOptions` , to the `verifyLogin` function contained in `verifyLogin.js`. This function will create a new JWT session using Unstoppable's openID configuration and compare the accessToken contained in the authorization object and what is stored in Unstoppables config. Note that this comparison needs to be done immediately as the access tokens do expire.

The `verifyLogin` function will also check if a domain has transferred owners. This will only work if you have an accessible key:value database of domain_name:wallet_address. If this isn't of concern, this step can be disregarded in the verification.

```javascript
import verifyLogin from './verifyLogin'

const valid = await verifyLogin(authorization, uauth.fallbackLoginOptions.clientID)
if (valid) {
	console.log(authorization.idToken.sub)
	console.log(authorization.idToken.wallet_address)
}
```

