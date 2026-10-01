let sb=null,authMode="login",currentType="expense",currentView="overview";
let state={profile:null,transactions:[],categories:[],budgets:[],goals:[]};
const builtIn=[["Food & Feeding","🍽️"],["Transport","🚗"],["Data & Airtime","📱"],["Bills","🧾"],["School","🎓"],["Shopping","🛍️"],["Entertainment","🎮"],["Health","❤️"],["Family","👨‍👩‍👧"],["Savings","🏦"],["Other","•"]];
const $=id=>document.getElementById(id);
const money=n=>new Intl.NumberFormat(undefined,{style:"currency",currency:state.profile?.currency||"NGN",maximumFractionDigits:2}).format(Number(n)||0);
const esc=s=>String(s??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]));
const today=()=>new Date().toISOString().slice(0,10);
const dateText=d=>new Date(d+"T00:00:00").toLocaleDateString(undefined,{day:"numeric",month:"short",year:"numeric"});
const sum=a=>a.reduce((x,y)=>x+Number(y.amount||0),0);
const exp=a=>sum(a.filter(t=>t.type==="expense"));
const inc=a=>sum(a.filter(t=>t.type==="income"));
const monthTx=()=>state.transactions.filter(t=>t.transaction_date.slice(0,7)===today().slice(0,7));
const cats=()=>[...builtIn.map(x=>({name:x[0],icon:x[1]})),...state.categories.map(x=>({name:x.name,icon:x.icon||"✦"}))].filter((x,i,a)=>a.findIndex(y=>y.name.toLowerCase()===x.name.toLowerCase())===i);
const catTotals=a=>{let o={};a.filter(t=>t.type==="expense").forEach(t=>o[t.category]=(o[t.category]||0)+Number(t.amount));return o};
function toast(m){$("toast").textContent=m;$("toast").classList.add("show");setTimeout(()=>$("toast").classList.remove("show"),2500)}
async function init(){
  try{const r=await fetch("/api/config"),c=await r.json();if(!c.ok)throw Error(c.error);
    sb=window.supabase.createClient(c.supabaseUrl,c.supabaseKey);
    const {data:{session}}=await sb.auth.getSession();
    if(session)await enter(session);else showAuth();
    sb.auth.onAuthStateChange(async(_,s)=>s?await enter(s):showAuth());
  }catch(e){$("authMessage").textContent=e.message}
}
function showAuth(){$("authScreen").classList.remove("hidden");$("appShell").classList.add("hidden")}
async function enter(session){$("authScreen").classList.add("hidden");$("appShell").classList.remove("hidden");$("userEmail").textContent=session.user.email||"Account";await load();render()}
async function load(){
  const uid=(await sb.auth.getUser()).data.user.id;
  const q=await Promise.all([
    sb.from("profiles").select("*").eq("id",uid).maybeSingle(),
    sb.from("transactions").select("*").eq("user_id",uid).order("transaction_date",{ascending:false}).order("created_at",{ascending:false}),
    sb.from("categories").select("*").eq("user_id",uid).order("name"),
    sb.from("budgets").select("*").eq("user_id",uid).order("created_at",{ascending:false}),
    sb.from("goals").select("*").eq("user_id",uid).order("created_at",{ascending:false})
  ]);
  q.forEach(x=>{if(x.error)throw x.error});
  state.profile=q[0].data||{id:uid,display_name:"",currency:"NGN"};state.transactions=q[1].data||[];state.categories=q[2].data||[];state.budgets=q[3].data||[];state.goals=q[4].data||[];
  if(!q[0].data)await sb.from("profiles").insert(state.profile);
}
  async function init(){
  try{
    const supabaseUrl="https://cgnlmbsdtqbkajtkqssm.supabase.co";
    const supabaseKey="sb_publishable_k51uAkJt_K5K0SdMM5twdg_eada8Jtg";

    if(!supabaseUrl || !supabaseKey){
      throw new Error("Supabase configuration is missing.");
    }

    sb=window.supabase.createClient(supabaseUrl,supabaseKey);

    const {data:{session},error}=await sb.auth.getSession();
    if(error) throw error;

    if(session) await enter(session);
    else showAuth();

    sb.auth.onAuthStateChange(async(_,s)=>{
      if(s) await enter(s);
      else showAuth();
    });

  }catch(e){
    console.error("FinMemory initialization error:",e);
    $("authMessage").textContent=e.message||"Unable to connect to FinMemory.";
  }
} 
 function render(){
  const labels={
    overview:"Overview",
    diary:"Money Diary",
    calendar:"Money Calendar",
    replay:"Money Replay",
    patterns:"Patterns",
    detective:"Money Detective",
    forecast:"Forecast",
    budgets:"Budgets",
    goals:"Goals",
    recurring:"Recurring",
    calculator:"Money Calculator",
    assistant:"Money Assistant",
    settings:"Settings"
  };

  /* Add Calculator to navigation if it isn't already there */
  const nav=$("nav");
  if(nav && !nav.querySelector('[data-view="calculator"]')){
    const assistant=nav.querySelector('[data-view="assistant"]');
    const button=document.createElement("button");
    button.className="nav-item";
    button.dataset.view="calculator";
    button.innerHTML="＋ <span>Money Calculator</span>";
    if(assistant) nav.insertBefore(button,assistant);
    else nav.appendChild(button);
  }

  document.querySelectorAll(".nav-item").forEach(b=>{
    b.classList.toggle("active",b.dataset.view===currentView);
  });

  $("pageTitle").textContent=labels[currentView]||"Overview";

  try{
    const view=views[currentView]||views.overview;
    $("content").innerHTML=view();

    if(currentView==="diary"){
      diaryResults();
    }
  }catch(error){
    console.error("FinMemory section error:",error);

    $("content").innerHTML=`
      <div class="card">
        <h3>This section needs another moment</h3>
        <p class="muted">
          FinMemory couldn't display this section right now.
          Your saved financial records are still protected.
        </p>
        <button class="primary" id="retryRender">Try again</button>
      </div>
    `;
  }
}


