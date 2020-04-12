module.exports = (app) => {
	const metric = require('../controllers/metric.controller')
	
	app.get('/metric/:key/sum', metric.getSum)
	app.post('/metric/:key', metric.store)
}