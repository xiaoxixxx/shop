<script setup>
import axios from 'axios';
import oAuth1a from "twitter-v1-oauth";
// import { OAuth } from '@twitter/oauth-1.0a';
// consumer_key: "XeW7FzTGv43GqFK7cSjd1CSP6", //api key
//   consumer_secret: "MqptfK4x3ysnqv81wfUVKjGo78DRcPPoIamlmuzW6NdNfptNBu", //api key secret
//     callback_url: "http://192.168.1.27:5173", //回调地址

const keyStore = {


  api_key: "XeW7FzTGv43GqFK7cSjd1CSP6",
  api_secret_key: "MqptfK4x3ysnqv81wfUVKjGo78DRcPPoIamlmuzW6NdNfptNBu",
  access_token: "q6572Np9V94Ejtw9LLagwKJ4CFkJbt",
  access_token_secret: "BjtodsCl8HfcdqsfBVo0AgLvtbtS9QhaarDCMcQlCTbRR",
}
const url = "https://api.twitter.com/1.1/search/tweets.json";
const method = "GET";
const params = { q: "twitter bot" };
--url 'https://api.x.com/1.1/statuses/update.json?status=Hello%20world' \

// --header 'authorization: OAuth oauth_consumer_key="CONSUMER_API_KEY", oauth_nonce="OAUTH_NONCE", oauth_signature="OAUTH_SIGNATURE", 
// oauth_signature_method = "HMAC-SHA1",
//     oauth_timestamp = "OAUTH_TIMESTAMP",
//     oauth_token = "ACCESS_TOKEN", oauth_version = "1.0"'
const xClickHandle = () => {
//   const authorization = oAuth1a({ method, url, params }, keyStore);

  axios
    .get(url, {
      params,
      headers: {
          authorization: 'OAuth ',
          oauth_consumer_key:'OAuth ',
          oauth_nonce:'OAuth ',
          oauth_signature:'OAuth ',
          oauth_signature_method:'OAuth ',
        
      },
    })
    .then(({ data }) => console.log(data))
    .catch((err) => {
      if (err.response) {
        return console.log(err.response.data.errors);
      }
      console.log(err);
    });
}
// XeW7FzTGv43GqFK7cSjd1CSP6 API Key
// MqptfK4x3ysnqv81wfUVKjGo78DRcPPoIamlmuzW6NdNfptNBu  API Key Secret
// AAAAAAAAAAAAAAAAAAAAAJu%2FwQEAAAAAeqKrUaEcCZw5h21xDqrVLLv%2FIEw%3Djs115wKKzKbgnCgTfA0JgRPZEyObhL49AR0jnJl04xA8GYLCYZ    Bearer Token
// g4qZn5BKcAA5gIgPbfzBn5LHifUDz28ae3R6Hdj6vBY40EQOrb  Client Secret
// 1698980125344464896-q6572Np9V94Ejtw9LLagwKJ4CFkJbt  Access Token
// BjtodsCl8HfcdqsfBVo0AgLvtbtS9QhaarDCMcQlCTbRR    Access Token Secret
</script>


<template>
  <view>

    <van-button @click="xClickHandle">x 登录</van-button>
  </view>
</template>