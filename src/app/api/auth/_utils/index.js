import { cookies } from "next/headers";
import openSearchClient from "../../_lib/opensearch";
import { generateToken } from "../../_lib/session";

const bcrypt = require('bcrypt');

// Check if user exists by email or username
export async function userExists( email, username ) {



    const result = await  openSearchClient.search({
      index:'users',
      body: {
        query: {
          bool: {
            should: [
              { term: { username } }
            ]
          }
        }
      }
    });
    


    return result.body.hits.total.value > 0;


  }

// Create a new user
export async function createUser( username, password ) {
    try {
      const exists = await userExists( '', username );
  
      if (exists) {
        return { success: false, message: 'User already exists' };
      }
  
      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10); // 10 = salt rounds
  
      // Save user to OpenSearch
      const result = await openSearchClient.index({
        index:'users',
        body: {
          username,
          name: '',
          email: '',
          password: hashedPassword
        },
        refresh: true // make it searchable immediately
      });
  
      return { success: true, message: 'User created', data: result.body };
  
    } catch (error) {
      console.error('Create user error:', error);
      return { success: false, message: 'Internal error' };
    }
  }

// Function to check if the user exists by username and verify the password
export async function checkUsernamePassword( username, password ) {
    try {
      // 1. Search for the user by username (or email if needed)
      const result = await openSearchClient.search({
        index:'users',
        body: {
          query: {
            term: { username: username } // Or you can search by email here as well
          }
        }
      });
  
      if (result.body.hits.total.value === 0) {
        // User does not exist
        return { success: false, message: 'User not found' };
      }
  
      const user = result.body.hits.hits[0]._source; // User data from OpenSearch
  
      // 2. Compare the password with the hashed password stored in OpenSearch
      const isMatch = await bcrypt.compare(password, user.password);
  
      if (!isMatch) {
        // Password does not match
        return { success: false, message: 'Invalid password' };
      }
  
      // If username and password match
      return { success: true, message: 'Login successful' };
  
    } catch (error) {
      console.error('Error checking username and password:', error);
      return { success: false, message: 'Internal server error' };
    }
  }
  

  export function loginUser(username){

    return setToken(username)

  }

 export  function setToken(username){

    const token = generateToken(username)
    
    cookies().set('token', token)
    
    return true
}