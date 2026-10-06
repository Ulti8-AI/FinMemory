let sb=null,authMode="login",currentType="expense",currentView="overview";
let state={profile:null,transactions:[],categories:[],budgets:[],goals:[]};
  const builtIn=[
  ["Food & Feeding","food"],
  ["Transport","transport"],
  ["Data & Airtime","data"],
  ["Bills","bills"],
  ["School","school"],
  ["Shopping","shopping"],
  ["Entertainment","entertainment"],
  ["Health","health"],
  ["Savings","savings"],
  ["Family","family"],
  ["Gifts","gifts"],
  ["Home","home"],
  ["Clothing","clothing"],
  ["Technology","technology"],
  ["Fitness","fitness"],
  ["Travel","travel"],
  ["Giving","giving"],
  ["Other","other"]
];
function categoryIcon(type){
  const icons={
    food:`
      <svg viewBox="0 0 48 48" aria-hidden="true">
        <path d="M14 9v13M10 9v8c0 3 2 5 4 5s4-2 4-5V9M14 22v17"/>
        <path d="M29 9v30M29 9c6 1 9 5 9 11v4h-9"/>
      </svg>`,

    transport:`
      <svg viewBox="0 0 48 48" aria-hidden="true">
        <path d="M11 29l3-13c.5-2 2-3 4-3h12c2 0 3.5 1 4 3l3 13v7H11z"/>
        <path d="M15 25h18M15 34h.1M33 34h.1"/>
        <path d="M17 13l2-4h10l2 4"/>
      </svg>`,

    data:`
      <svg viewBox="0 0 48 48" aria-hidden="true">
        <path d="M24 34v-1"/>
        <path d="M17 28a10 10 0 0 1 14 0"/>
        <path d="M12 23a17 17 0 0 1 24 0"/>
        <path d="M7 18a24 24 0 0 1 34 0"/>
      </svg>`,

    bills:`
      <svg viewBox="0 0 48 48" aria-hidden="true">
        <path d="M14 8h20v32l-4-3-4 3-4-3-4 3-4-3z"/>
        <path d="M19 16h10M19 22h10M19 28h6"/>
      </svg>`,

    school:`
      <svg viewBox="0 0 48 48" aria-hidden="true">
        <path d="M7 19l17-9 17 9-17 9z"/>
        <path d="M13 23v9c6 5 16 5 22 0v-9"/>
        <path d="M41 20v12"/>
      </svg>`,

    shopping:`
      <svg viewBox="0 0 48 48" aria-hidden="true">
        <path d="M10 17h28l-2 23H12z"/>
        <path d="M17 19v-5a7 7 0 0 1 14 0v5"/>
      </svg>`,

    entertainment:`
      <svg viewBox="0 0 48 48" aria-hidden="true">
        <path d="M13 15h22a6 6 0 0 1 6 6v9a6 6 0 0 1-6 6H13a6 6 0 0 1-6-6v-9a6 6 0 0 1 6-6z"/>
        <path d="M14 25h8M18 21v8M30 23h.1M35 27h.1"/>
      </svg>`,

    health:`
      <svg viewBox="0 0 48 48" aria-hidden="true">
        <path d="M24 39S8 29 8 18a9 9 0 0 1 16-6 9 9 0 0 1 16 6c0 11-16 21-16 21z"/>
        <path d="M24 17v12M18 23h12"/>
      </svg>`,

    savings:`
      <svg viewBox="0 0 48 48" aria-hidden="true">
        <path d="M10 20c0-5 5-9 14-9s14 4 14 9v13c0 4-5 6-14 6s-14-2-14-6z"/>
        <path d="M15 20c3 3 15 3 18 0"/>
        <path d="M39 24h3v7h-3"/>
        <path d="M24 19v13M20 25h8"/>
      </svg>`,

    family:`
      <svg viewBox="0 0 48 48" aria-hidden="true">
        <circle cx="24" cy="14" r="5"/>
        <circle cx="12" cy="19" r="4"/>
        <circle cx="36" cy="19" r="4"/>
        <path d="M15 36c0-7 4-11 9-11s9 4 9 11"/>
        <path d="M5 36c0-5 3-8 7-8 3 0 5 2 6 5M43 36c0-5-3-8-7-8-3 0-5 2-6 5"/>
      </svg>`,

    gifts:`
      <svg viewBox="0 0 48 48" aria-hidden="true">
        <path d="M8 20h32v22H8zM6 14h36v7H6zM24 14v28"/>
        <path d="M24 14c-7 0-10-3-8-7 2-4 8 1 8 7zM24 14c7 0 10-3 8-7-2-4-8 1-8 7z"/>
      </svg>`,

    home:`
      <svg viewBox="0 0 48 48" aria-hidden="true">
        <path d="M7 23L24 9l17 14v17H29V29H19v11H7z"/>
      </svg>`,

    clothing:`
      <svg viewBox="0 0 48 48" aria-hidden="true">
        <path d="M18 10l6 4 6-4 10 7-5 8-5-3v17H18V22l-5 3-5-8z"/>
      </svg>`,

    technology:`
      <svg viewBox="0 0 48 48" aria-hidden="true">
        <rect x="7" y="10" width="34" height="24" rx="3"/>
        <path d="M4 39h40M17 39l2-5h10l2 5"/>
      </svg>`,

    fitness:`
      <svg viewBox="0 0 48 48" aria-hidden="true">
        <path d="M12 19v10M8 21v6M36 19v10M40 21v6"/>
        <path d="M12 24h24M17 17v14M31 17v14"/>
      </svg>`,

    travel:`
      <svg viewBox="0 0 48 48" aria-hidden="true">
        <path d="M24 7l5 15 12 7-2 4-14-4-14 4-2-4 12-7z"/>
        <path d="M20 29l-3 12M28 29l3 12"/>
      </svg>`,

    giving:`
      <svg viewBox="0 0 48 48" aria-hidden="true">
        <path d="M24 39S8 29 8 18a9 9 0 0 1 16-6 9 9 0 0 1 16 6c0 11-16 21-16 21z"/>
        <path d="M16 23h16M24 18v10"/>
      </svg>`,

    other:`
      <svg viewBox="0 0 48 48" aria-hidden="true">
        <path d="M24 6l3 14 14 4-14 4-3 14-3-14-14-4 14-4z"/>
      </svg>`
  };

  return icons[type]||icons.other;
}
function renderCategoryPicker(){
  const picker=$("categoryPicker");
  const select=$("txCategory");

  if(!picker||!select)return;

  const categories=cats();

  select.innerHTML=categories.map(c=>`
    <option value="${esc(c.name)}">${esc(c.name)}</option>
  `).join("");

  if(!select.value && categories.length){
    select.value=categories[0].name;
  }

  picker.innerHTML=categories.map(c=>`
    <button
      type="button"
      class="category-choice ${select.value===c.name?"selected":""}"
      data-category="${esc(c.name)}"
    >
      <span class="category-art">
        ${categoryIcon(c.icon)}
      </span>

      <span class="category-name">
        ${esc(c.name)}
      </span>
    </button>
  `).join("");
}
const $=id=>document.getElementById(id);
const money=n=>new Intl.NumberFormat(undefined,{style:"currency",currency:state.profile?.currency||"NGN",maximumFractionDigits:2}).format(Number(n)||0);
const esc=s=>String(s??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]));
const today=()=>new Date().toISOString().slice(0,10);
const dateText=d=>new Date(d+"T00:00:00").toLocaleDateString(undefined,{day:"numeric",month:"short",year:"numeric"});
const sum=a=>a.reduce((x,y)=>x+Number(y.amount||0),0);
const exp=a=>sum(a.filter(t=>t.type==="expense"));
const inc=a=>sum(a.filter(t=>t.type==="income"));
const monthTx=()=>state.transactions.filter(t=>t.transaction_date.slice(0,7)===today().slice(0,7));
 const cats=()=>[
  ...builtIn.map(x=>({name:x[0],icon:x[1],builtIn:true})),
  ...state.categories.map(x=>({
    name:x.name,
    icon:x.icon||"other",
    builtIn:false
  }))
].filter((x,i,a)=>
  a.findIndex(y=>y.name.toLowerCase()===x.name.toLowerCase())===i
);
 const catTotals=a=>{let o={};a.filter(t=>t.type==="expense").forEach(t=>o[t.category]=(o[t.category]||0)+Number(t.amount));return o};
