const fs = require("fs");
const express = require('express');
const app = express();
const https = require('https');
const server = https.createServer({
	key: fs.readFileSync("./privkey.pem"),
	cert: fs.readFileSync("./cert.pem")
},app);
const socketio = require('socket.io');
const io = socketio(server);
const net = require("net");
const pako = require("./pako.js");
const uuid = require("uuid");

app.use(express.static("./static"));

server.listen(443, () => {
  console.log("Server started");
});



io.on("connection", client => {
	console.log("Connected");
	client.on("image", x => {
		let i = pako.ungzip(x, {to: 'string'});
		let c = new net.Socket();
		c.connect(10000, "localhost", function(){
			c.write((i.length + "").length + "");
			c.write(i.length + "");
			c.write(i);
			let data = "";
			c.on("data", x => {
				data+=x;
			});
			c.on("end", x => {
				console.log(data);
				client.emit("image", data);
				data = undefined;
			});
		});
	});
	client.on("save_image", x => {
		fs.appendFileSync("images.csv", x);
	});
});

const redirector = express();

redirector.get("*", (req, res) => {
	res.redirect('https://' + req.headers.host + req.url);
});

redirector.listen(80);