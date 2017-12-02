var Hapi = require('hapi');
var server = new Hapi.Server();
import nunjucks from 'nunjucks';
nunjucks.configure('./dist');
server.connection({
  host: 'localhost',
  port: '8000'
});


function getName(request) { // 默认值
  let name = {
      fname: 'Rick',
      lname: 'Sanchez'
    };
  // 拆分路径参数
  let nameParts = request.params.name ? request.params.name.split('/') : [];
  // 优先顺序
  // (1) 路径参数
  // (2) 查询参数
  // (3) 默认值
  name.fname = (nameParts[0] || request.query.fname) ||
         name.fname;
  name.lname = (nameParts[1] || request.query.lname) ||
  name.lname;
       return name;
}
server.route({
  method: 'GET',
  path:'/hello',
  handler: function(request, reply) {
    // reply('hello world');
     // 读取模板并使用上下文对象进行编译
    nunjucks.render('index.html', {
      fname: request.params.fname,
      lname: request.params.lname
    }, function (err, html) {
    // 使用HTML内容响应请求
      reply(html);
    });
  }
});
server.route({
  method: 'GET',
  path:'/hello/{name*}',
  handler: function (request, reply) {
    // 读取模板并使用上下文对象进行编译
    nunjucks.render('index.html', getName(request), function (err, html) {
    // 使用HTML内容响应请求
      reply(html);
    });
} });

server.start();

