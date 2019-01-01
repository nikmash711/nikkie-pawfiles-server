'use strict'; 

module.exports = {
  CLIENT_ORIGIN: process.env.CLIENT_ORIGIN || 'http://localhost:3000',
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/pawfile-throwaway',
  PORT: process.env.PORT || 8080,
};
