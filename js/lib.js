"use strict";

var Lib = (function () {
  var _debug = {
    start : 0,
    end : 0,
    getChkTime : function () {
      return (Date.now) ? Date.now() : new Date().getTime();
    },
    getLoadTime : function() {
      return this.end - this.start;
    },
    log: function (msg) {
      console.log(msg);
    }
  },
  _debug_dummy = {
    getChkTime : function () {},
    getLoadTime : function() {},
    log: function (msg) {}
  },
  _xhr = function (method, url, callback) {
    var xhr, i, len, ids;
    xhr = new XMLHttpRequest();

    xhr.onreadystatechange = (function (req) {
      return function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
          callback(req);
        }
      };

    })(xhr);

    if(method === "") {
      method = "GET";
    }
    xhr.open(method, url, true);
    return xhr;
  },
  _getData = function (type, key, callback) {
    var storage = (type == "local") ? chrome.storage.local : chrome.storage.sync;
    storage.get(key, function(data) {
      callback(data[key]);
    });
  },
  _setData = function(type, key, val, callback) {
    var storage = (type == "local") ? chrome.storage.local : chrome.storage.sync,
    obj = {};
    obj[key] = val;
    storage.set(obj, callback);
  },
  _getConf = function (callback) {
    var config = {};
    _getData("sync", "snConf", function (data) {
      config = data;

      if(typeof config === "undefined" || config.keywords.length === 0) {
          var config= {
            listCnt: 7,
            langCode: "us",
            keywords: []
          };
          _setData("sync", "snConf", config, callback(config));
      }
      else {
        callback(config);
      }
    });
  },
  _setConf = function (config, callback) {
    _setData("sync", "snConf", config, callback(config));
  },
  _loadImage = function (uri, tid, callback) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'blob';
    xhr.onload = function() {
      callback(tid, window.URL.createObjectURL(xhr.response), uri);
    }
    xhr.open('GET', uri, true);
    xhr.send();
  };

  return {
    debug: function (mode) {
      return (mode == "debug") ? _debug : _debug_dummy;
    },
    getConf: _getConf,
    setConf: _setConf,
    getData: _getData,
    setData: _setData,
    xhr: _xhr,
    loadImage: _loadImage
  };

}());
