import { Request } from "express"

export interface Login{
    emailOrPhoneNumber : string , password :string , FCMToken : string
}
export interface Payload{
    id : string , role :string 
}

export interface MiddlewareInterface extends Request {
    user?: Payload // or any other type
  }