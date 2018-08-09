exports = module.exports = validate;
exports.required = required;

const _ = require("lodash");

/**
 * Validation rules structure
 * [[attributes, ...], func, message] where func is the rule that takes in each attribute
 */
function validate(context, rules) {
	return new Validate(context, rules);
}

function required(attr) {
	if (!this.hasOwnProperty(attr))
		return false;
	return true;
}

function Validate(context, rules) {
	var that = this;

	this.success = true;
	this.errors = {};
	_.each(rules, function (rule) {
		var attributes = rule[0];
		var func = rule[1];
		var message = rule[2];

		_.each(attributes, function (attr) {
			if (func.call(context, attr))
				return true;
			if (!that.errors[attr])
				that.errors[attr] = [];
			var val = context[attr];
			if (!(typeof val == "number") || !(typeof val == "string"))
				val = undefined;
			that.success = false;
			that.errors[attr].push(message.replace(/\{attribute\}/g, attr).replace(/\{value\}/g, val));
		});
	});
}
