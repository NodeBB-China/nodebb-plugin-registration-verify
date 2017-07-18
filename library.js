"use strict";

var plugin = {},
	meta = module.parent.require('./meta'),
	nconf = module.parent.require('nconf'),;

plugin.init = (data, callback) => {
        data.router.get('/admin/plugins/registration-aliverity', data.middleware.admin.buildHeader, renderAdmin);
        data.router.get('/api/admin/plugins/registration-aliverity', renderAdmin);
        callback();
};

plugin.addAdminNavigation = function(header, callback) {
	header.plugins.push({
		route: '/registration-question',
		icon: 'fa-tint',
		name: 'Registration Question'
	});

	callback(null, header);
};

plugin.addCaptcha = function(params, callback) {
	var question = meta.config['registration-question:question'];
	console.log(params);
	var captcha = {
		label: 'Registration Question',
		html: '<div class="well"><strong>' + question + '</strong><br /><input class="form-control" name="registration-question" id="registration-question" /></div>'
	};

	if (params.templateData.regFormEntry && Array.isArray(params.templateData.regFormEntry)) {
		params.templateData.regFormEntry.push(captcha);
	} else {
		params.templateData.captcha = captcha;
	}

	callback(null, params);
};

plugin.checkRegister = function(params, callback) {
	console.log(params);
	var answer = meta.config['registration-question:answer'];

	if (answer.toLowerCase() !== params.req.body['registration-question'].toLowerCase()) {
		callback({source: 'registration-question', message: 'wrong-answer'}, params);
	} else {
		callback(null, params);
	}
};

function renderAdmin(req, res, next) {
	res.render('admin/registration-aliverity', {});
}

module.exports = plugin;