/* ---------- DISPLAY HELPERS ---------- */

function stat(label,value,tone=""){
  return `
    <div class="stat">
      <span class="muted">${esc(label)}</span>
      <strong class="${tone}">${esc(value)}</strong>
    </div>
  `;
}

function bars(data){
  const entries=Object.entries(data||{});

  if(!entries.length){
    return `<div class="empty">No spending recorded yet.</div>`;
  }

  const max=Math.max(...entries.map(([,v])=>Number(v)||0),1);

  return `
    <div class="bars">
      ${entries
        .sort((a,b)=>Number(b[1])-Number(a[1]))
        .map(([name,value])=>`
          <div class="bar-row">
            <div class="row">
              <span>${esc(name)}</span>
              <b>${money(value)}</b>
            </div>
            <div class="progress">
              <i style="width:${Math.max(3,(Number(value)/max)*100)}%"></i>
            </div>
          </div>
        `).join("")}
    </div>
  `;
}

function txRow(t){
  return `
    <div class="list-row">
      <div>
        <div class="row-title">${esc(t.title)}</div>
        <div class="row-sub">
          ${dateText(t.transaction_date)}
          · ${esc(t.category)}
          ${t.note?" · "+esc(t.note):""}
        </div>
      </div>

      <div class="amount ${t.type==="income"?"positive":"negative"}">
        ${t.type==="income"?"+":"−"}${money(t.amount)}
      </div>
    </div>
  `;
}

async function refresh(){
  try{
    await load();
    render();
  }catch(error){
    console.error("FinMemory refresh error:",error);
    toast("Couldn't refresh your financial data.");
  }
}


/* ---------- VIEWS ---------- */

const views={};

views.overview=()=>{
  const t=monthTx();
  const i=inc(t);
  const e=exp(t);
  const c=catTotals(t);
  const top=Object.entries(c).sort((a,b)=>b[1]-a[1])[0];
  const recent=state.transactions.slice(0,6);

  return `
    <div class="hero">
      <p class="eyebrow">YOUR MONEY STORY</p>

      <h3>
        See where your money went — and remember why.
      </h3>

      <p>
        FinMemory turns individual transactions into a searchable
        personal money history.
      </p>

      <div class="hero-actions">
        <button class="primary" id="heroAdd">+ Record money</button>
        <button class="ghost" id="heroDiary">Open diary</button>
      </div>
    </div>

    <div class="grid stats">
      ${stat("This month's income",money(i),"positive")}
      ${stat("This month's spending",money(e),"negative")}
      ${stat("Net this month",money(i-e),i>=e?"positive":"negative")}
      ${stat("Largest category",top?esc(top[0]):"—")}
    </div>

    <div class="grid section-grid" style="margin-top:16px">

      <div class="card">
        <div class="card-head">
          <h3>Recent memories</h3>
          <button class="ghost" id="openDiary">View all</button>
        </div>

        <div class="list">
          ${
            recent.length
              ? recent.map(txRow).join("")
              : `<div class="empty">Your first money memory is waiting.</div>`
          }
        </div>
      </div>

      <div class="card">
        <div class="card-head">
          <h3>Spending pulse</h3>
        </div>

        ${bars(c)}
      </div>

    </div>
  `;
};


