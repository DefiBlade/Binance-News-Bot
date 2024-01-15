import React, { useState, useEffect } from "react";
import { Button, FormControl } from "react-bootstrap";
import "./Label.css";
import {
  resetSnippingAPI,
  initSnippingAPI,
  resetAllAPI
} from "./api";

const Setting = () => {
  const resetSnipping = () => {
    resetSnippingAPI();
  };

  const initSnipping = () => {
    initSnippingAPI();
  };

  const resetAll = () => {
    resetAllAPI();
  };


  return (
    <div>
      <div className="row">
        <div className="col-sm-12 col-md-12 col-lg-12">
          <div className="form-group">
            <Button variant="danger" className="setting-btn" onClick={() => resetSnipping()}>
              ResetSnipping
            </Button>
            <label htmlFor="usr" className="setting-label">
              {" "}
              &nbsp;&nbsp;Reset the Bot information such as key, secret key and etc
            </label>
          </div>
          <div className="form-group">
            <Button variant="danger" className="setting-btn" onClick={() => initSnipping()}>
              ClearHistory
            </Button>
            <label htmlFor="usr" className="setting-label">
              {" "}
              &nbsp;&nbsp;Clear the News History.
            </label>
          </div>
          <div className="form-group">
            <Button variant="danger" className="setting-btn" onClick={() => resetAll()}>
              ResetAll
            </Button>
            <label htmlFor="usr" className="setting-label">
              {" "}
              &nbsp;&nbsp;Reset All Data
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Setting;
