import { tequilapiClient } from './TequilApiClient'
import { TequilapiError } from 'mysterium-vpn-js/lib/tequilapi-error'

export const authChangePassword = async (data: { username: string, oldPassword: string, newPassword: string }): Promise<any> => {
  const { newPassword, oldPassword, username } = data
  try {
    await tequilapiClient.authChangePassword(username, oldPassword, newPassword)
  } catch (e) {
    console.log(e.isUnauthorizedError ? 'Authorization failed!' : e.message);
  }
};

export const authLogin = async (data: { username: string, password: string }): Promise<any> => {
  const { password, username } = data;
  try {
    await tequilapiClient.authLogin(username, password);
  } catch (e) {
    console.log(e.isUnauthorizedError ? 'Authorization failed!' : e.message);
  }
};

export  const getidentityList = () =>{
  tequilapiClient.identityList().then((identities) => {
    console.log(identities);
  });
};
