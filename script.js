const ahtapotImg = document.getElementById('ahtapotImg');
const karidesImg = document.getElementById('karidesImg');
const canvas = document.getElementById('oyunAlani');
const ctx = canvas.getContext('2d');

// Arka plan resmi
const arkaPlanImg = document.getElementById('background');

// Ahtapotun başlangıç pozisyonu ve boyutu
let ahtapotX = canvas.width / 2;
let ahtapotY = canvas.height / 2;
const ahtapotBoyut = 20;

// Karideslerin başlangıç pozisyonu, boyutu ve sayısı
const karidesBoyut = 10;
const karidesSayisi = 25; 
let karidesler = [];

for (let i = 0; i < karidesSayisi; i++) {
  karidesler.push({
    x: Math.random() * (canvas.width - karidesBoyut),
    y: Math.random() * (canvas.height - karidesBoyut),
  });
}

// Ahtapotun hareket yönü
let dx = 0;
let dy = 0;

// Tuş kontrolü için event listener
document.addEventListener('keydown', yonDegistir);

function yonDegistir(e) {
  if (e.key === 'ArrowLeft' && dx === 0) {
    dx = -2;
    dy = 0;
  } else if (e.key === 'ArrowUp' && dy === 0) {
    dx = 0;
    dy = -2;
  } else if (e.key === 'ArrowRight' && dx === 0) {
    dx = 2;
    dy = 0;
  } else if (e.key === 'ArrowDown' && dy === 0) {
    dx = 0;
    dy = 2;
  }
}


// Dokunmatik kontrolü için event listener'lar
canvas.addEventListener('touchstart', dokunmaBasladi);
canvas.addEventListener('touchmove', dokunmaHareket);
canvas.addEventListener('touchend', dokunmaBitti);

function dokunmaBasladi(e) {
  e.preventDefault(); 
  const dokunma = e.touches[0]; 
  yonBelirle(dokunma.clientX, dokunma.clientY);
}

function dokunmaHareket(e) {
  e.preventDefault(); 
  const dokunma = e.touches[0];
  yonBelirle(dokunma.clientX, dokunma.clientY);
}

function dokunmaBitti(e) {
  e.preventDefault(); 
  dx = 0; 
  dy = 0;
}

function yonBelirle(x, y) {
  const canvasRect = canvas.getBoundingClientRect();
  const relatifX = x - canvasRect.left; 
  const relatifY = y - canvasRect.top; 

  if (relatifX < canvas.width / 2) {
    dx = -2; 
  } else {
    dx = 2; 
  }

  if (relatifY < canvas.height / 2) {
    dy = -2; 
  } else {
    dy = 2;
  }
}


let puan = 0;
let oyunBitti = false;

// Oyun başladığında süreyi başlat
let baslangicZamani = Date.now();

const oyunSuresi = 23 * 1000; // 23 saniye

let kalanSure;

function ekranBoyutunuAyarla() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    // Ahtapotun hızını veya diğer değişkenleri ayarla
  }
  
  window.addEventListener('resize', ekranBoyutunuAyarla);
  ekranBoyutunuAyarla(); // Başlangıçta ayarla 


function ciz() {
    const kuponImg = document.getElementById('kuponImg');
  if (!oyunBitti) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.drawImage(arkaPlanImg, 0, 0, canvas.width, canvas.height);

    for (let i = 0; i < karidesler.length; i++) {
      ctx.drawImage(karidesImg, karidesler[i].x, karidesler[i].y, karidesBoyut, karidesBoyut);

      if (
        ahtapotX < karidesler[i].x + karidesBoyut &&
        ahtapotX + ahtapotBoyut > karidesler[i].x &&
        ahtapotY < karidesler[i].y + karidesBoyut &&
        ahtapotY + ahtapotBoyut > karidesler[i].y
      ) {
        karidesler[i].x = Math.random() * (canvas.width - karidesBoyut);
        karidesler[i].y = Math.random() * (canvas.height - karidesBoyut);
        puan++;
      }
    }

    ctx.drawImage(ahtapotImg, ahtapotX, ahtapotY, ahtapotBoyut, ahtapotBoyut);

    ahtapotX += dx;
    ahtapotY += dy;

    ahtapotX = Math.max(ahtapotBoyut / 2, Math.min(ahtapotX, canvas.width - ahtapotBoyut / 2));
  ahtapotY = Math.max(ahtapotBoyut / 2, Math.min(ahtapotY, canvas.height - ahtapotBoyut / 2));

    if (ahtapotX + ahtapotBoyut > canvas.width || ahtapotX - ahtapotBoyut < 0) {
      dx = -dx;
    }
    if (ahtapotY + ahtapotBoyut > canvas.height || ahtapotY - ahtapotBoyut < 0) {
      dy = -dy;
    }

    ctx.font = "16px Arial";
    ctx.fillStyle = "black";

    kalanSure = Math.round((oyunSuresi - (Date.now() - baslangicZamani)) / 1000);

    ctx.fillText("Puan: " + puan + " Süre: " + kalanSure, 10, 20);


    if (puan >= karidesSayisi) { 
      oyunBitti = true;
      ctx.font = "30px Arial";
      ctx.fillStyle = "black";
      const kazandinizText = "Kazandınız!";
    const kazandinizTextWidth = ctx.measureText(kazandinizText).width;
    ctx.fillText(kazandinizText, canvas.width / 2 - kazandinizTextWidth / 2, canvas.height / 2 - 80);
    // Kupon resmini göster
    kuponImg.style.display = "block";
    kuponImg.style.position = "absolute";
    kuponImg.style.top = "60%"; // "Kazandınız!" mesajının altına yerleştirmek için
    kuponImg.style.left = "50%";
    kuponImg.style.transform = "translate(-50%, -50%)"; 
    } else if (Date.now() - baslangicZamani >= oyunSuresi) {
      oyunBitti = true;
      ctx.font = "30px Arial";
      ctx.fillStyle = "black";
      const kaybettinizText = "Kaybettiniz!";
      const textWidth = ctx.measureText(kaybettinizText).width;
      ctx.fillText(kaybettinizText, canvas.width / 2 - textWidth / 2, canvas.height / 2 - 80); // Y koordinatını ayarlayarak yukarı taşıdık
    }
  } else { 
    let tekrarDeneButonu = document.getElementById("tekrarDeneButonu");
    tekrarDeneButonu.style.display = "block";
    tekrarDeneButonu.style.position = "absolute";
    tekrarDeneButonu.style.top = "50%";
    tekrarDeneButonu.style.left = "50%";
    tekrarDeneButonu.style.transform = "translate(-50%, -50%)";
    tekrarDeneButonu.style.zIndex = 2; // z-index eklendi

    tekrarDeneButonu.onclick = function () {
        kuponImg.style.display = "none";
      puan = 0;
      oyunBitti = false;
      baslangicZamani = Date.now(); 
      ahtapotX = canvas.width / 2; 
      ahtapotY = canvas.height / 2;
      dx = 0; 
      dy = 0;
      karidesler = []; 
      for (let i = 0; i < karidesSayisi; i++) {
        karidesler.push({
          x: Math.random() * (canvas.width - karidesBoyut),
          y: Math.random() * (canvas.height - karidesBoyut),
        });
      }
      tekrarDeneButonu.style.display = "none"; 
    };
  }

  requestAnimationFrame(ciz);
}

ciz(); // Oyunu başlat