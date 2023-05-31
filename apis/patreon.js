/**
 * Environment Variables
 */
import * as dotenv from "dotenv";
dotenv.config();

import Token from "../models/Token.js";
import request from "request";
import async from "async";

// www.patreon.com/oauth2/authorize?response_type=code&client_id=1rv0lIpRtuuxETnfpl0NfQTqcY7iHGJ_r7uWGB6cNXQYh8VfhySFzZW-nTxeX0VQ&redirect_uri=https://carbine.co

const patreonClientId = process.env.PATREONCLIENTID,
  patreonClientSecret = process.env.PATREONCLIENTSECRET,
  patreonOneTimeCode = process.env.PATREONONETIMECODE;

const saveAndReturnPatreonToken = (
  access_token,
  refresh_token,
  expires_in,
  callback,
  mainCallback
) => {
  // create new expiration date
  let expires = new Date(),
    days = expires_in / 60 / 60 / 24;

  expires.setDate(expires.getDate() + days);

  Token.findOneAndUpdate(
    {
      name: "patreon",
    },
    {
      $set: {
        access_token,
        refresh_token,
        expires,
      },
    },
    {
      upsert: true,
      new: true,
    }
  ).exec((err, token) => {
    if (err) {
      callback(err);
    } else {
      mainCallback(null, token.access_token);
    }
  });
};

const generateNewPatreonToken = (callback, mainCallback) => {
  request.post(
    {
      url:
        "https://www.patreon.com/api/oauth2/token?code=" +
        patreonOneTimeCode +
        "&grant_type=authorization_code&client_id=" +
        patreonClientId +
        "&client_secret=" +
        patreonClientSecret +
        "&redirect_uri=https://carbine.co",
      headers: "Content-Type: application/x-www-form-urlencoded",
    },
    function (err, httpResponse, str) {
      if (err) {
        callback(err);
      } else {
        let body = JSON.parse(str);

        console.log(body);

        return saveAndReturnPatreonToken(
          body.access_token,
          body.refresh_token,
          body.expires_in,
          callback,
          mainCallback
        );
      }
    }
  );
};

export const getPatreonToken = (mainCallback) => {
  async.waterfall(
    [
      // step 1: get token from database
      (callback) => {
        Token.findOne({
          name: "patreon",
        }).exec((err, token) => {
          if (err) {
            callback(err);
          } else {
            if (token === null) {
              console.log("No Patreon token found, requesting new one");
              generateNewPatreonToken(callback, mainCallback);
            } else {
              // check expiration
              let now = new Date();

              if (now > token.expires) {
                console.log("patreon token invalid, requesting new one");
                // then we need to refresh
                callback(null, token.refresh_token);
              } else {
                console.log("patreon token still valid!");
                // we can return the token now
                mainCallback(null, token.access_token);
              }
            }
          }
        });
      },
      // step 2: refresh token with patreon
      (refresh_token, callback) => {
        request.post(
          {
            url:
              "https://www.patreon.com/api/oauth2/token?grant_type=refresh_token&refresh_token=" +
              refresh_token +
              "&client_id=" +
              patreonClientId +
              "&client_secret=" +
              patreonClientSecret,
          },
          function (err, httpResponse, str) {
            if (err) {
              callback(err);
            } else {
              let body = JSON.parse(str);

              callback(
                null,
                body.access_token,
                body.refresh_token,
                body.expires_in
              );
            }
          }
        );
      },
      // step 3: update the token in the database
      (access_token, refresh_token, expires_in, callback) => {
        saveAndReturnPatreonToken(access_token, refresh_token, expires_in);
      },
    ],
    function (err) {
      if (err) {
        console.log(err);
      }
    }
  );
};