exports = module.exports = {};
exports.version = "1.0.0";
exports.Worker = Worker;

const async = require("async");

function Worker() {
	this.context = {};
	this.jobs = [];
	this.state = 0;
	this.done = null;
}

Worker.prototype.isRunning = function() {
	return this.state == 1;
}

Worker.prototype.isDone = function() {
	return this.state == 2;
}

Worker.prototype.do = function(func) {
	if (this.isRunning())
		throw 1001; // Unable to add job to worker while it is running.

	this.jobs.push(func);
	return this;
}

Worker.prototype.child = function(next) {
	if (!this.isRunning())
		throw 1002; // Chain can only be done on a running job.

	var w = new Worker();
	w.context = this.context;
	w.finally(function (cxt, err) {
		if (err)
			return next(err);
		next();
	});
	return w;
}

Worker.prototype.finally = function(done) {
	if (this.isRunning())
		throw 1003; // Job is still running

	this.done = done;
	return this;
}

Worker.prototype.run = function(done) {
	if (this.isRunning())
		throw 1000; // Worker is working

	var that = this;
	this.state = 1;
	done = done || this.done || function () {};

	async.eachSeries(that.jobs, function (func, next) {
		func.call(that, that.context, next);
	}, function (err) {
		done.call(that, that.context, err);
		that.state = 2;
	});
}
