import UAuth from '@uauth/js'
import verifyLogin from './verifyLogin'

const uauth = new UAuth({
  clientID: "3c7cb925-c556-4c7e-9cd7-4526466a8aff",
  clientSecret: "ehUX_o6U20eZrMcbVlJI0SZ8eg",
  clientAuthMethod: "client_secret_post",
  redirectUri: "http://localhost:5001",
  scope: "openid wallet email"

})

window.login = async () => {
  try {
    const authorization = await uauth.loginWithPopup()
    const valid = await verifyLogin(authorization, uauth.fallbackLoginOptions.clientID)
    if (valid) {
      console.log(authorization.idToken.sub)
      console.log(authorization.idToken.wallet_address)
    }
  } catch (error) {
    console.error(error)
  }
}

window.logout = async () => {
  await uauth.logout()
  console.log('Logged out with Unstoppable')
}
  // yarn add --dev parcel
  // yarn parcel --open --port 5001 index.html
