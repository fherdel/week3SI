const Message = require('../schemas/message.schema')

function createMessage (req,res){
    if(req.body){
        let newMessage = new Message(req.body)
        newMessage.save((error,message)=>{
            if(error){
                return res.status(500).json({message:error,data:null}) 
            }
            res.status(200).json({message:null,data:message})   
        })
    }
}

function getMessages(req,res){
    Message.find({},(error,messages)=>{
        if(error) return res.status(500).json({message:error,data:null})
        res.status(200).json({message:null,data:messages})
    })
}

function deteleMessages(req,res){
    Message.remove({},(error,messages)=>{
        if(error) return res.status(500).json({message:error,data:null})
        res.status(200).json({message:null, data:messages})
    })
}

module.exports={
    createMessage,
    getMessages,
    deteleMessages
}