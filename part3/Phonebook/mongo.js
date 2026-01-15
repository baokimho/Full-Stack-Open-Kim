const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
} 

const password = process.argv[2]

const url = `mongodb+srv://baokim_learning:${password}@cluster0.zs9pn2v.mongodb.net/Phonebook_data?appName=Cluster0`

mongoose.set('strictQuery',false)

mongoose.connect(url, { family: 4 })

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

if ( process.argv.length === 3) {
    console.log('Phonebook: ')
    Person.find({}).then( result => {
        result.forEach( p => console.log(`${p.name} : ${p.number}`))
        mongoose.connection.close()
    })
} else if (process.argv.length > 3) {
  const name = process.argv[3]
  const number = process.argv[4]

  const person = new Person({
    name: name,
    number: number,
  })
  person.save().then(result => {
  console.log(`added ${name} number ${number} to phonebook`)
  mongoose.connection.close()
  })
}


