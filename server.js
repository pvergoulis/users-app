const mongoose = require('mongoose')
const app = require('./app')
const port = 3000

// npm run dev

mongoose.connect(process.env.MONGODB_URI)
    .then(
      ()=>{
        console.log("Connection To MongoDB established")
        
        app.listen(port,()=>{
          console.log('Server is up')
        })
      },
      err =>{ console.log('Failed to connect to MongoDB ' , err)}
    )