function toast(m){$("toast").textContent=m;$("toast").classList.add("show");setTimeout(()=>$("toast").classList.remove("show"),2500)}

async function init(){

  try{

    const supabaseUrl=
      "https://cgnlmbsdtqbkajtkqssm.supabase.co";

    const supabaseKey=
      "sb_publishable_k51uAkJt_K5K0SdMM5twdg_eada8Jtg";

    if(!supabaseUrl || !supabaseKey){

      throw new Error(
        "Supabase configuration is missing."
      );

    }

    sb=window.supabase.createClient(
      supabaseUrl,
      supabaseKey
    );

    const {
      data:{
        session
      },
      error
    }=await sb.auth.getSession();

    if(error){
      throw error;
    }

    if(session){
      await enter(session);
    }else{
      showAuth();
    }

   sb.auth.onAuthStateChange(
  (event)=>{

    if(event==="SIGNED_OUT"){

      showAuth();

    }

  }
);

  }catch(e){

    console.error(
      "FinMemory initialization error:",
      e
    );

    showAuth();

    $("authMessage").textContent=
      e.message ||
      "Unable to connect to FinMemory.";

  }

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
    <div class="list-row transaction-row">

      <div>
        <div class="row-title">
          ${esc(t.title)}
        </div>

        <div class="row-sub">
          ${dateText(t.transaction_date)}
          · ${esc(t.category)}
          ${t.note?" · "+esc(t.note):""}
        </div>
      </div>

      <div class="transaction-actions">

        <div class="amount ${t.type==="income"?"positive":"negative"}">
          ${t.type==="income"?"+":"−"}${money(t.amount)}
        </div>

        <button
          type="button"
          class="transaction-edit"
          data-edit-tx="${esc(t.id)}"
        >
          Edit
        </button>

        <button
          type="button"
          class="transaction-delete"
          data-delete-tx="${esc(t.id)}"
        >
          Delete
        </button>

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
  const top=Object.entries(c)
    .sort((a,b)=>b[1]-a[1])[0];

  const recent=state.transactions.slice(0,6);

  const goals=state.goals.slice(0,3);

  const budgets=state.budgets.slice(0,3);

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
        <button class="primary" id="heroAdd">
          + Record money
        </button>

        <button class="ghost" id="heroDiary">
          Open diary
        </button>
      </div>

    </div>


    <div class="grid stats">

      ${stat(
        "This month's income",
        money(i),
        "positive"
      )}

      ${stat(
        "This month's spending",
        money(e),
        "negative"
      )}

      ${stat(
        "Net this month",
        money(i-e),
        i>=e?"positive":"negative"
      )}

      ${stat(
        "Largest category",
        top?esc(top[0]):"—"
      )}

    </div>


    <div class="grid section-grid" style="margin-top:16px">


      <div class="card">

        <div class="card-head">

          <h3>Recent memories</h3>

          <button
            class="ghost"
            id="openDiary"
          >
            View all
          </button>

        </div>

        <div class="list">

          ${
            recent.length
              ? recent.map(txRow).join("")
              : `
                <div class="empty">
                  Your first money memory is waiting.
                </div>
              `
          }

        </div>

      </div>


      <div class="card">

        <div class="card-head">
          <h3>Spending pulse</h3>
        </div>

        ${bars(c)}

      </div>


      ${
        goals.length
          ? `
            <div class="card">

              <div class="card-head">
                <h3>Goals in progress</h3>

                <button
                  class="ghost"
                  data-view="goals"
                >
                  View goals
                </button>
              </div>

              <div class="dashboard-goals">

                ${
                  goals.map(g=>{

                    const target=
                      Number(g.target_amount||0);

                    const saved=
                      Number(g.saved_amount||0);

                    const p=target>0
                      ? Math.min(
                          100,
                          saved/target*100
                        )
                      : 0;

                    return `
                      <div class="dashboard-goal">

                        <div class="row">

                          <div>
                            <b>${esc(g.name)}</b>

                            <div class="row-sub">
                              ${money(saved)}
                              of
                              ${money(target)}
                            </div>
                          </div>

                          <b>
                            ${p.toFixed(0)}%
                          </b>

                        </div>

                        <div class="progress">
                          <i style="width:${p}%"></i>
                        </div> 
                        <div class="goal-actions">

                         <button
                           type="button"
                           class="ghost goal-add-money"
                           data-goal-id="${esc(g.id)}"
                        >
                           + Add money
                         </button>

                      </div>
                    `;

                  }).join("")
                }

              </div>

            </div>
          `
          : ""
      }


      ${
        budgets.length
          ? `
            <div class="card">

              <div class="card-head">
                <h3>Budget watch</h3>

                <button
                  class="ghost"
                  data-view="budgets"
                >
                  View budgets
                </button>
              </div>

              <div class="dashboard-budgets">

                ${
                  budgets.map(b=>{

                    const spent=
                      c[b.category]||0;

                    const limit=
                      Number(b.amount||0);

                    const p=limit>0
                      ? Math.min(
                          100,
                          spent/limit*100
                        )
                      : 0;

                    return `
                      <div class="dashboard-budget">

                        <div class="row">

                          <div>
                            <b>
                              ${esc(b.category)}
                            </b>

                            <div class="row-sub">
                              ${money(spent)}
                              of
                              ${money(limit)}
                            </div>
                          </div>

                          <b>
                            ${p.toFixed(0)}%
                          </b>

                        </div>

                        <div class="progress">
                          <i style="width:${p}%"></i>
                        </div>

                      </div>
                    `;

                  }).join("")
                }

              </div>

            </div>
          `
          : ""
      }

    </div>
  `;
};

 /* ---------- DIARY ---------- */

views.diary=()=>`
  <div class="card diary-card">

    <div class="diary-head">

      <div>
        <p class="eyebrow">MONEY MEMORY</p>

        <h3>Your financial diary</h3>

        <p class="diary-subtitle">
          Search your money history and find the memory behind every entry.
        </p>
      </div>

      <button
        class="primary"
        id="diaryAdd"
      >
        + Record
      </button>

    </div>


    <div class="diary-search">

      <div class="diary-search-main">

        <span class="diary-search-icon">
          ⌕
        </span>

        <input
          id="diarySearch"
          class="diary-search-input"
          placeholder="Search your money memories..."
          autocomplete="off"
        >

        <button
          type="button"
          class="diary-search-clear"
          id="diaryClear"
          title="Clear search"
        >
          ×
        </button>

      </div>


      <div class="diary-filters">

        <select
          class="diary-filter"
          id="diaryType"
        >
          <option value="">All types</option>
          <option value="expense">Expenses</option>
          <option value="income">Income</option>
        </select>


        <select
          class="diary-filter"
          id="diaryCat"
        >
          <option value="">All categories</option>

          ${cats().map(c=>`
            <option value="${esc(c.name)}">
              ${esc(c.name)}
            </option>
          `).join("")}

        </select>

      </div>

    </div>


    <div class="diary-memory-bar">

      <span>
        Search titles, categories, notes, tags, dates and amounts.
      </span>

      <span id="diaryCount"></span>

    </div>


    <div
      id="diaryResults"
      class="list diary-results"
    ></div>

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

  const expenses=t.filter(
    x=>x.type==="expense"
  );

  const days={};

  expenses.forEach(x=>{

    const d=new Date(
      x.transaction_date+"T00:00:00"
    ).toLocaleDateString(
      undefined,
      {weekday:"long"}
    );

    days[d]=(days[d]||0)+Number(x.amount);

  });

  const topDay=
    Object.entries(days)
      .sort((a,b)=>b[1]-a[1])[0];

  const topCategory=
    Object.entries(c)
      .sort((a,b)=>b[1]-a[1])[0];

  const average=
    expenses.length
      ? e/expenses.length
      : 0;

  const sortedCategories=
    Object.entries(c)
      .sort((a,b)=>b[1]-a[1]);

  const weekdayOrder=[
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday"
  ];

  const weekdayRows=weekdayOrder
    .filter(d=>days[d])
    .map(d=>`
      <div class="pattern-row">

        <span>${d}</span>

        <div class="pattern-bar">
          <i
            style="
              width:${
                topDay
                  ? Math.min(
                      100,
                      days[d]/topDay[1]*100
                    )
                  : 0
              }%
            "
          ></i>
        </div>

        <b>${money(days[d])}</b>

      </div>
    `)
    .join("");

  return `

    <div class="pattern-intro">

      <p class="eyebrow">YOUR MONEY PATTERNS</p>

      <h3>
        Your spending has a rhythm.
      </h3>

      <p>
        FinMemory looks across your money memories
        to reveal patterns in how you spend and save.
      </p>

    </div>


    <div class="grid stats">

      ${stat(
        "Savings rate",
        i
          ? Math.max(
              0,
              (i-e)/i*100
            ).toFixed(1)+"%"
          : "—",
        "positive"
      )}

      ${stat(
        "Average spend",
        average
          ? money(average)
          : "—"
      )}

      ${stat(
        "Top category",
        topCategory
          ? esc(topCategory[0])
          : "—"
      )}

      ${stat(
        "Top day",
        topDay
          ? esc(topDay[0])
          : "—"
      )}

    </div>


    <div
      class="grid two"
      style="margin-top:16px"
    >

      <div class="card">

        <div class="card-head">
          <h3>Where your money goes</h3>
        </div>

        ${
          sortedCategories.length
            ? bars(c)
            : `
              <div class="empty">
                Not enough data yet.
              </div>
            `
        }

      </div>


      <div class="card">

        <div class="card-head">
          <h3>When you spend</h3>
        </div>

        ${
          weekdayRows
            ? `
              <div class="pattern-list">
                ${weekdayRows}
              </div>
            `
            : `
              <div class="empty">
                Not enough data yet.
              </div>
            `
        }

      </div>

    </div>


    ${
      topCategory
        ? `
          <div
            class="card"
            style="margin-top:16px"
          >

            <div class="card-head">
              <h3>Pattern insight</h3>
            </div>

            <div class="pattern-insight">

              <div class="pattern-insight-icon">
                ✦
              </div>

              <div>

                <b>
                  ${esc(topCategory[0])}
                </b>

                <p>
                  This is your largest spending
                  category this month at
                  <strong>
                    ${money(topCategory[1])}
                  </strong>.
                </p>

              </div>

            </div>

          </div>
        `
        : ""
    }

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

 views.recurring=()=>{

  const recurring=state.transactions
    .filter(t=>t.is_recurring)
    .slice(0,12);

  const frequencyLabel={
    weekly:"Weekly",
    monthly:"Monthly",
    yearly:"Yearly"
  };

  return `

    <div class="recurring-intro">

      <p class="eyebrow">RECURRING MONEY</p>

      <h3>Remember what repeats.</h3>

      <p>
        Keep track of regular payments and income
        so recurring money never catches you by surprise.
      </p>

    </div>

    <div class="grid stats">

      ${stat(
        "Recurring items",
        recurring.length
      )}

      ${stat(
        "Recurring expenses",
        recurring
          .filter(x=>x.type==="expense")
          .length
      )}

      ${stat(
        "Recurring income",
        recurring
          .filter(x=>x.type==="income")
          .length
      )}

      ${stat(
        "Monthly view",
        recurring.length
          ? money(
              recurring
                .filter(x=>x.type==="expense")
                .reduce(
                  (sum,x)=>sum+Number(x.amount||0),
                  0
                )
            )
          : "—"
      )}

    </div>

    <div
      class="card"
      style="margin-top:16px"
    >

      <div class="card-head">

        <div>
          <h3>Your recurring money</h3>

          <p class="muted">
            Regular money memories you want FinMemory to remember.
          </p>
        </div>

        <button
          class="primary"
          id="recurringAdd"
        >
          + Add recurring
        </button>

      </div>

      ${
        recurring.length

          ? `
            <div class="recurring-list">

              ${recurring.map(t=>`

                <div class="recurring-item">

                  <div class="recurring-item-main">

                    <div class="recurring-icon">
                      ${t.type==="income"?"↗":"↘"}
                    </div>

                    <div>

                      <b>
                        ${esc(t.title)}
                      </b>

                      <div class="row-sub">
                        ${esc(t.category)}
                        ·
                        ${
                          frequencyLabel[
                            t.recurring_frequency
                          ] || "Recurring"
                        }
                      </div>

                    </div>

                  </div>

                  <div class="recurring-item-right">

                    <div
                      class="amount ${
                        t.type==="income"
                          ? "positive"
                          : "negative"
                      }"
                    >
                      ${
                        t.type==="income"
                          ? "+"
                          : "−"
                      }${money(t.amount)}
                    </div>

                    <span class="recurring-badge">
                      ${
                        frequencyLabel[
                          t.recurring_frequency
                        ] || "Repeats"
                      }
                    </span>

                  </div>

                </div>

              `).join("")}

            </div>
          `

          : `
            <div class="recurring-empty">

              <div class="recurring-empty-icon">
                ↻
              </div>

              <b>No recurring money yet</b>

              <span>
                Add a regular payment or income and
                FinMemory will remember it here.
              </span>

              <button
                class="ghost"
                id="recurringEmptyAdd"
              >
                Add your first recurring item
              </button>

            </div>
          `
      }

    </div>

  `;
};
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

     renderCategoryPicker();
  
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

  const custom=$("txTitle").value.trim();

  if(!custom){

    return toast(
      "Add a title describing what this spending was for."
    );

  }

  category=custom;

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
  if(e.target.closest(".category-choice")){

    const button=e.target.closest(".category-choice");
    const category=button.dataset.category;

    $("txCategory").value=category;

    document.querySelectorAll(".category-choice").forEach(x=>{
      x.classList.toggle(
        "selected",
        x.dataset.category===category
      );
    });

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
if(e.target.closest("[data-edit-tx]")){

  const button=e.target.closest("[data-edit-tx]");
  const id=button.dataset.editTx;

  const tx=state.transactions.find(
    x=>String(x.id)===String(id)
  );

  if(!tx){
    return toast("Transaction not found.");
  }

  const modal=document.createElement("div");

  modal.className="fm-edit-modal";

   modal.innerHTML=`
    <div class="fm-edit-box">
       <div class="fm-edit-head">

        <div>
          <h3>Edit money memory</h3>
          <p>Update the details of this memory.</p>
        </div>

        <button
          type="button"
           class="fm-edit-close"
          data-edit-close
        >
          ×
        </button>

      </div>

      <form id="editTxForm">

        <label>
          Title

          <input
            id="editTxTitle"
            type="text"
            value="${esc(tx.title||"")}"
            required
          >
        </label>

        <label>
          Amount

          <input
            id="editTxAmount"
            type="number"
            min="0.01"
            step="0.01"
            value="${Number(tx.amount||0)}"
            required
          >
        </label>

        <label>
          Date

          <input
            id="editTxDate"
            type="date"
            value="${esc(tx.transaction_date||"")}"
            required
          >
        </label>

        <label>
          Category

          <select id="editTxCategory">
            ${cats().map(c=>`
              <option
                value="${esc(c.name)}"
                ${c.name===tx.category?"selected":""}
              >
                ${esc(c.name)}
              </option>
            `).join("")}
          </select>
        </label>

        <label>
          Note

          <input
            id="editTxNote"
            type="text"
            value="${esc(tx.note||"")}"
          >
        </label>

        <button
          type="submit"
           class="primary fm-edit-save"
        >
          Save changes
        </button>

      </form>

    </div>
  `;

  document.body.appendChild(modal);

  const form=modal.querySelector("#editTxForm");

  modal.querySelector("[data-edit-close]")
    .addEventListener("click",()=>{
      modal.remove();
    });

  modal.addEventListener("click",e=>{
    if(e.target===modal){
      modal.remove();
    }
  });

  form.addEventListener("submit",async e=>{

    e.preventDefault();

    const title=
      modal.querySelector("#editTxTitle")
        .value.trim();

    const amount=Number(
      modal.querySelector("#editTxAmount").value
    );

    const transaction_date=
      modal.querySelector("#editTxDate").value;

    const category=
      modal.querySelector("#editTxCategory").value;

    const note=
      modal.querySelector("#editTxNote")
        .value.trim() || null;

    if(!title || amount<=0 || !transaction_date){
      return toast("Check the transaction details.");
    }

    const {error}=await sb
      .from("transactions")
      .update({
        title,
        amount,
        transaction_date,
        category,
        note
      })
      .eq("id",id);

    if(error){

      return toast(error.message);

    }

    modal.remove();

    toast("Money memory updated.");

    await refresh();

  });

  return;
}
  if(e.target.id==="diaryClear"){

  const input=$("diarySearch");

  if(input){

    input.value="";

    input.dispatchEvent(
      new Event("input",{bubbles:true})
    );

  }

  return;
}
if(e.target.closest("[data-delete-tx]")){

  const button=e.target.closest("[data-delete-tx]");
  const id=button.dataset.deleteTx;

  const {error}=await sb
    .from("transactions")
    .delete()
    .eq("id",id);

  if(error){

    toast(error.message);

  }else{

    toast("Money memory deleted.");

    await refresh();
  }

  return;
}
   if(e.target.closest("[data-edit-tx]")){

  const button=e.target.closest("[data-edit-tx]");
  const id=button.dataset.editTx;

  const tx=state.transactions.find(
    x=>String(x.id)===String(id)
  );

  if(!tx){
    return toast("Transaction not found.");
  }

  const modal=document.createElement("div");

  modal.className="fm-edit-modal";

  modal.innerHTML=`
    <div class="fm-edit-box">

      <div class="fm-edit-head">

        <div>
          <h3>Edit money memory</h3>
          <p>Update this memory.</p>
        </div>

        <button
          type="button"
          class="fm-edit-close"
          data-edit-close
        >
          ×
        </button>

      </div>

      <form id="editTxForm">

        <label>
          Title

          <input
            id="editTxTitle"
            type="text"
            value="${esc(tx.title||"")}"
            required
          >
        </label>

        <label>
          Amount

          <input
            id="editTxAmount"
            type="number"
            min="0.01"
            step="0.01"
            value="${Number(tx.amount||0)}"
            required
          >
        </label>

        <label>
          Date

          <input
            id="editTxDate"
            type="date"
            value="${esc(tx.transaction_date||"")}"
            required
          >
        </label>

        <label>
          Category

          <select id="editTxCategory">
            ${cats().map(c=>`
              <option
                value="${esc(c.name)}"
                ${c.name===tx.category?"selected":""}
              >
                ${esc(c.name)}
              </option>
            `).join("")}
          </select>
        </label>

        <label>
          Note

          <input
            id="editTxNote"
            type="text"
            value="${esc(tx.note||"")}"
          >
        </label>

        <button
          type="submit"
          class="primary fm-edit-save"
        >
          Save changes
        </button>

      </form>

    </div>
  `;

  document.body.appendChild(modal);

  const form=modal.querySelector("#editTxForm");

  modal
    .querySelector("[data-edit-close]")
    .addEventListener("click",()=>{
      modal.remove();
    });

  modal.addEventListener("click",e=>{
    if(e.target===modal){
      modal.remove();
    }
  });

  form.addEventListener("submit",async e=>{

    e.preventDefault();

    const title=
      modal.querySelector("#editTxTitle")
        .value.trim();

    const amount=Number(
      modal.querySelector("#editTxAmount").value
    );

    const transaction_date=
      modal.querySelector("#editTxDate").value;

    const category=
      modal.querySelector("#editTxCategory").value;

    const note=
      modal.querySelector("#editTxNote")
        .value.trim() || null;

    if(!title||amount<=0||!transaction_date){

      return toast(
        "Check the transaction details."
      );
    }

    const {error}=await sb
      .from("transactions")
      .update({
        title,
        amount,
        transaction_date,
        category,
        note
      })
      .eq("id",id);

    if(error){
      return toast(error.message);
    }

    modal.remove();

    toast("Money memory updated.");

    await refresh();

  });

  return;
}
  if(e.target.closest("[data-view]")){

  const button=e.target.closest("[data-view]");
  const view=button.dataset.view;

  if(view){

    currentView=view;

    render();

  }

  return;
} 
  if(
  e.target.id==="recurringAdd" ||
  e.target.id==="recurringEmptyAdd"
){

  const modal=document.createElement("div");

  modal.className="fm-recurring-modal";

  modal.innerHTML=`

    <div class="fm-recurring-box">

      <div class="fm-recurring-head">

        <div>
          <span class="fm-recurring-kicker">
            RECURRING MONEY
          </span>

          <h3>Add recurring money</h3>

          <p>
            Tell FinMemory what repeats.
          </p>
        </div>

        <button
          type="button"
          class="fm-recurring-close"
          data-recurring-close
        >
          ×
        </button>

      </div>

      <form id="recurringForm">

        <div class="fm-recurring-type">

          <button
            type="button"
            class="fm-recurring-type-btn active"
            data-recurring-type="expense"
          >
            <span>↘</span>
            Expense
          </button>

          <button
            type="button"
            class="fm-recurring-type-btn"
            data-recurring-type="income"
          >
            <span>↗</span>
            Income
          </button>

        </div>

        <label>
          What is it?

          <input
            id="recurringTitle"
            type="text"
            placeholder="e.g. Monthly internet"
            required
          >
        </label>

        <label>
          Amount

          <div class="fm-recurring-amount">
            <span>₦</span>

            <input
              id="recurringAmount"
              type="number"
              min="0.01"
              step="0.01"
              placeholder="0.00"
              required
            >
          </div>
        </label>

        <label>
          Category

          <select
            id="recurringCategory"
            required
          >
            ${cats().map(c=>`
              <option value="${esc(c.name)}">
                ${esc(c.name)}
              </option>
            `).join("")}
          </select>
        </label>

        <label>
          Repeats

          <select
            id="recurringFrequency"
            required
          >
            <option value="weekly">
              Every week
            </option>

            <option value="monthly" selected>
              Every month
            </option>

            <option value="yearly">
              Every year
            </option>
          </select>
        </label>

        <label>
          First date

          <input
            id="recurringDate"
            type="date"
            value="${today()}"
            required
          >
        </label>

        <label>
          Note

          <input
            id="recurringNote"
            type="text"
            placeholder="Optional"
          >
        </label>

        <button
          type="submit"
          class="primary fm-recurring-save"
        >
          Save recurring money
        </button>

      </form>

    </div>
  `;

  document.body.appendChild(modal);

  let recurringType="expense";

  const form=
    modal.querySelector("#recurringForm");

  const typeButtons=
    modal.querySelectorAll(
      ".fm-recurring-type-btn"
    );

  typeButtons.forEach(button=>{

    button.addEventListener("click",()=>{

      recurringType=
        button.dataset.recurringType;

      typeButtons.forEach(x=>{
        x.classList.toggle(
          "active",
          x.dataset.recurringType===recurringType
        );
      });

    });

  });

  modal
    .querySelector("[data-recurring-close]")
    .addEventListener("click",()=>{
      modal.remove();
    });

  modal.addEventListener("click",e=>{

    if(e.target===modal){
      modal.remove();
    }

  });

  form.addEventListener("submit",async e=>{

    e.preventDefault();

    const title=
      modal
        .querySelector("#recurringTitle")
        .value
        .trim();

    const amount=Number(
      modal
        .querySelector("#recurringAmount")
        .value
    );

    const category=
      modal
        .querySelector("#recurringCategory")
        .value;

    const frequency=
      modal
        .querySelector("#recurringFrequency")
        .value;

    const transaction_date=
      modal
        .querySelector("#recurringDate")
        .value;

    const note=
      modal
        .querySelector("#recurringNote")
        .value
        .trim() || null;

    if(
      !title ||
      amount<=0 ||
      !category ||
      !transaction_date
    ){

      return toast(
        "Check the recurring money details."
      );

    }

    const user=
      (await sb.auth.getUser()).data.user;

    if(!user){
      return toast("Please sign in first.");
    }

    const {error}=await sb
      .from("transactions")
      .insert({
        user_id:user.id,
        type:recurringType,
        amount,
        title,
        category,
        transaction_date,
        note,
        tags:[],
        is_recurring:true,
        recurring_frequency:frequency
      });

    if(error){

      console.error(
        "Recurring save error:",
        error
      );

      return toast(error.message);

    }

    modal.remove();

    toast("Recurring money saved.");

    await refresh();

  });

  return;
}
   if(e.target.id==="addBudget"){

  const modal=document.createElement("div");

  modal.className="fm-budget-modal";

  modal.innerHTML=`
    <div class="fm-budget-box">

      <div class="fm-budget-head">
        <div>
          <h3>Create a monthly budget</h3>
          <p>Choose a category and set your spending limit.</p>
        </div>

        <button
          type="button"
          class="fm-budget-close"
          data-budget-close
        >
          ×
        </button>
      </div>

      <form id="budgetForm">

        <label>
          Category

          <select id="budgetCategory" required>
            ${cats().map(c=>`
              <option value="${esc(c.name)}">
                ${esc(c.name)}
              </option>
            `).join("")}
          </select>
        </label>

        <label>
          Monthly budget

          <input
            id="budgetAmount"
            type="number"
            min="0.01"
            step="0.01"
            placeholder="e.g. 50000"
            required
          >
        </label>

        <button
          type="submit"
          class="primary fm-budget-save"
        >
          Create budget
        </button>

      </form>

    </div>
  `;

  document.body.appendChild(modal);

  const form=modal.querySelector("#budgetForm");
  const close=modal.querySelector("[data-budget-close]");

  close.addEventListener("click",()=>{
    modal.remove();
  });

  modal.addEventListener("click",e=>{
    if(e.target===modal){
      modal.remove();
    }
  });

  form.addEventListener("submit",async e=>{

    e.preventDefault();

    const category=
      modal.querySelector("#budgetCategory")
        .value;

    const amount=Number(
      modal.querySelector("#budgetAmount")
        .value
    );

    if(!category||amount<=0){

      toast("Enter a category and a valid budget amount.");

      return;
    }

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

      return;
    }

    modal.remove();

    toast("Budget added.");

    await refresh();

  });

  return;
}

   if(e.target.id==="addGoal"){

  const modal=document.createElement("div");

  modal.className="fm-goal-modal";

  modal.innerHTML=`
    <div class="fm-goal-box">

      <div class="fm-goal-head">
        <div>
          <h3>Create a savings goal</h3>
          <p>Give your goal a name and target.</p>
        </div>

        <button
          type="button"
          class="fm-goal-close"
          data-goal-close
        >
          ×
        </button>
      </div>

      <form id="goalForm">

        <label>
          Goal name
          <input
            id="goalName"
            type="text"
            placeholder="e.g. New laptop"
            required
          >
        </label>

        <label>
          Target amount
          <input
            id="goalAmount"
            type="number"
            min="0.01"
            step="0.01"
            placeholder="e.g. 250000"
            required
          >
        </label>

        <button
          type="submit"
          class="primary fm-goal-save"
        >
          Create goal
        </button>

      </form>

    </div>
  `;

  document.body.appendChild(modal);

  const form=modal.querySelector("#goalForm");
  const close=modal.querySelector("[data-goal-close]");

  close.addEventListener("click",()=>{
    modal.remove();
  });

  modal.addEventListener("click",e=>{
    if(e.target===modal){
      modal.remove();
    }
  });

  form.addEventListener("submit",async e=>{

    e.preventDefault();

    const name=
      modal.querySelector("#goalName")
        .value.trim();

    const amount=Number(
      modal.querySelector("#goalAmount")
        .value
    );

    if(!name||amount<=0){

      toast("Enter a goal name and a valid target amount.");

      return;
    }

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

      return;
    }

    modal.remove();

    toast("Goal added.");

    await refresh();

  });

  return;
}

});


/* ---------- INPUT EVENTS ---------- */

document.addEventListener("input",e=>{

  if(
  e.target.id==="diarySearch" ||
  e.target.id==="diaryType" ||
  e.target.id==="diaryCat"
){

  const search=
    $("diarySearch")
      ?.value
      .trim()
      .toLowerCase() || "";

  const type=
    $("diaryType")
      ?.value || "";

  const category=
    $("diaryCat")
      ?.value || "";

  const results=state.transactions.filter(t=>{

    if(type && t.type!==type){
      return false;
    }

    if(
      category &&
      String(t.category||"").toLowerCase()!==category.toLowerCase()
    ){
      return false;
    }

    if(!search){
      return true;
    }

    const searchable=[
      t.title,
      t.category,
      t.note,
      ...(Array.isArray(t.tags)?t.tags:[]),
      t.transaction_date,
      t.amount
    ]
      .join(" ")
      .toLowerCase();

    return searchable.includes(search);

  });

  const resultsBox=$("diaryResults");

  if(resultsBox){

    resultsBox.innerHTML=results.length
      ? results.map(txRow).join("")
      : `
        <div class="empty diary-empty">
          <div class="diary-empty-icon">⌕</div>
          <b>No memories found</b>
          <span>
            Try another search or remove a filter.
          </span>
        </div>
      `;

  }

  const count=$("diaryCount");

  if(count){

    count.textContent=
      `${results.length} ${
        results.length===1
          ? "memory"
          : "memories"
      }`;

  }

}

  /* ---------- END CLICK EVENTS ---------- */

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

const authSubmitButton=$("authSubmit");

if(authSubmitButton){

  authSubmitButton.addEventListener(
    "click",
    async ()=>{

      const message=$("authMessage");

      const email=
        $("authEmail").value.trim();

      const password=
        $("authPassword").value;

      if(!email){
        message.textContent="Enter your email.";
        $("authEmail").focus();
        return;
      }

      if(!password){
        message.textContent="Enter your password.";
        $("authPassword").focus();
        return;
      }

      if(!sb){
        message.textContent=
          "FinMemory is not connected to Supabase yet.";
        return;
      }

      authSubmitButton.disabled=true;

      authSubmitButton.textContent=
        authMode==="signup"
          ? "Creating account…"
          : "Signing in…";

      message.textContent=
        authMode==="signup"
          ? "Creating your account…"
          : "Connecting to Supabase…";

      try{

        if(authMode==="signup"){

          const result=
            await Promise.race([

              sb.auth.signUp({
                email,
                password,
                options:{
                  data:{
                    display_name:
                      $("authName")
                        .value
                        .trim()
                  }
                }
              }),

              new Promise((_,reject)=>
                setTimeout(
                  ()=>reject(
                    new Error(
                      "Supabase took too long to respond. Check your connection and Supabase project."
                    )
                  ),
                  15000
                )
              )

            ]);

          const {
            data,
            error
          }=result;

          if(error){
            console.error(
              "FinMemory signup error:",
              error
            );

            message.textContent=
              error.message;

            return;
          }

          if(data?.session){

            message.textContent=
              "Account created. Loading FinMemory…";

            await enter(data.session);

            return;
          }

          message.textContent=
            "Account created. Check your email to confirm your account.";

          return;
        }


        message.textContent=
          "Contacting Supabase…";


        const result=
          await Promise.race([

            sb.auth.signInWithPassword({
              email,
              password
            }),

            new Promise((_,reject)=>
              setTimeout(
                ()=>reject(
                  new Error(
                    "Supabase did not respond within 15 seconds."
                  )
                ),
                15000
              )
            )

          ]);


        const {
          data,
          error
        }=result;


        console.log(
          "FinMemory login response:",
          {
            hasSession:!!data?.session,
            error
          }
        );


        if(error){

          console.error(
            "FinMemory login error:",
            error
          );

          message.textContent=
            error.message;

          return;
        }


        if(!data?.session){

          message.textContent=
            "Supabase accepted the login but returned no session.";

          return;
        }


        message.textContent=
          "Login successful. Loading your money memories…";


        await enter(data.session);


      }catch(error){

        console.error(
          "FinMemory authentication error:",
          error
        );

        message.textContent=
          error?.message ||
          "Something went wrong while signing in.";

      }finally{

        authSubmitButton.disabled=false;

        authSubmitButton.textContent=
          authMode==="signup"
            ? "Create account"
            : "Log in";

      }

    }
  );

}


/* ---------- START FINMEMORY ---------- */

init();
/* ---------- START FINMEMORY ---------- */

init();
