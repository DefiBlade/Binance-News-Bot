const { Snipping, SnippingDetail } = require("../models");
const app = require("../app.js");

function sendUpdateMessage() {
  var aWss = app.wss.getWss("/");
  aWss.clients.forEach(function(client) {
    client.send("setting Updated");
  });
}

function resetSnipping(req, res) {
  Snipping.destroy({
    where: {
      id: 1,
    },
  })
    .then((status) =>
      res.status(201).json({
        error: false,
        message: "Snipping Information has been deleted",
      })
    )
    .catch((error) =>
      res.json({
        error: true,
        message: error,
      })
    );
  sendUpdateMessage();
}

function initSnipping(req, res) {
  SnippingDetail.destroy({
    where: {},
    truncate: true,
  })
    .then((status) =>
      res.status(201).json({
        error: false,
        message: "Snipping Transaction History has been deleted",
      })
    )
    .catch((error) =>
      res.json({
        error: true,
        message: error,
      })
    );
  sendUpdateMessage();
}


function resetAll(req, res) {
  Snipping.destroy({
    where: {
      id: 1,
    },
  });

  SnippingDetail.destroy({
    where: {},
    truncate: true,
  });


  sendUpdateMessage();
}

module.exports = {
  initSnipping,
  resetSnipping,
  resetAll,
};
