const { ERC20_ABI, WBNB, PAN_ROUTER } = require("../constant/erc20");
const { SnippingDetail } = require("../models");
const app = require("../app.js");
const WebSocket = require("ws"); // Require ws package

/*****************************************************************************************************
 * Find the new liquidity Pair with specific token while scanning the mempool in real-time.
 * ***************************************************************************************************/
async function scanMempool() {
  snipSubscription = new WebSocket("wss://news.treeofalpha.com/ws");

  snipSubscription.on("open", function open() {
    console.log("WebSocket connected");
    snipSubscription.on("message", function incoming(data) {
      const fixedStr = data.replace(/\r?\n|\r/g, " ");
      const jsonObject = JSON.parse(fixedStr);

      console.log(fixedStr + "\n");
      var mTitle;

      if (jsonObject.suggestions.length > 0 && jsonObject.suggestions[0].hasOwnProperty("coin")) {
        mTitle = jsonObject.hasOwnProperty("body")
          ? jsonObject.body
          : jsonObject.source;
        SnippingDetail.create({
          timestamp: new Date().toISOString(),
          title: jsonObject.title + " " + mTitle,
          coin: jsonObject.suggestions[0].coin,
          note: "Tree News",
          url: jsonObject.hasOwnProperty("link")
            ? jsonObject.link
            : jsonObject.url,
        });

        // Send the response to the frontend so let the frontend display the event.

        Object.keys(wsClients).map((client) => {
          var detectObj = {
            type: "snipping",
            action: "Detected",
            timestamp: new Date().toISOString(),
          };
          var detectInfo = JSON.stringify(detectObj);
          // client.send(detectInfo);
          wsClients[client].send("snipping update");
        });
      }

    });
  });
}

module.exports = {
  scanMempool: scanMempool,
};
