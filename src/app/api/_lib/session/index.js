const bcrypt = require('bcrypt');
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers'

export  function generateRandomString(length=20) {
    const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

export async function hashPassword(password) {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
}

export async function comparePassword(plainPassword, hash){
  return  await bcrypt.compare(plainPassword, hash);
}

export function generateToken(username) {
  const secretKey = 'your_secret_key'; // Replace this with your own secret key
  const payload = { username };
  return jwt.sign(payload, secretKey);
}


export async function getLoggedInUsername(){

  const cookieStore = await cookies()
  
  const token = cookieStore.get('token')
  
  if(token === '' || token === null || token === undefined || token.value === undefined){
    return {token_exists: false, username: null}
  }

  const parts = token.value.split('.');

  const header = JSON.parse(atob(parts[0]));
  
  const payload = JSON.parse(atob(parts[1]));
  
  if(payload && payload.username !== undefined ){
    return {token_exists: true, username: payload.username}
  }else{
    return {token_exists: false, username: null}
  }
  
}