const { Snipping } = require("../models");
const sController = require("./snippingController");
const Binance = require("node-binance-api");

async function getAssetBalance(asset) {
  const accountInfo = await binanceClient.account();
  const balance = accountInfo.balances.find((b) => b.asset === asset);
  return balance ? parseFloat(balance.free + balance.locked) : 0;
}

async function buyCoin(req, res) {
  const { mode, coin, apiKey, secretKey } = req.body;

  const client = new Binance().options({
    APIKEY: apiKey,
    APISECRET: secretKey,
    family: 4,
  });

  await client.useServerTime();

  const fromCoin = "USDT";
  const toCoin = coin;

  const accountInfo = await client.account();
  const balanceInf = accountInfo.balances.find((b) => b.asset === fromCoin);
  const balance = balanceInf
    ? parseFloat(balanceInf.free + balanceInf.locked)
    : 0;

  let usdtAmount = 0;

  switch (mode) {
    case 1:
      usdtAmount = balance / 10;
      break;
    case 2:
      usdtAmount = balance / 4;
      break;
    case 3:
      usdtAmount = balance / 2;
      break;
    default:
      usdtAmount = balance;
  }

  try {
    // make the trade
    const symbolPair = toCoin + fromCoin;
    usdtAmount = usdtAmount.toFixed(2);
    
    const ticker = await client.prices(symbolPair);
    const ticks = await client.candlesticks(symbolPair, '1m');
    const prevTick = ticks[ticks.length - 2];
    const timestamp = Date.now();
    const timestamp10sAgo = timestamp - 10 * 1000;
    let price10sAgo = ticker[symbolPair];

    if (prevTick[6] > timestamp10sAgo) {
      price10sAgo = parseFloat(prevTick[4]);
      console.log(`Asset price 10 seconds ago: ${price10sAgo}`);
    } else {
      console.log(`No data available for the past 10 seconds`);
    }

    console.log("10s ago price: " + price10sAgo)

    const lot_size  = Math.log10(price10sAgo);
    const lot_size_pow = Math.pow(10, Math.round(lot_size));

    price10sAgo = price10sAgo * 102 / 100;
    price10sAgo = price10sAgo.toFixed(3 - Math.round(lot_size));

    let toCoinQuantity = Math.floor(usdtAmount / price10sAgo * lot_size_pow)/lot_size_pow; // calculate the amount of BNB you can buy

    console.log("quantity: " + toCoinQuantity);

    await client.buy(symbolPair, toCoinQuantity, price10sAgo, {type: 'LIMIT'});

    res.status(201).json({
      error: false,
      message: `Converted ${usdtAmount} ${fromCoin} to  ${toCoin}.`,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json("Buy Failed");
  }
}

async function sellCoin(req, res) {
  const { mode, coin, apiKey, secretKey } = req.body;

  const client = new Binance().options({
    APIKEY: apiKey,
    APISECRET: secretKey,
    family: 4,
  });

  await client.useServerTime();

  const fromCoin = "USDT";
  const toCoin = coin;

  const accountInfo = await client.account();
  const balanceInf = accountInfo.balances.find((b) => b.asset === toCoin);
  const balance = balanceInf
    ? parseFloat(balanceInf.free + balanceInf.locked)
    : 0;

  let amount = 0;

  switch (mode) {
    case 1:
      amount = balance / 10;
      break;
    case 2:
      amount = balance / 4;
      break;
    case 3:
      amount = balance / 2;
      break;
    default:
      amount = balance;
  }

  try {
    // make the trade
    const symbolPair = toCoin + fromCoin;

    console.log(amount);

    const ticker = await client.prices(symbolPair);
    const ticks = await client.candlesticks(symbolPair, '1m');
    const prevTick = ticks[ticks.length - 2];
    const timestamp = Date.now();
    const timestamp10sAgo = timestamp - 10 * 1000;
    let price10sAgo = ticker[symbolPair];

    if (prevTick[6] > timestamp10sAgo) {
      price10sAgo = parseFloat(prevTick[4]);
      console.log(`Asset price 10 seconds ago: ${price10sAgo}`);
    } else {
      console.log(`No data available for the past 10 seconds`);
    }

    console.log("10s ago price: " + price10sAgo)


    const lot_size  = Math.log10(price10sAgo);
    const lot_size_pow = Math.pow(10, Math.round(lot_size));

    price10sAgo = price10sAgo * 98 / 100;
    price10sAgo = price10sAgo.toFixed(3 - Math.round(lot_size));

    amount = Math.floor(amount * lot_size_pow)/lot_size_pow;


    await client.sell(symbolPair, amount, price10sAgo, {type: 'LIMIT'});

    res.status(201).json({
      error: false,
      message: `Converted ${amount} ${toCoin} to ${fromCoin}.`,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json("Sell Failed");
  }
}

async function getBalance(req, res) {
  const { apiKey, secretKey } = req.body;

  gApi = apiKey;
  gSecret = secretKey;

  try {
    binanceClient = new Binance().options({
      APIKEY: gApi,
      APISECRET: gSecret,
      family: 4,
    });

    let totalAssetValue = 0;

    await binanceClient.useServerTime();
    const accountInfo = await binanceClient.account();
    const balances = accountInfo.balances.filter(
      (balance) =>
        parseFloat(balance.free) > 0 || parseFloat(balance.locked) > 0
    );

    for (const item of balances) {
      try {
        if (item.asset == "USDT") {
          totalAssetValue += parseFloat(item.free) + parseFloat(item.locked);
          console.log(
            item.asset +
              ": " +
              (parseFloat(item.free) + " : " + parseFloat(item.locked))
          );

          continue;
        }

        const prices = await binanceClient.prices(`${item.asset}USDT`);
        const price = parseFloat(prices[`${item.asset}USDT`]);

        if (!isNaN(price)) {
          totalAssetValue +=
            (parseFloat(item.free) + parseFloat(item.locked)) * price;

          console.log(
            item.asset +
              ": " +
              (parseFloat(item.free) + " : " + parseFloat(item.locked))
          );
        }
      } catch (err) {
        //  console.log(err)
      }
    }

    console.log("total", totalAssetValue);

    res.status(201).json({
      error: false,
      data: totalAssetValue.toFixed(2),
    });
  } catch (err) {
    console.log(err);
    res.status(400).json("Get Balance Failed");
  }
}

function startSnipping(req, res) {
  const { apiKey, secretKey } = req.body;

  try {
    sController.scanMempool();
  } catch (err) {
    console.log("snipping scanNews error...");
  }

  /* save database */

  const status = "1";
  Snipping.update(
    {
      api: apiKey,
      secret: secretKey,
      status: status,
    },
    {
      where: {
        id: 1,
      },
    }
  )
    .then((snipping) =>
      res.status(201).json({
        error: false,
        data: snipping,
        message: "setting has been updated in the snipping",
      })
    )
    .catch((error) =>
      res.json({
        error: true,
        error: error,
      })
    );
}

function stopSnipping(req, res) {
  if (snipSubscription != null) {
    try  {
    snipSubscription.unsubscribe(function(error, success) {
      if (success) console.log("Successfully unsubscribed!");
    }); } catch(err) {
      console.log(err);
    }
  }

  Snipping.update(
    {
      status: "0",
    },
    {
      where: {
        id: 1,
      },
    }
  )
    .then((snipping) =>
      res.status(201).json({
        error: false,
        data: snipping,
        message: "setting has been updated in the snipping",
      })
    )
    .catch((error) =>
      res.json({
        error: true,
        error: error,
      })
    );
}

function getSnippingStatus(req, res) {
  Snipping.findAll({
    attribute: "status",
    where: {
      id: 1,
    },
  })
    .then((snipping) => {
      if (snipping.length == 0) {
        console.log("-------------snipping status", snipping, snipping.length);

        let item = {
          id: 1,
          status: 0,
          api: "",
          secret: "",
        };

        Snipping.create(item).then((data) => {
          Snipping.findAll({
            attribute: "status",
            where: {
              id: 1,
            },
          }).then((data) =>
            res.status(201).json({
              error: false,
              data: data,
              message: "setting has been updated in the snipping",
            })
          );
        });
      } else {
        // set global variables ....

        res.status(201).json({
          error: false,
          data: snipping,
          message: "setting has been updated in the snipping",
        });
      }
    })
    .catch((error) =>
      res.json({
        error: true,
        error: error,
      })
    );
}

module.exports = {
  getAssetBalance,
  buyCoin,
  sellCoin,
  getBalance,
  startSnipping,
  stopSnipping,
  getSnippingStatus,
};
