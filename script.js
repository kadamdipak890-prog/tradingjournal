let trades = [];
let capital = 100000;

document.getElementById("tradeForm").addEventListener("submit", e => {
e.preventDefault();

let entry = +document.getElementById("entry").value;
let exitP = +document.getElementById("exit").value;
let qty = +document.getElementById("qty").value;

let pnl = (exitP - entry) * qty;
capital += pnl;

let basis = [];
document.querySelectorAll(".basis:checked").forEach(b=>basis.push(b.value));

let mistakes = [];
document.querySelectorAll(".mistake:checked").forEach(m=>mistakes.push(m.value));

let valid = basis.length >= 5 && emotion.value === "Calm";

trades.push({
date: date.value,
instrument: instrument.value,
type: type.value,
strategy: strategy.value,
pnl,
valid,
mistakes,
emotion: emotion.value
});

updateTable();
runAnalysis();
e.target.reset();
});

function updateTable(){
table.innerHTML="";
trades.forEach(t=>{
table.innerHTML+=`
<tr style="color:${t.pnl<0?'red':'green'}">
<td>${t.date}</td>
<td>${t.instrument}</td>
<td>${t.type}</td>
<td>${t.strategy}</td>
<td>${t.pnl}</td>
<td>${t.valid?'RULE ✔':'BREAK ❌'}</td>
</tr>`;
});
}

function runAnalysis(){
let total = trades.length;
let wins = trades.filter(t=>t.pnl>0).length;
let ruleWins = trades.filter(t=>t.valid && t.pnl>0).length;
let ruleTrades = trades.filter(t=>t.valid).length;

let mistakeCount = {};
trades.forEach(t=>{
t.mistakes.forEach(m=>{
mistakeCount[m]=(mistakeCount[m]||0)+1;
});
});

let worstMistake = Object.keys(mistakeCount)
.sort((a,b)=>mistakeCount[b]-mistakeCount[a])[0];

analysis.innerHTML = `
<h3>📊 Performance</h3>
<p>Total Trades: ${total}</p>
<p>Win Rate: ${((wins/total)*100||0).toFixed(2)}%</p>
<p>Rule Based Win Rate: ${((ruleWins/ruleTrades)*100||0).toFixed(2)}%</p>

<h3>❌ Mistake Analysis</h3>
<p>Most Frequent Mistake: <span class="bad">${worstMistake || "None"}</span></p>

<h3>🧠 Discipline</h3>
<p>Capital: ₹${capital}</p>
`;
}