const { MongoClient, ServerApiVersion } = require("mongodb");
const express = require("express");
const mongoose = require("mongoose");
const app = express();
app.use(express.static("public"));
app.use(express.json());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
const { messageSchema } = require("./schemas/messagesSchema.js");
const { ipSchema } = require("./schemas/ipSchema.js");
require("dotenv").config();
const uri = process.env.VITE_MONGODB_SERVER;
mongoose.connect(uri);

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

const Messages = mongoose.model("Messages", messageSchema);
const IPs = mongoose.model("Acessos", ipSchema);
async function run() {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("Conectado com sucesso ao MongoDB!");
  } finally {
    await client.close();
  }
}

async function verifyDatabases() {
  try {
    await client.close();
    console.log("Tabela de mensagens criada com sucesso!");
  } catch (err) {
    console.error("Error verifying databases:", err);
  }
}

app.post("/api/newMessage", (req, res) => {
  const { message, isGPT } = req.body;
  if(!message || typeof isGPT !== "boolean") {
    return res.status(400).json({ message: "Por favor, preencha todos os campos!" });
  }
  const newMessage = new Messages({
    message: message,
    isGPT: isGPT
  });
  newMessage
    .save()
    .then(() => {
      res.status(201).json({ message: "Mensagem salva com sucesso!" });
    })
    .catch((err) => {
      res.status(500).json({ message: "Erro ao salvar a mensagem!", error: err });
    });
});

app.post("/api/newAccess", (req, res) => {
  const { ip } = req.body;
  if(!ip) {
    return res.status(400).json({ message: "Por favor, preencha todos os campos!" });
  }
  const newIP = new IPs({
    ip: ip,
  });
  newIP
    .save()
    .then(() => {
      res.status(201).json({ message: "IP salvo com sucesso!" });
    })
    .catch((err) => {
      res.status(500).json({ message: "Erro ao salvar o IP!", error: err });
    });
});


run();
verifyDatabases();

app.listen(80, async () => {
  console.log("Servidor iniciado na porta 80");
  await client.connect();
  const res = await client.db("test").collection("messages").find().toArray();
  console.log(res)
});