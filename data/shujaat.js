
const validateEmail = (email)=>{
    var re = /\S+@\S+\.\S+/;
    return re.test(email);
}
let User = []
let obj1 = {email : "shujaatbakhsh25@gmail.com",
        name : "shujaat bakhsh",
        age : 32,
        _id : "1044297",
        contact : "9717156781",
        enrolledIn : ["CS 546","CS 234"],
        isAdmin : true,
        score : 12,
}
const registerUser = async (obj1) => {
    for (let i in obj1){
        if (i==="email"){
            if (!validateEmail(obj1[i])){
                throw "Invalid email"
            }}
        if (i === "name"){
            if (typeof obj1[i]!=="string" || obj1[i].length===0){
                throw "Invalid username!"
            }}
        if (i === "age"){
            let age=Number(obj1[i])
            if (typeof age != "number" || obj1[i]<0 || obj1[i]>110){
                throw "Invalid value for age!"
            }}
        if (i === "id"){
            let _id = Number(obj1[i])
            if (!_id){
                throw "Invalid id!"
            }
        } 
        if (i === "contact"){
            let contact = Number(obj1[i])
            if (!contact){
                throw "Invalid contact number!"
            }
        }
        if (i === "enrolledIn"){
            if (!Array.isArray(obj1[i])){
                throw "Invalid enrollments!"
            }
        } 
    }
    let dbUser = await getUserConnection()

    let insertedObj = await dbUser.insertOne(obj1)
    if (await insertedObj){
        return true
    }
    return false
}
const getUserbyId = async (id) => {
    if (!id){
        throw "No input!"
    }
    obj = await dbUser.findOne({_id:id})
    if (await obj){
        return obj
    }
}
const getAllUsers = async () => {
    return await dbUser.findAll({})
}
console.log(obj1.id)