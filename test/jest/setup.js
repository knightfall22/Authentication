jest.setTimeout(60000)

require('../../models/User')
const mongoose = require('mongoose')

mongoose.Promise = global.Promise;
console.log(process.env.MONGO_DB_URI);
mongoose.connect(process.env.MONGO_DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
