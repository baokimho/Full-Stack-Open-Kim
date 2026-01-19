const mongoose = require('mongoose')
const url = process.env.DB_URI

mongoose.set('strictQuery',false)

mongoose.connect(url, { family: 4 })
  .then(() => console.log('connected'))
  .catch((e) => console.log(e.message))

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true,
  },
  number: {
    type: String,
    minLength: 8,
    required: true,
    validate: {
      validator: (v) => {
        return /^\d{2,3}-\d+$/.test(v)
      },
      message:props => `${props.value} is not a valid phone number! (Format: 09-12345 or 040-12345)`
    }
  },
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

const Person = mongoose.model('Person', personSchema)

module.exports = Person
