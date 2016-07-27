var express = require('express'),
  port = process.env.port || 3000,
  app = express();

app.use(express.static('./')); //serve initial content

app.get('*', function(request, response) {
  console.log('New request: ', request.url);
  response.sendFile('index.html', {root: '.'});
});

app.listen(port, function(){  //start server
  console.log('Server started on port ' + port + '.');
});
