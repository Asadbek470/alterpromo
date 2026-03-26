const express = require("express");

const app = express();
app.use(express.json());
app.use(express.static("."));

let users = [];
let winners = [];
let rareGiven = false; // 🔥 редкий приз только 1 раз

// 🎯 призы
const prizes = [
  {name:"5% скидка", w:30},
  {name:"10% скидка", w:25},
  {name:"15% скидка", w:20},
  {name:"Сервис 3 года", w:10},

  {name:"🍳 Посуда", w:2},
  {name:"🍳 Tefal", w:2},

  {name:"500 кг угля", w:0.5},
  {name:"1 тонна угля", w:0.5},

  {name:"🔥 КОТЕЛ", w:0.01}
];

// 🎯 выбор
function getPrize(userId){
  // 🎯 счастливые пользователи
  if ([100,777,1000].includes(userId)) {
    return ["🍳 Посуда","🍳 Tefal","🔥 КОТЕЛ"][Math.floor(Math.random()*3)];
  }

  let total = prizes.reduce((s,p)=>s+p.w,0);
  let rand = Math.random()*total;

  for(let p of prizes){
    if(rand < p.w){
      // 🔥 редкий контроль
      if(p.name.includes("КОТЕЛ") && rareGiven){
        return "5% скидка";
      }

      if(p.name.includes("КОТЕЛ")){
        rareGiven = true;
      }

      return p.name;
    }
    rand -= p.w;
  }
}

// 👤 регистрация (1 раз)
app.post("/reg",(req,res)=>{
  let user = {
    id: users.length+1,
    balance: 50,
    spins: [],
    gotRare: false
  };

  users.push(user);
  res.json(user);
});

// 🎡 крутка
app.post("/spin",(req,res)=>{
  let {id} = req.body;

  let user = users.find(u=>u.id===id);
  if(!user) return res.send("error");

  // ⏳ лимит 2 раза в сутки
  let now = Date.now();
  user.spins = user.spins.filter(t=> now - t < 86400000);

  if(user.spins.length >= 2){
    return res.json({error:"Только 2 раза в сутки"});
  }

  user.spins.push(now);

  if(user.balance < 10){
    return res.json({error:"Нет монет"});
  }

  user.balance -= 10;

  let prize = getPrize(user.id);

  // 🏆 редкий только 1 раз
  if(
    (prize.includes("угля") || prize.includes("КОТЕЛ")) &&
    user.gotRare
  ){
    prize = "5% скидка";
  }

  if(prize.includes("угля") || prize.includes("КОТЕЛ")){
    user.gotRare = true;
  }

  if(prize.includes("КОТЕЛ")){
    winners.push({id:user.id, prize});
  }

  res.json({prize, balance:user.balance});
});

// 🏆 список
app.get("/win",(req,res)=>{
  res.json(winners);
});

app.listen(process.env.PORT || 3000);
