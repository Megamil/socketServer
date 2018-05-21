const app 		= require('express')();
const http 		= require('http').createServer(app);
const io		= require('socket.io')(http);

var users = 0;

app.get('/index', (req, res) => {
	res.sendFile(__dirname+'/index.html');
})

io.on('connection',(socket) => {

	users++;
	var userName = "";
	
	var dNow = new Date();
  	var timestamp = dNow.getDate() + '/' + (dNow.getMonth()+1) + '/' + dNow.getFullYear() + ' ' + dNow.getHours() + ':' + dNow.getMinutes() + ':' + dNow.getSeconds();

	console.log('New User: '+socket.id+" Total: "+users);
	socket.emit('users',users);
	socket.broadcast.emit('users',users);

	socket.on('name', (name) =>{
		console.log('User '+socket.id+' Name: '+name);
		userName = name;
		socket.emit('chatResponse',				'('+timestamp+') '+userName+' <join title="ID '+socket.id+'">entrou na sala</join>');
		socket.broadcast.emit('chatResponse',	'('+timestamp+') '+userName+' <join title="ID '+socket.id+'">entrou na sala</join>.');
	});

	socket.on('nameChange', (name) =>{
		console.log('User '+userName+' change name to: '+name);
		socket.emit('chatResponse',				'('+timestamp+') '+userName+' <change>mudou de nome para:</change> '+name);
		socket.broadcast.emit('chatResponse',	'('+timestamp+') '+userName+' <change>mudou de nome para:</change> '+name);
		userName = name;
	});

	socket.on('chat', (chat) =>{
		console.log('User '+socket.id+' send: '+chat);
		socket.emit('chatResponse',				'('+timestamp+') '+userName+' disse: '+chat);
		socket.broadcast.emit('chatResponse',	'('+timestamp+') '+userName+' disse: '+chat);
	});

	socket.on('typing', (chat) =>{
		console.log(userName+' Está digitando... ');
		socket.broadcast.emit('typing',	userName+' Está digitando...<br>');
	});

	socket.on('disconnect', function(){
    	users--;
    	console.log(userName+' saiu');
    	socket.broadcast.emit('chatResponse', '('+timestamp+') '+userName+' <quit>deixou a sala<quit>');
    	socket.broadcast.emit('users',users);
    });

});

http.listen(3000, function(){
	console.log('Listening on port 3000')
});