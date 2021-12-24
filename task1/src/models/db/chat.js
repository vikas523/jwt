
const mongoose=require("mongoose")

const chats1 = mongoose.Schema(
    {
      senderID: {
        type: String,
        required: true,
      },
      RecieverID: {
        type: String,
        required: true,
      },
      Message: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
      },
      created_at: { type: Date, default: Date.now },
    
    },
    { timestamps: true }
  );

module.exports = mongoose.model("chatlogs",chats1);




