/* this file isn't doing anything */

require('dotenv').config()

const path = require('path')

// koa imports
const Koa = require('koa')
const session = require('koa-session')
const Router = require('koa-router')
const koaqs = require('koa-qs')
const render = require('koa-ejs')
const serve = require('koa-static')
const bodyParser = require('koa-bodyparser')
 
// Instantiating our app
const app = new Koa()

app.keys = ['grant', 'storyblok']

app.use(bodyParser())
app.use(session(app))
koaqs(app)

render(app, {
    root: path.join(__dirname, 'views'),
    layout: 'template',
    viewExt: 'html',
    cache: false,
    debug: false,
    async: true
})

app.use(serve(path.join(__dirname, '/public')))

const router = new Router()
 
router
  .get('/', async ctx => {
    ctx.body = 'Server started!'
  })
 
// use the router instance and initialize the server
app
  .use(router.routes())
  .use(router.allowedMethods())
  .listen(3000)
 
console.log('Server listen on port 3000')