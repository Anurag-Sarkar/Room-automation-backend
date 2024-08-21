const mongoose = require("mongoose")

mongoose.connect("mongodb+srv://anurag:PpfEcoT0zsQpM5Vn@cluster0.fwfddei.mongodb.net/").then(()=>{
    console.log("connected to db")
}).catch(()=>{
    console.log("error connecting to db")
})