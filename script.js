let user=null;

const canvas = document.getElementById("wheel");
const ctx = canvas.getContext("2d");

const sectors = [
  "5%","10%","15%","Сервис",
  "Посуда","Tefal",
  "500кг","1т","КОТЕЛ"
];

function drawWheel(){
  let angle = 2*Math.PI/sectors.length;

  for(let i=0;i<sectors.length;i++){
    ctx.beginPath();
    ctx.moveTo(150,150);
    ctx.arc(150,150,150,i*angle,(i+1)*angle);
    ctx.fillStyle = i%2?"#ff9800":"#ffc107";
    ctx.fill();

    ctx.fillStyle="black";
    ctx.fillText(sectors[i],120,150);
  }
}
drawWheel();

async function register(){
  let r = await fetch("/reg",{method:"POST"});
  user = await r.json();
  localStorage.user = JSON.stringify(user);
  update();
}

function update(){
  document.getElementById("user").innerText =
    "👤 №"+user.id+" | 💰 "+user.balance;
}

async function spin(){
  if(!user) return alert("Сначала регистрация");

  canvas.style.transform="rotate("+(Math.random()*3000)+"deg)";

  setTimeout(async()=>{
    let r = await fetch("/spin",{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({id:user.id})
    });

    let d = await r.json();

    if(d.error) return alert(d.error);

    user.balance=d.balance;
    localStorage.user=JSON.stringify(user);

    update();

    document.getElementById("result").innerText="🎁 "+d.prize;

    showCheck(d.prize);
    loadWinners();

  },3000);
}

// чек + QR
function showCheck(prize){
  let text = `ID:${user.id} Приз:${prize}`;
  document.getElementById("checkText").innerText=text;

  QRCode.toCanvas(document.getElementById("qr"), text);

  document.getElementById("checkModal").style.display="flex";
}

function closeCheck(){
  document.getElementById("checkModal").style.display="none";
}

// победители
async function loadWinners(){
  let r = await fetch("/win");
  let data = await r.json();

  let html="";
  data.forEach(w=>{
    html+=`<div class="card">👤 #${w.id} 🎁 ${w.prize}</div>`;
  });

  document.getElementById("winners").innerHTML=html;
}

window.onload=()=>{
  if(localStorage.user){
    user=JSON.parse(localStorage.user);
    update();
  }
  loadWinners();
};
