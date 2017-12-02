'use strict';

var _nunjucks = require('nunjucks');

var _nunjucks2 = _interopRequireDefault(_nunjucks);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Hapi = require('hapi');
var server = new Hapi.Server();

_nunjucks2.default.configure('./dist');
server.connection({
  host: 'localhost',
  port: '8000'
});

function getName(request) {
  // 默认值
  var name = {
    fname: 'Rick',
    lname: 'Sanchez'
  };
  // 拆分路径参数
  var nameParts = request.params.name ? request.params.name.split('/') : [];
  // 优先顺序
  // (1) 路径参数
  // (2) 查询参数
  // (3) 默认值
  name.fname = nameParts[0] || request.query.fname || name.fname;
  name.lname = nameParts[1] || request.query.lname || name.lname;
  return name;
}
server.route({
  method: 'GET',
  path: '/hello',
  handler: function handler(request, reply) {
    // reply('hello world');
    // 读取模板并使用上下文对象进行编译
    _nunjucks2.default.render('index.html', {
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
  path: '/hello/{name*}',
  handler: function handler(request, reply) {
    // 读取模板并使用上下文对象进行编译
    _nunjucks2.default.render('index.html', getName(request), function (err, html) {
      // 使用HTML内容响应请求
      reply(html);
    });
  } });

server.start();