views.diary=()=>`
  <div class="card">

    <div class="toolbar">

      <input
        class="search"
        id="diarySearch"
        placeholder="Search memories, notes, tags, dates…"
      >

      <select class="search" id="diaryType">
        <option value="">All types</option>
        <option value="expense">Expenses</option>
        <option value="income">Income</option>
      </select>

      <select class="search" id="diaryCat">
        <option value="">All categories</option>
        ${cats().map(c=>`
          <option value="${esc(c.name)}">
            ${esc(c.name)}
          </option>
        `).join("")}
      </select>

      <button class="primary" id="diaryAdd">+ Record</button>

    </div>

    <div class="notice">
      Money Memory searches titles, categories, notes, tags, dates and amounts.
    </div>

    <div id="diaryResults" class="list" style="margin-top:10px"></div>

  </div>
`;


views.calendar=()=>{
  const n=new Date();
  const y=n.getFullYear();
  const m=n.getMonth();

  const first=new Date(y,m,1);
  const last=new Date(y,m+1,0);

  let h=`
    <div class="card">

      <div class="card-head">
        <h3>
          ${first.toLocaleDateString(undefined,{
            month:"long",
            year:"numeric"
          })}
        </h3>

        <button class="primary" id="calAdd">+ Record</button>
      </div>

      <div class="calendar">

        ${["Sun","Mon","Tue","Wed","Thu","Fri","Sat"]
          .map(x=>`<div class="cal-head">${x}</div>`)
          .join("")}
  `;

  for(let i=0;i<first.getDay();i++){
    h+=`<div class="day muted-day"></div>`;
  }

  for(let d=1;d<=last.getDate();d++){

    const k=
      `${y}-${String(m+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;

    const value=exp(
      state.transactions.filter(
        t=>t.transaction_date===k
      )
    );

    h+=`
      <div class="day">
        <strong>${d}</strong>
        ${
          value
            ? `<span class="dot">−${money(value)}</span>`
            : ""
        }
      </div>
    `;
  }

  return h+`
      </div>
    </div>
  `;
};


views.replay=()=>{
  const a=monthTx().sort(
    (x,y)=>x.transaction_date.localeCompare(y.transaction_date)
  );

  return `
    <div class="card">

      <div class="card-head">
        <div>
          <h3>Money Replay</h3>
          <span class="muted">
            This month as a chronological story
          </span>
        </div>
      </div>

      <div class="timeline">

        ${
          a.length
            ? a.map(t=>`
                <div class="timeline-item">

                  <div class="row-title">
                    ${esc(t.title)}
                  </div>

                  <div class="row-sub">
                    ${dateText(t.transaction_date)}
                    · ${esc(t.category)}
                    ${t.note?" · "+esc(t.note):""}
                  </div>

                  <div class="amount ${t.type==="income"?"positive":"negative"}">
                    ${t.type==="income"?"+":"−"}${money(t.amount)}
                  </div>

                </div>
              `).join("")
            : `<div class="empty">
                Nothing recorded this month yet.
              </div>`
        }

      </div>
    </div>
  `;
};


views.patterns=()=>{
  const t=monthTx();
  const c=catTotals(t);
  const i=inc(t);
  const e=exp(t);
  const days={};

  t.filter(x=>x.type==="expense").forEach(x=>{
    const d=new Date(
      x.transaction_date+"T00:00:00"
    ).toLocaleDateString(
      undefined,
      {weekday:"long"}
    );

    days[d]=(days[d]||0)+Number(x.amount);
  });

  const top=Object.entries(days)
    .sort((a,b)=>b[1]-a[1])[0];

  return `
    <div class="grid stats">

      ${stat(
        "Savings rate",
        i
          ? Math.max(0,(i-e)/i*100).toFixed(1)+"%"
          : "—",
        "positive"
      )}

      ${stat("Transactions",t.length)}

      ${stat(
        "Categories used",
        Object.keys(c).length
      )}

      ${stat(
        "Top day",
        top?top[0]:"—"
      )}

    </div>

    <div class="grid two" style="margin-top:16px">

      <div class="card">
        <h3>Category pattern</h3>
        ${bars(c)}
      </div>

      <div class="card">
        <h3>Day-of-week pattern</h3>

        ${
          top
            ? `
              <p class="kpi">${esc(top[0])}</p>
              <p class="muted">
                ${money(top[1])} spent on your
                highest-spend weekday this month.
              </p>
            `
            : `
              <div class="empty">
                Not enough data yet.
              </div>
            `
        }

      </div>

    </div>
  `;
};


views.detective=()=>{
  const t=monthTx();
  const e=t.filter(x=>x.type==="expense");
  const c=catTotals(t);

  const top=Object.entries(c)
    .sort((a,b)=>b[1]-a[1])[0];

  const big=e
    .slice()
    .sort((a,b)=>Number(b.amount)-Number(a.amount))[0];

  const missing=t.filter(x=>!x.note).length;

  return `
    <div class="grid two">

      <div class="finding">
        <b>Largest category</b>
        <span class="muted">
          ${
            top
              ? `${esc(top[0])} · ${money(top[1])}`
              : "No spending yet."
          }
        </span>
      </div>

      <div class="finding">
        <b>Biggest expense</b>
        <span class="muted">
          ${
            big
              ? `${esc(big.title)} · ${money(big.amount)}`
              : "No expenses yet."
          }
        </span>
      </div>

      <div class="finding">
        <b>Memory quality</b>
        <span class="muted">
          ${
            missing
              ? `${missing} record(s) have no note.`
              : "Your recent records have useful context."
          }
        </span>
      </div>

      <div class="finding">
        <b>Pattern watch</b>
        <span class="muted">
          ${
            e.length>=5
              ? "You have enough recent spending data for stronger analysis."
              : "Keep recording more transactions for stronger evidence."
          }
        </span>
      </div>

    </div>
  `;
};


views.forecast=()=>{
  const i=inc(monthTx());
  const e=exp(monthTx());

  const daily=
    e/Math.max(1,new Date().getDate());

  const projected=
    i-daily*30;

  return `
    <div class="hero">

      <p class="eyebrow">30-DAY MONEY WEATHER</p>

      <h3>${money(projected)}</h3>

      <p>
        A simple planning estimate based on this month's
        recorded income and average daily spending.
      </p>

    </div>

    <div class="grid two">

      <div class="card">
        <h3>Average daily spending</h3>
        <p class="kpi">${money(daily)}</p>
      </div>

      <div class="card">
        <h3>Current-month net</h3>
        <p class="kpi">${money(i-e)}</p>
      </div>

    </div>
  `;
};


views.budgets=()=>`
  <div class="card">

    <div class="card-head">
      <h3>Your budgets</h3>
      <button class="primary" id="addBudget">
        + Add budget
      </button>
    </div>

    ${
      state.budgets.length
        ? state.budgets.map(b=>{
            const s=exp(
              monthTx().filter(
                t=>t.category===b.category
              )
            );

            const p=Math.min(
              100,
              s/Number(b.amount||1)*100
            );

            return `
              <div class="goal">

                <div class="row">

                  <div>
                    <b>${esc(b.category)}</b>

                    <div class="row-sub">
                      ${money(s)} of ${money(b.amount)}
                    </div>
                  </div>

                  <b>${p.toFixed(0)}%</b>

                </div>

                <div class="progress">
                  <i style="width:${p}%"></i>
                </div>

              </div>
            `;
          }).join("")
        : `
          <div class="empty">
            No budgets yet.
          </div>
        `
    }

  </div>
`;


views.goals=()=>`
  <div class="card">

    <div class="card-head">
      <h3>Savings goals</h3>

      <button class="primary" id="addGoal">
        + Add goal
      </button>
    </div>

    ${
      state.goals.length
        ? state.goals.map(g=>{
            const p=Math.min(
              100,
              Number(g.saved_amount||0)/
              Number(g.target_amount||1)*100
            );

            return `
              <div class="goal">

                <div class="row">

                  <div>
                    <b>${esc(g.name)}</b>

                    <div class="row-sub">
                      ${money(g.saved_amount||0)}
                      saved of
                      ${money(g.target_amount)}
                    </div>
                  </div>

                  <b>${p.toFixed(0)}%</b>

                </div>

                <div class="progress">
                  <i style="width:${p}%"></i>
                </div>

              </div>
            `;
          }).join("")
        : `
          <div class="empty">
            No goals yet.
          </div>
        `
    }

  </div>
`;


views.recurring=()=>`
  <div class="card">

    <h3>Recurring money</h3>

    <p class="muted">
      Keep track of payments and income that repeat.
      Automation will be added in a future feature pass.
    </p>

  </div>
`;


/* ---------- CALCULATOR ---------- */

 views.calculator=()=>`
  <div class="calculator-layout">

    <div class="calculator-card">
      <div class="calculator-header">
        <div>
          <p class="eyebrow">MONEY TOOL</p>
          <h3>Quick Calculator</h3>
          <p class="calculator-subtitle">
            Simple calculations without leaving FinMemory.
          </p>
        </div>

        <div class="calculator-icon">＋</div>
      </div>

      <div class="calculator-fields">

        <div class="calc-field">
          <label for="calcA">First number</label>
          <input
            class="calc-input"
            id="calcA"
            type="number"
            step="any"
            placeholder="0"
          >
        </div>

        <div class="calc-field">
          <label for="calcOp">Operation</label>

          <select id="calcOp" class="calc-input">
            <option value="+">＋ Add</option>
            <option value="-">− Subtract</option>
            <option value="*">× Multiply</option>
            <option value="/">÷ Divide</option>
            <option value="%">% Percentage of</option>
          </select>
        </div>

        <div class="calc-field">
          <label for="calcB">Second number</label>
          <input
            class="calc-input"
            id="calcB"
            type="number"
            step="any"
            placeholder="0"
          >
        </div>

      </div>

      <button class="calc-button" id="calculateBtn">
        Calculate
        <span>→</span>
      </button>

      <div id="calcResult" class="calc-result">
        <span class="calc-result-label">RESULT</span>
        <strong>Ready when you are</strong>
        <small>Enter your numbers and choose an operation.</small>
      </div>
    </div>


    <div class="calculator-card tools-card">

      <div class="calculator-header">
        <div>
          <p class="eyebrow">MONEY TOOL</p>
          <h3>Percentage Tool</h3>
          <p class="calculator-subtitle">
            Useful for discounts, fees and quick estimates.
          </p>
        </div>

        <div class="calculator-icon">%</div>
      </div>

      <div class="calculator-fields">

        <div class="calc-field">
          <label for="calcMoney">Amount</label>
          <input
            class="calc-input"
            id="calcMoney"
            type="number"
            step="any"
            placeholder="0.00"
          >
        </div>

        <div class="calc-field">
          <label for="calcPercent">Percentage</label>
          <input
            class="calc-input"
            id="calcPercent"
            type="number"
            step="any"
            placeholder="10"
          >
        </div>

      </div>

      <button class="calc-secondary-button" id="discountBtn">
        Calculate percentage
        <span>→</span>
      </button>

      <div id="discountResult" class="calc-result secondary-result">
        <span class="calc-result-label">RESULT</span>
        <strong>Nothing calculated yet</strong>
        <small>Enter an amount and percentage above.</small>
      </div>

    </div>

  </div>
`;


/* ---------- MONEY ASSISTANT ---------- */

views.assistant=()=>`
  <div class="grid two">

    <div class="card">

      <h3>Money Assistant</h3>

      <p class="muted">
        Ask questions about the financial records you've saved in FinMemory.
      </p>

      <div class="toolbar">

        <input
          class="search"
          id="ask"
          placeholder="How much did I spend this month?"
        >

        <button class="primary" id="askBtn">
          Ask
        </button>

      </div>

      <div id="answer" class="assistant-answer">
        Try asking about spending, income, your biggest category,
        balance, savings, or a category.
      </div>

    </div>

    <div class="card">

      <h3>Quick questions</h3>

      <p class="muted">
        You can ask things like:
      </p>

      <div class="list">

        <button class="ghost assistant-question">
          How much did I spend this month?
        </button>

        <button class="ghost assistant-question">
          How much income did I record?
        </button>

        <button class="ghost assistant-question">
          What is my biggest spending category?
        </button>

        <button class="ghost assistant-question">
          What is my net this month?
        </button>

      </div>

    </div>

  </div>
`;


/* ---------- SETTINGS ---------- */

 views.settings=()=>`
  <div class="settings-layout">

    <div class="settings-intro">
      <div>
        <p class="eyebrow">PERSONAL SPACE</p>
        <h3>Settings</h3>
        <p>
          Make FinMemory feel like your own financial workspace.
        </p>
      </div>
    </div>


    <div class="settings-card settings-profile-card">

      <div class="settings-card-head">
        <div class="settings-icon">◎</div>

        <div>
          <h3>Your profile</h3>
          <p>
            Personalize your FinMemory account.
          </p>
        </div>
      </div>

      <div class="settings-fields">

        <div class="settings-field">
          <label for="profileName">Display name</label>

          <input
            id="profileName"
            value="${esc(state.profile?.display_name||"")}"
            placeholder="Your name"
          >

          <small>
            This is the name FinMemory will use for you.
          </small>
        </div>


        <div class="settings-field">
          <label for="profileCurrency">Currency</label>

          <select id="profileCurrency">

            <option value="NGN" ${state.profile?.currency==="NGN"?"selected":""}>
              NGN — Nigerian Naira
            </option>

            <option value="USD" ${state.profile?.currency==="USD"?"selected":""}>
              USD — US Dollar
            </option>

            <option value="GBP" ${state.profile?.currency==="GBP"?"selected":""}>
              GBP — British Pound
            </option>

            <option value="EUR" ${state.profile?.currency==="EUR"?"selected":""}>
              EUR — Euro
            </option>

            <option value="GHS" ${state.profile?.currency==="GHS"?"selected":""}>
              GHS — Ghanaian Cedi
            </option>

            <option value="KES" ${state.profile?.currency==="KES"?"selected":""}>
              KES — Kenyan Shilling
            </option>

            <option value="ZAR" ${state.profile?.currency==="ZAR"?"selected":""}>
              ZAR — South African Rand
            </option>

          </select>

          <small>
            FinMemory uses this when displaying your money.
          </small>
        </div>

      </div>

      <div class="settings-card-actions">
        <button class="settings-save" id="saveProfile">
          Save profile
          <span>→</span>
        </button>
      </div>

    </div>


    <div class="settings-grid">


      <div class="settings-card">

        <div class="settings-card-head">
          <div class="settings-icon">▣</div>

          <div>
            <h3>Your data</h3>
            <p>
              Your financial history at a glance.
            </p>
          </div>
        </div>

        <div class="settings-stats">

          <div class="settings-stat">
            <strong>${state.transactions.length}</strong>
            <span>Money memories</span>
          </div>

          <div class="settings-stat">
            <strong>${cats().length}</strong>
            <span>Categories</span>
          </div>

        </div>

        <button class="settings-outline-button" id="exportData">
          Export my data
          <span>↓</span>
        </button>

      </div>


      <div class="settings-card">

        <div class="settings-card-head">
          <div class="settings-icon">✦</div>

          <div>
            <h3>FinMemory</h3>
            <p>
              Built around remembering your money.
            </p>
          </div>
        </div>

        <div class="settings-info">

          <div>
            <span>Account</span>
            <strong>${esc($("userEmail")?.textContent||"Signed in")}</strong>
          </div>

          <div>
            <span>Security</span>
            <strong>Protected with Supabase RLS</strong>
          </div>

        </div>

      </div>


    </div>


    <div class="settings-card">

      <div class="settings-card-head">
        <div class="settings-icon">⌁</div>

        <div>
          <h3>Quick access</h3>
          <p>
            Jump directly to your most-used tools.
          </p>
        </div>
      </div>

      <div class="settings-tools">

        <button class="settings-tool" id="settingsDiary">
          <span>✦</span>
          <div>
            <strong>Money Diary</strong>
            <small>Review your financial memories</small>
          </div>
          <b>→</b>
        </button>

        <button class="settings-tool" id="settingsCalendar">
          <span>▦</span>
          <div>
            <strong>Money Calendar</strong>
            <small>See your spending across time</small>
          </div>
          <b>→</b>
        </button>

        <button class="settings-tool" id="settingsCalculator">
          <span>＋</span>
          <div>
            <strong>Money Calculator</strong>
            <small>Run quick financial calculations</small>
          </div>
          <b>→</b>
        </button>

      </div>

    </div>

  </div>
`;

/* ---------- TRANSACTION ---------- */

function openTx(){

  $("txDate").value=today();
  $("txAmount").value="";
  $("txTitle").value="";
  $("txNote").value="";
  $("txTags").value="";

  currentType="expense";

  document.querySelectorAll(".type-btn").forEach(b=>{
    b.classList.toggle(
      "active",
      b.dataset.type===currentType
    );
  });

  $("txCategory").innerHTML=cats()
    .map(c=>`
      <option value="${esc(c.name)}">
        ${c.icon} ${esc(c.name)}
      </option>
    `)
    .join("");

  $("transactionModal").classList.remove("hidden");
}


async function saveTx(){

  try{

    const user=(await sb.auth.getUser()).data.user;

    let category=$("txCategory").value;

    /*
      If Other is selected, let the user describe what
      the spending actually was.
    */
    if(category==="Other"){

      const custom=prompt(
        "What was this spending for?"
      );

      if(custom===null){
        return;
      }

      if(custom.trim()){
        category=custom.trim();
      }
    }

    const row={
      user_id:user.id,
      type:currentType,
      amount:Number($("txAmount").value),
      title:$("txTitle").value.trim(),
      category,
      transaction_date:$("txDate").value,
      note:$("txNote").value.trim()||null,
      tags:$("txTags").value
        .split(",")
        .map(x=>x.trim())
        .filter(Boolean)
    };

    if(!row.amount || !row.title){
      return toast("Add an amount and title.");
    }

    const {error}=await sb
      .from("transactions")
      .insert(row);

    if(error){
      return toast(error.message);
    }

    $("transactionModal").classList.add("hidden");

    toast("Money memory saved.");

    await refresh();

  }catch(error){

    console.error("Transaction error:",error);

    toast(
      "We couldn't save that money memory."
    );
  }
}


/* ---------- DIARY ---------- */

function diaryResults(){

  const q=(
    $("diarySearch")?.value||""
  ).toLowerCase();

  const ty=$("diaryType")?.value||"";
  const ca=$("diaryCat")?.value||"";

  let a=state.transactions.filter(t=>
    (!ty||t.type===ty)&&
    (!ca||t.category===ca)
  );

  if(q){

    a=a.filter(t=>
      [
        t.title,
        t.category,
        t.note,
        t.tags?.join(" "),
        t.transaction_date,
        t.amount
      ]
      .join(" ")
      .toLowerCase()
      .includes(q)
    );

  }

  const results=$("diaryResults");

  if(!results)return;

  results.innerHTML=a.length
    ? a.map(txRow).join("")
    : `<div class="empty">No memories match.</div>`;
}


/* ---------- PROFILE ---------- */

async function saveProfile(){

  try{

    const user=(await sb.auth.getUser()).data.user;

    const {error}=await sb
      .from("profiles")
      .upsert({
        id:user.id,
        display_name:$("profileName").value.trim(),
        currency:$("profileCurrency").value
      });

    if(error){
      return toast(error.message);
    }

    toast("Profile saved.");

    await refresh();

  }catch(error){

    console.error("Profile error:",error);

    toast("Couldn't save your profile.");
  }
}


/* ---------- SIMPLE ASSISTANT ---------- */

function ask(){

  const input=$("ask");

  if(!input)return;

  const q=input.value.trim().toLowerCase();

  if(!q){
    $("answer").textContent=
      "Type a question about your financial records.";
    return;
  }

  const t=monthTx();
  const i=inc(t);
  const e=exp(t);
  const c=catTotals(t);

  const top=Object.entries(c)
    .sort((a,b)=>b[1]-a[1])[0];

  let answer;

  if(
    q.includes("spend")||
    q.includes("spent")||
    q.includes("expense")
  ){

    answer=
      `You recorded ${money(e)} of spending this month.`;

  }else if(
    q.includes("earn")||
    q.includes("income")
  ){

    answer=
      `You recorded ${money(i)} of income this month.`;

  }else if(
    q.includes("biggest")||
    q.includes("largest")||
    q.includes("top categor")
  ){

    answer=top
      ? `${top[0]} is your largest spending category at ${money(top[1])}.`
      : "You don't have any spending categories recorded yet.";

  }else if(
    q.includes("balance")||
    q.includes("net")
  ){

    answer=
      `Your recorded net this month is ${money(i-e)}.`;

  }else if(q.includes("saving")){

    const rate=i
      ? Math.max(0,(i-e)/i*100)
      : 0;

    answer=
      `Your recorded savings rate this month is ${rate.toFixed(1)}%.`;

  }else if(
    q.includes("transaction")||
    q.includes("records")
  ){

    answer=
      `You have ${t.length} recorded transaction${t.length===1?"":"s"} this month.`;

  }else{

    answer=
      "I can answer questions about your spending, income, largest category, net amount, savings rate, and recorded transactions.";

  }

  $("answer").textContent=answer;
}


/* ---------- CALCULATOR ---------- */

function calculateMoney(){

  const a=Number($("calcA").value);
  const b=Number($("calcB").value);
  const op=$("calcOp").value;

  if(!Number.isFinite(a)||!Number.isFinite(b)){
    $("calcResult").textContent=
      "Enter both numbers first.";
    return;
  }

  let result;

  if(op==="+")result=a+b;
  if(op==="-")result=a-b;
  if(op==="*")result=a*b;

  if(op==="/"){

    if(b===0){
      $("calcResult").textContent=
        "You can't divide by zero.";
      return;
    }

    result=a/b;
  }

  if(op==="%"){
    result=a*(b/100);
  }

  $("calcResult").textContent=
    `Result: ${money(result)}`;
}


function calculatePercentage(){

  const amount=Number($("calcMoney").value);
  const percent=Number($("calcPercent").value);

  if(!Number.isFinite(amount)||!Number.isFinite(percent)){
    $("discountResult").textContent=
      "Enter an amount and percentage first.";
    return;
  }

  const result=amount*(percent/100);
  const remaining=amount-result;

  $("discountResult").textContent=
    `${percent}% of ${money(amount)} is ${money(result)}. Remaining: ${money(remaining)}.`;
}


/* ---------- CLICK EVENTS ---------- */

document.addEventListener("click",async e=>{

  const nav=e.target.closest(".nav-item");

  if(nav){

    currentView=nav.dataset.view;

    render();

    return;
  }


  if(e.target.id==="retryRender"){

    render();

    return;
  }


  if(
    [
      "quickAdd",
      "mobileAdd",
      "heroAdd",
      "diaryAdd",
      "calAdd"
    ].includes(e.target.id)
  ){

    openTx();

    return;
  }


  if(
    ["heroDiary","openDiary"].includes(e.target.id)
  ){

    currentView="diary";

    render();

    return;
  }


  const closeButton=
    e.target.closest("[data-close]");

  if(closeButton){

    const target=$(closeButton.dataset.close);

    if(target){
      target.classList.add("hidden");
    }

    return;
  }


  if(
    e.target.classList.contains("type-btn")
  ){

    currentType=e.target.dataset.type;

    document.querySelectorAll(".type-btn").forEach(b=>{
      b.classList.toggle(
        "active",
        b.dataset.type===currentType
      );
    });

    return;
  }


  if(e.target.id==="askBtn"){

    ask();

    return;
  }


  if(
    e.target.classList.contains("assistant-question")
  ){

    const askInput=$("ask");

    if(askInput){

      askInput.value=
        e.target.textContent.trim();

      ask();
    }

    return;
  }


  if(e.target.id==="calculateBtn"){

    calculateMoney();

    return;
  }


  if(e.target.id==="discountBtn"){

    calculatePercentage();

    return;
  }


  if(e.target.id==="logout"){

    await sb.auth.signOut();

    return;
  }


  if(e.target.id==="saveProfile"){

    await saveProfile();

    return;
  }


  if(e.target.id==="exportData"){

    const url=URL.createObjectURL(
      new Blob(
        [JSON.stringify(state,null,2)],
        {type:"application/json"}
      )
    );

    const a=document.createElement("a");

    a.href=url;
    a.download="finmemory-backup.json";

    a.click();

    URL.revokeObjectURL(url);

    toast("Your FinMemory backup was exported.");

    return;
  }


  if(e.target.id==="settingsDiary"){

    currentView="diary";
    render();

    return;
  }


  if(e.target.id==="settingsCalendar"){

    currentView="calendar";
    render();

    return;
  }


  if(e.target.id==="settingsCalculator"){

    currentView="calculator";
    render();

    return;
  }


  if(e.target.id==="addBudget"){

    const category=prompt(
      "Which category should this monthly budget track?"
    );

    const amount=Number(
      prompt("What is the monthly budget amount?")
    );

    if(category&&amount>0){

      const user=
        (await sb.auth.getUser()).data.user;

      const {error}=await sb
        .from("budgets")
        .insert({
          user_id:user.id,
          category,
          amount
        });

      if(error){

        toast(error.message);

      }else{

        toast("Budget added.");

        await refresh();
      }
    }

    return;
  }


  if(e.target.id==="addGoal"){

    const name=prompt(
      "What is the name of your goal?"
    );

    const amount=Number(
      prompt("What is the target amount?")
    );

    if(name&&amount>0){

      const user=
        (await sb.auth.getUser()).data.user;

      const {error}=await sb
        .from("goals")
        .insert({
          user_id:user.id,
          name,
          target_amount:amount,
          saved_amount:0
        });

      if(error){

        toast(error.message);

      }else{

        toast("Goal added.");

        await refresh();
      }
    }

    return;
  }

});


/* ---------- INPUT EVENTS ---------- */

document.addEventListener("input",e=>{

  if(
    [
      "diarySearch",
      "diaryType",
      "diaryCat"
    ].includes(e.target.id)
  ){

    diaryResults();
  }

});


/* ---------- KEYBOARD SUPPORT ---------- */

document.addEventListener("keydown",e=>{

  if(
    e.key==="Enter" &&
    e.target.id==="ask"
  ){

    e.preventDefault();

    ask();
  }

});


/* ---------- TRANSACTION FORM ---------- */

$("transactionForm").addEventListener(
  "submit",
  e=>{
    e.preventDefault();
    saveTx();
  }
);


/* ---------- AUTH TABS ---------- */

document.querySelectorAll(".auth-tab").forEach(b=>

  b.addEventListener("click",()=>{

    authMode=b.dataset.auth;

    document.querySelectorAll(".auth-tab")
      .forEach(x=>
        x.classList.toggle(
          "active",
          x===b
        )
      );

    $("nameWrap").classList.toggle(
      "hidden",
      authMode!=="signup"
    );

    $("authSubmit").textContent=
      authMode==="signup"
        ? "Create account"
        : "Log in";

    $("authMessage").textContent="";
  })

);


/* ---------- AUTH FORM ---------- */

$("authForm").addEventListener(
  "submit",
  async e=>{

    e.preventDefault();

    $("authMessage").textContent=
      "Working…";

    const email=
      $("authEmail").value.trim();

    const password=
      $("authPassword").value;

    if(authMode==="signup"){

      const {
        data,
        error
      }=await sb.auth.signUp({
        email,
        password,
        options:{
          data:{
            display_name:
              $("authName").value.trim()
          }
        }
      });

      if(error){

        $("authMessage").textContent=
          error.message;

      }else{

        $("authMessage").textContent=
          data.session
            ? "Account created."
            : "Account created. Check your email if confirmation is enabled.";
      }

    }else{

      const {error}=
        await sb.auth.signInWithPassword({
          email,
          password
        });

      if(error){

        $("authMessage").textContent=
          error.message;
      }
    }
  }
);


/* ---------- START FINMEMORY ---------- */

init();
