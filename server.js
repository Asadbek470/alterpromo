const express = require("express");

const app = express();
app.use(express.json());
app.use(express.static("."));

// 🧠 данные в памяти (без JSON файла)
let users = [];
let winners = [];

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
app.post("/reg", (req, res) => {
  let user = {
    id: users.length + 1,
    balance: 50
  };

  users.push(user);
  res.json(user);
});

// 🎡 крутка
app.post("/spin", (req, res) => {
  let { id } = req.body;

  let user = users.find(u => u.id === id);
  if (!user) return res.send("error");

  if (user.balance < 10) {
    return res.json({ error: "Нет монет" });
  }

  user.balance -= 10;

  let prize = getPrize();

  // 💎 ТОЛЬКО ЭТИ ОСОБЫЕ НОМЕРА
  if ([100, 775, 777, 1000].includes(user.id)) {
    prize = "💎 СУПЕР ПРИЗ";
  }

  // 🏆 победители
  if (prize.includes("Котел") || prize.includes("СУПЕР")) {
    winners.push({
      id: user.id,
      prize: prize
    });
  }

  res.json({
    prize,
    balance: user.balance
  });
});

// 🏆 список
app.get("/win", (req, res) => {
  res.json(winners.slice(-5).reverse());
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("🚀 Готово"));
