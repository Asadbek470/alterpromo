async function spin(){
  if(!user) return alert("Avval ro‘yxatdan o‘ting");

  const wheel = document.getElementById("wheel");

  let r = await fetch("/spin",{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({id:user.id})
  });

  let d = await r.json();

  if(d.error) return alert(d.error);

  // 🎯 находим сектор
  let index = sectors.findIndex(s => d.prize.includes(s));
  if(index < 0) index = 0;

  let anglePer = 360 / sectors.length;
  let finalDeg = 360*5 + (360 - index*anglePer);

  wheel.style.transition = "transform 4s cubic-bezier(0.17, 0.67, 0.83, 0.67)";
  wheel.style.transform = `rotate(${finalDeg}deg)`;

  setTimeout(()=>{
    user.balance = d.balance;
    localStorage.user = JSON.stringify(user);

    update();

    document.getElementById("result").innerText = "🎁 " + d.prize;

    showCheck(d.prize);
    loadWinners();
  },4000);
}
