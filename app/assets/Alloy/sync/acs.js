function S4() {
	return ((1 + Math.random()) * 65536 |
	0).toString(16).substring(1);
}

function guid() {
	return S4() + S4() + "-" + S4() + "-" 
	+ S4() + "-" + S4() + "-" + S4() + S4() + S4();
}

function InitAdapter(config) {
	Cloud = require("ti.cloud");
	Cloud.debug = !0;
	config.Cloud = Cloud;
}
function Sync(method, model, options) {
	//will be filledin later
	var object_name = model.config.adapter.collection_name;
	
	 if (object_name === "users") {
	   processACSUsers(model, method, options);
	  } 
}

function processACSUsers(model, method, options) {
  switch (method) {
    case "update":
      var params = model.toJSON();
      Cloud.Users.update(params, function(e) {
        if (e.success) {
          model.meta = e.meta;
          options.success && options.success(e.users[0]);
          model.trigger("fetch");
        } else {
          Ti.API.error("Cloud.Users.update " + e.message);
          options.error && options.error(e.error && e.message || e);
        }
      });
      break;
	}
}


var _ = require("alloy/underscore")._;

module.exports.sync = Sync;

module.exports.beforeModelCreate = function(config) {
	config = config || {};
	config.data = {};
	InitAdapter(config);
	return config;
};

module.exports.afterModelCreate = function(Model) {
	Model = Model || {};
	Model.prototype.config.Model = Model;
	return Model;
};