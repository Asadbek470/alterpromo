const express = require("express");
const path = require("path");

const app = express();
app.use(express.json());
app.use(express.static("public"));

let users = {};
let usedNumbers = new Set();
let ultraWon = false;

// получить пользователя
app.get("/api/user", (req, res) => {
    let id;
    do {
        id = Math.floor(Math.random() * 5000);
    } while (usedNumbers.has(id));

    usedNumbers.add(id);
    users[id] = { spun: false };

    res.json({ userId: id });
});

// крутить
app.post("/api/spin", (req, res) => {
    const { userId } = req.body;

    if (!users[userId]) {
        return res.json({ error: "user_not_found" });
    }

    if (users[userId].spun) {
        return res.json({ prize: users[userId].prize });
    }

    let prize;

    // счастливые номера
    if ([100, 777, 1000].includes(Number(userId))) {
        prize = "🎁 РЕДКИЙ ПОДАРОК";
    } else {
        let rand = Math.random();

        if (!ultraWon && rand < 0.000001) {
            prize = "🔥 БЕСПЛАТНЫЙ КОТЁЛ";
            ultraWon = true;
        } else if (rand < 0.05) {
            const rare = ["Набор посуды", "Уголь 1 тонна", "Уголь 5 тонн"];
            prize = rare[Math.floor(Math.random() * rare.length)];
        } else {
            const common = ["Скидка 5%", "Скидка 10%", "Скидка 15%", "Гарантия 3 года"];
            prize = common[Math.floor(Math.random() * common.length)];
        }
    }

    users[userId].spun = true;
    users[userId].prize = prize;

    res.json({ prize });
});

app.listen(3000, () => {
    console.log("🔥 http://localhost:3000");
});
