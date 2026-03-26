const express = require("express");
const fs = require("fs-extra");

const app = express();
app.use(express.json());
app.use(express.static("."));

const FILE = "data.json";

if (!fs.existsSync(FILE)) {
  fs.writeJsonSync(FILE, {
    users: [],
    winners: []
  });
}

const prizes = [
  "5% скидка",
  "10% скидка",
  "15% скидка",
  "500 кг угля",
  "1 тонна угля",
  "Tefal",
  "🔥 Котел"
];

function getPrize() {
  return prizes[Math.floor(Math.random() * prizes.length)];
}

// 👤 регистрация
app.post("/reg", async (req, res) => {
  let data = await fs.readJson(FILE);

  let user = {
    id: data.users.length + 1,
    balance: 50
  };

  data.users.push(user);
  await fs.writeJson(FILE, data);

  res.json(user);
});

// 🎡 крутка
app.post("/spin", async (req, res) => {
  let { id } = req.body;
  let data = await fs.readJson(FILE);

  let user = data.users.find(u => u.id === id);

  if (!user) return res.send("error");

  if (user.balance < 10) {
    return res.json({ error: "Нет монет" });
  }

  user.balance -= 10;

  let prize = getPrize();

  // 💎 ТВОИ ОСОБЫЕ ЧИСЛА
  if ([100, 775, 777, 1000].includes(user.id)) {
    prize = "💎 СУПЕР ПРИЗ";
  }

  // 🏆 сохраняем
  if (prize.includes("Котел") || prize.includes("СУПЕР")) {
    data.winners.push({
      id: user.id,
      prize: prize
    });
  }

  await fs.writeJson(FILE, data);

  res.json({
    prize,
    balance: user.balance
  });
});

// 🏆 список
app.get("/win", async (req, res) => {
  let data = await fs.readJson(FILE);
  res.json(data.winners.slice(-5).reverse());
});

app.listen(3000, () => console.log("🚀 ready"));
