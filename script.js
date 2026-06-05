//----------------
// 商品資料庫
//----------------
const imageDB = {
    1: { url: "https://storage-asset.msi.com/global/picture/product/product_1737437985481703a9fee920facd0e1a1babba2d7a.webp", title: "5090", desc: "200000" ,hint: "男人的夢想"},
    2: { url: "https://media.vogue.com.tw/photos/648a78a08eb58e2d8c0b8ad0/master/w_1600%2Cc_limit/mschf-microscopic-handbag-auction-4.jpg", title: "小皮包", desc: "1980000" , hint: "比拇指頭還小的時尚"},
    3: { url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS7qPH1OAVTRtBYgdq6A-f--kjKdH0Q-JPz6g&s", title: "黃金", desc: "2347888" , hint: "常帶指狗的排泄物"},
    4: { url: "https://oztetamigo.com/cdn/shop/files/image_a4457499-877e-4dcf-8d0d-38ef6b57b095.png?v=1772065597", title: "黑魔導女孩", desc: "9999" ,hint: "雙向特招並檢索"},
    5: { url:"https://cpop4u.com/cdn/shop/files/5_ade1fd85-4718-4af9-8451-701288ad58f1.jpg?v=1769657982" , title: "王下一桶" , desc: "990" , hint: "王下18桶"},
    6: { url:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTMMZY8Pirbr03Fh86IEgqrv4K0-pPUpOgCmg&s" , title: "熱水壺" , desc: "325" ,hint:"壺中能感受到生命與希望"},
    7:{ url:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQxKDkvfdCBZBfALJOOQkyEb7VQVWknOezWMA&s" ,title: "台積電股價" ,desc:"2371" , hint:"護國神山值得你信任"},
    8:{ url:"https://images.steamusercontent.com/ugc/16935058209020931573/F4F4E9CC72253773E8B94BA9CF98C991FB99480A/?imw=637&imh=358&ima=fit&impolicy=Letterbox&imcolor=%23000000&letterbox=true" ,title: "AWM" ,desc:"891111" , hint:"這槍聲有力氣"},
    9:{ url:"https://images.steamusercontent.com/ugc/16935058209020931573/F4F4E9CC72253773E8B94BA9CF98C991FB99480A/?imw=637&imh=358&ima=fit&impolicy=Letterbox&imcolor=%23000000&letterbox=true" ,title: "勞力士" ,desc:"384500" , hint:"身分地位的象徵"},
  10:{ url:"https://g-search3.alicdn.com/img/bao/uploaded/i4/i1/2273727618/O1CN01ASyp302696IQvmNOV_!!2273727618.jpg" ,title: "我女鵝" ,desc:"455" , hint:"特級萌物"},
};

Object.keys(imageDB).forEach(key => {
    const price = Number(imageDB[key].desc);
    if (price >= 1000000) {
        imageDB[key].rarity = "rare";
    } else if (price >= 100000) {
        imageDB[key].rarity = "gold";
    } else if (price >= 1) {
        imageDB[key].rarity = "green";
    }
});

//----------------
// 變數建立
//----------------
let count = 0;
let currentItem = null;
let currentDesc = 0;

let Aventurinepay = 0;
let Huangpay = 0;
let Buffettpay = 0;
let playerpay = 0;
let lastPlayerPay = 0;
let currentInputRaw = ""; 

const display = document.getElementById("display");
const turnXButton = document.querySelector(".turnX");
const maskWrapper = document.getElementById("maskWrapper");

//----------------
// 工具函式
//----------------
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function hideRandomTiles(amount) {
    const tiles = Array.from(maskWrapper.querySelectorAll(".tile")).filter(tile => tile.style.opacity !== "0");
    
    for (let i = 0; i < amount; i++) {
        if (tiles.length === 0) break;
        const randomIndex = Math.floor(Math.random() * tiles.length);
        const targetTile = tiles.splice(randomIndex, 1)[0];
        targetTile.style.opacity = "0"; 
        targetTile.style.pointerEvents = "none"; 
    }
}

function randomMultiplier(min, max) {
    return Math.random() * (max - min) + min;
}

function isOverMultiplier(value, others, multiplier) {
    return others.every(other => value > other * multiplier);
}

function saveRoundBids(round){

    document.getElementById(`Buffettoutput${round}`)
        .textContent = Buffettpay.toLocaleString();

    document.getElementById(`Huangoutput${round}`)
        .textContent = Huangpay.toLocaleString();

    document.getElementById(`Aventurineoutput${round}`)
        .textContent = Aventurinepay.toLocaleString();

    document.getElementById(`playeroutput${round}`)
        .textContent = playerpay.toLocaleString();
}

function updateNPC() {
    document.getElementById("Aventurineoutput").textContent = Aventurinepay.toLocaleString();
    document.getElementById("Huangoutput").textContent = Huangpay.toLocaleString();
    document.getElementById("Buffettoutput").textContent = Buffettpay.toLocaleString();
}

function updateTurnXButtonText() {
    if (!turnXButton) return;
    if (count === 0) {
        turnXButton.textContent = "x2";
    } else if (count === 1) {
        turnXButton.textContent = "x1.6";
    } else if (count === 2) {
        turnXButton.textContent = "x1";
    }
}


function formatToChineseUnit(numStr) {
    if (!numStr || isNaN(numStr)) return numStr;
    let num = Number(numStr);
    if (num < 10000) {
        return numStr;
    }
    let wan = Math.floor(num / 10000);
    let remainder = num % 10000;
    
    
    if (remainder === 0) {
        return wan + "萬";
    }
    return wan + "萬" + remainder;
}

async function revealBids() {
    document.getElementById("Buffettoutput").textContent = "?";
    document.getElementById("Huangoutput").textContent = "?";
    document.getElementById("Aventurineoutput").textContent = "?";
    document.getElementById("playeroutput").textContent = "?";

    await sleep(500);
    document.getElementById("Buffettoutput").textContent = Buffettpay.toLocaleString();

    await sleep(500);
    document.getElementById("Huangoutput").textContent = Huangpay.toLocaleString();

    await sleep(500);
    document.getElementById("Aventurineoutput").textContent = Aventurinepay.toLocaleString();

    await sleep(500);
    document.getElementById("playeroutput").textContent = playerpay.toLocaleString();
  
    await sleep(500);
}

function displayPriceDifference() {
   
    const oldDiffText = document.getElementById("playerPayDiffStatus");
    if (oldDiffText) oldDiffText.remove();

    const diffValue = playerpay - currentDesc;
    const timeH1 = document.getElementById("time").closest("h1");
    
    let diffHtml = "";
    if (diffValue < 0) {
        
        diffHtml = `
            <div id="playerPayDiffStatus" style="color: green; font-weight: bold; font-size: 1.2rem; margin-top: 10px;">
                價差: ${diffValue.toLocaleString()}<br>你簡直是嘉大巴菲特!
            </div>
        `;
    } else {
       
        diffHtml = `
            <div id="playerPayDiffStatus" style="color: red; font-weight: bold; font-size: 1.2rem; margin-top: 10px;">
                價差: +${diffValue.toLocaleString()}<br>別氣餒，它只是變成喜歡的樣子
            </div>
        `;
    }
    
    if (timeH1) {
        timeH1.insertAdjacentHTML("afterend", diffHtml);
    }
}

//----------------
// 換商品 
//----------------
function changeImage() {
    const keys = Object.keys(imageDB);
    const randomKey = keys[Math.floor(Math.random() * keys.length)];

    currentItem = imageDB[randomKey];
    currentDesc = Number(currentItem.desc);

    document.getElementById("randomImage").src = currentItem.url;
    
  
    const priceEl = document.getElementById("price");
    if (priceEl) priceEl.textContent = currentDesc.toLocaleString();

    count = 0;
    document.getElementById("time").textContent = "1";
    
    if (turnXButton) turnXButton.textContent = "x2";
    Aventurinepay = 0;
    Huangpay = 0;
    Buffettpay = 0;
    playerpay = 0;

    document.getElementById("Aventurineoutput").textContent = "?";
    document.getElementById("Huangoutput").textContent = "?";
    document.getElementById("Buffettoutput").textContent = "?";
    document.getElementById("playeroutput").textContent = "?";
    
    maskWrapper.innerHTML = ""; 
    maskWrapper.className = "overlay-wrapper"; 
    
    if (currentItem.rarity) {
        maskWrapper.classList.add(currentItem.rarity); 
    }

    for (let i = 0; i < 100; i++) {
        const tile = document.createElement("div");
        tile.className = "tile";
        maskWrapper.appendChild(tile);
    }
    for(let i=1;i<=3;i++){

    document.getElementById(`Buffettoutput${i}`).textContent="?";
    document.getElementById(`Huangoutput${i}`).textContent="?";
    document.getElementById(`Aventurineoutput${i}`).textContent="?";
    document.getElementById(`playeroutput${i}`).textContent="?";

     }

    clearDisplay();
    document.getElementById("hint").textContent = "";
    
    const oldDiffText = document.getElementById("playerPayDiffStatus");
    if (oldDiffText) oldDiffText.remove();
}

//----------------
// 計算機功能
//----------------
function appendValue(value) { 
    currentInputRaw += value;
    display.value = formatToChineseUnit(currentInputRaw);
}

function clearDisplay() { 
    currentInputRaw = ""; 
    display.value = ""; 
}

function deleteLast() { 
    currentInputRaw = currentInputRaw.slice(0, -1);
    display.value = formatToChineseUnit(currentInputRaw);
}

function calculate() {
    try { 
        let result = eval(currentInputRaw); 
        currentInputRaw = String(Math.round(result)); 
        display.value = formatToChineseUnit(currentInputRaw);
    } catch { 
        display.value = "Error";
        currentInputRaw = "";
    }
}

function turnX() {
    if (!currentInputRaw || display.value === "Error") return;
    
    let multiplier = 1;
    if (count === 0) {
        multiplier = 2;
    } else if (count === 1) {
        multiplier = 1.6;
    } else {
        multiplier = 1;
    }

    try {
        let currentNum = eval(currentInputRaw);
        if (!isNaN(currentNum)) {
            currentInputRaw = String(Math.round(currentNum * multiplier));
            display.value = formatToChineseUnit(currentInputRaw);
        }
    } catch { 
        display.value = "Error";
        currentInputRaw = "";
    }
}

function curent() {
    document.getElementById("playeroutput").textContent = lastPlayerPay ? lastPlayerPay.toLocaleString() : "0";
    currentInputRaw = lastPlayerPay ? String(lastPlayerPay) : "";
    display.value = formatToChineseUnit(currentInputRaw);
}

//----------------
// 出價主邏輯
//----------------
async function buy() {
    if (!currentItem) return;

    playerpay = Number(currentInputRaw); 
    if (isNaN(playerpay) || playerpay <= 0) { 
        alert("請輸入有效出價"); 
        return; 
    }

    lastPlayerPay = playerpay; 

    //----------------
    // 第一輪結束 -> 準備進入第二輪
    //----------------
    if (count === 0) {
        Aventurinepay = Math.round(currentDesc + currentDesc * randomMultiplier(0.75, 1.0));
        Huangpay = Math.round(currentDesc + currentDesc * randomMultiplier(0.5, 0.75));
        Buffettpay = Math.round(currentDesc + currentDesc * randomMultiplier(0.25, 0.5));

        await revealBids();
        saveRoundBids(1);
      
      if (isOverMultiplier(playerpay, [Aventurinepay, Huangpay, Buffettpay], 2)) {
            
            displayPriceDifference();

            
            setTimeout(() => {
                maskWrapper.innerHTML = ""; 
                setTimeout(() => {
                    alert("給我擦皮鞋"); 
                    changeImage();
                }, 500);
            }, 1000);
            return;
        }

        if (
            isOverMultiplier(Aventurinepay, [playerpay, Huangpay, Buffettpay], 2) ||
            isOverMultiplier(Huangpay, [playerpay, Aventurinepay, Buffettpay], 2) ||
            isOverMultiplier(Buffettpay, [playerpay, Aventurinepay, Huangpay], 2)
        ) {
            alert("小兒科"); changeImage(); return;
        }

        count++;
        updateTurnXButtonText();

        const tiles = maskWrapper.querySelectorAll(".tile");
      
        document.getElementById("time").textContent = count + 1;
       
        hideRandomTiles(5);
        clearDisplay();
    }

    //----------------
    // 第二輪結束 -> 準備進入第三輪
    //----------------
    else if (count === 1) {
        Aventurinepay = Math.round(currentDesc + currentDesc * randomMultiplier(0.5, 0.75));
        Huangpay = Math.round(currentDesc + currentDesc * randomMultiplier(0.25, 0.5));
        Buffettpay = Math.round(currentDesc + currentDesc * randomMultiplier(0.25, 0.5));

        await revealBids();
        saveRoundBids(2);
if (isOverMultiplier(playerpay, [Aventurinepay, Huangpay, Buffettpay], 1.6)) {
            
            displayPriceDifference();

            
            setTimeout(() => {
                maskWrapper.innerHTML = ""; 
                setTimeout(() => {
                    alert("給我擦皮鞋"); 
                    changeImage();
                }, 500);
            }, 1000);
            return;
        }
        if (
            isOverMultiplier(Aventurinepay, [playerpay, Huangpay, Buffettpay], 1.6) ||
            isOverMultiplier(Huangpay, [playerpay, Aventurinepay, Buffettpay], 1.6) ||
            isOverMultiplier(Buffettpay, [playerpay, Aventurinepay, Huangpay], 1.6)
        ) {
            alert("小兒科"); changeImage(); return;
        }

        count++;
        updateTurnXButtonText();
        document.getElementById("time").textContent = count + 1;
        document.getElementById("hint").textContent = "商品資訊：" + currentItem.hint;
        
        hideRandomTiles(5);
        clearDisplay();
    }

    //----------------
    // 第三輪結束
    //----------------
    else if (count === 2) {
        Aventurinepay = Math.round(currentDesc + currentDesc * randomMultiplier(0.05, 0.20));
        Huangpay = Math.round(currentDesc + currentDesc * randomMultiplier(0.05, 0.15));
        Buffettpay = Math.round(currentDesc + currentDesc * randomMultiplier(0.05, 0.10));

        await revealBids();
        saveRoundBids(3);

        maskWrapper.innerHTML = ""; 

      
        const maxBid = Math.max(playerpay, Aventurinepay, Huangpay, Buffettpay);

        if (playerpay === maxBid) {
            
            displayPriceDifference();
        }

      
        setTimeout(() => {
            if (playerpay === maxBid) {
                alert("給我擦皮鞋"); 
            } else {
                alert("我要驗牌"); 
            }
            changeImage();
        }, 1000);

        return; 
        
    }

    document.getElementById("time").textContent = count + 1;
    clearDisplay();
}

// 啟動初始化
changeImage();