import {Identity, IdentityRef, Session, TransactorFeesResponse} from "mysterium-vpn-js";
import {Config} from "mysterium-vpn-js/lib/config/config";

export interface BasicResponseInterface {
  success: boolean,
  isAuthoriseError: boolean,
  isRequestFail: boolean
  errorMessage?: string
}

export interface CurrentIdentityResponseInterface extends BasicResponseInterface {
  identityRef: IdentityRef
}

export interface CreateNewIdentityResponseInterface extends BasicResponseInterface {
  identityRef: IdentityRef
}

export interface IdentityListResponseInterface extends BasicResponseInterface {
  identityRef: IdentityRef[]
}

export interface TransactionsFeesResponseInterface extends BasicResponseInterface {
  transactorFeesResponse: TransactorFeesResponse
}

export interface UserConfigResponseInterface extends BasicResponseInterface {
  userConfig: Config
}

export interface IdentityResponseInterface extends BasicResponseInterface{
  identity: Identity
}

export interface SessionsInterface extends BasicResponseInterface {
  sessions: Session[]
}