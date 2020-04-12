var fs = require('fs')

exports.getSum = (req, res) => {
	if (fs.existsSync('./app/data/data.json')) {
		fs.readFile('./app/data/data.json', (err, data) => {
			if (err) {
				console.log(error)
				return res.status(500).send({message: err.message || "Some error occured!"})
			}
			metrics = JSON.parse(data)
			if (metrics.hasOwnProperty(req.params.key)) {
				var metric = metrics[req.params.key]
				var sum = 0
				metric.map((item) => {
					var time = new Date().getTime()
					// Milliseconds for 1 hour
					var an_hour = 60 * 60 * 1000
					if (!(time - item.timestamp > an_hour))
						sum += item.value
				})
			} else {
				return res.status(400).send({message: req.params.key + " metrics does not exist"})
			}
			res.json({"value" : parseInt(sum)})
		})
	} else return res.status(400).send({message: err.message || "Not found!"})
}

exports.store = (req, res) => {
	let metrics = {}
	if (!fs.existsSync('./app/data/data.json')) {
		fs.writeFileSync('./app/data/data.json', '{}', (err) => {
			if (err) {
				console.log(error)
				return res.status(500).send({message: err.message || "Some error occured!"})
			}
		})
	}

	fs.readFile('./app/data/data.json', (err, data) => {
		if (err) {
			console.log(err)
			return res.status(500).send({message: err.message || "Some error occured!"})
		}

		metrics = JSON.parse(data)
		var obj = req.body
		obj.timestamp  = new Date().getTime()

		if (metrics.hasOwnProperty(req.params.key)) {
			metrics[req.params.key].push(obj)
		} else {
			metrics[req.params.key] = []
			metrics[req.params.key].push(obj)
		}

		fs.writeFile('./app/data/data.json', JSON.stringify(metrics), (err) => {
			if (err) {
				res.json({"message": "Error occured!"})
			}
			res.json({})
		})

	})
	
}