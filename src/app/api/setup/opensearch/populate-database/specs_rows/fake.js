// Function to generate a random year between 1998 and 2025
export function getRandomYear() {
    return Math.floor(Math.random() * (2025 - 1998 + 1)) + 1998;
  }
  
  // Function to generate a random string from 'abcdefghijlkm'
  export function getRandomText() {
    const chars = 'abcdefghijlkm'; // Set of characters to choose from
    let result = '';
    const length = 5; // Length of the random string
  
    // Generate a random string of the specified length
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * chars.length);
      result += chars[randomIndex];
    }
    
    return result;
  }
  
  // Function to capitalize the first letter of a string
  export function capitalizeFirstLetter(str) {
    if (typeof str !== 'string' || str.trim() === '') {
      return ''; // Return empty string if input is not a valid string
    }
    return str.charAt(0).toUpperCase() + str.slice(1); // Capitalize first letter
  }
  
  // Function to generate a single row dynamically based on a set of keys
  export function generateRow() {
    const keys = ['year', 'make', 'model', 'engine', 'drive']; // Keys that we will iterate over
    const row = {};
  
    // Loop through each key to generate values dynamically
    keys.forEach((key) => {
      let value = key === 'year' ? getRandomYear() : getRandomText(); // Year is handled differently
      
      // Ensure that the value is a string
      if (typeof value !== 'string') {
        value = String(value); // Force conversion to string
      }
      
      // Assign the generated values for each field
      row[key] = {
        value_key: value,
        value_label: capitalizeFirstLetter(value), // Capitalize the first letter of the value
      };
    });

    // Create a hash from the values dynamically, ensuring order
    const hash = keys.map((key) => row[key].value_key).join('-').toLowerCase();
    
    return {
      store_hash: "bohaxauo", // Fixed store_hash value
      row: {
        ...row, // Add dynamic row properties
        hash: hash, // Add the hash dynamically generated
      },
    };

  }
  