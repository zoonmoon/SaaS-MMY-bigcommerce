export const sanitizeString = (input) => input
.replace(/\s+/g, '-')        // replace spaces with dashes
.replace(/[^a-zA-Z0-9-]/g, '') // remove everything except alphanumerics and dashes
.toLowerCase();                  // Convert to lowercase
