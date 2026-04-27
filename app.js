/* ── STATE ── */
let currentIndustry = 'FinTech';
let currentStage = 'Pre-Seed';
let audioCtx = null;
let audioEnabled = false;

// DOM Elements
const UI = {
  screenInput: document.getElementById('screen-input'),
  screenLoading: document.getElementById('screen-loading'),
  screenResult: document.getElementById('screen-result'),
  textarea: document.getElementById('pitchTextarea'),
  wordCount: document.getElementById('wordCountCounter'),
  probValue: document.getElementById('probValue'),
  gaugePath: document.getElementById('gaugeValuePath'),
  verdictStamp: document.getElementById('verdictStamp'),
  tagline: document.getElementById('tagline'),
  sharksContainer: document.getElementById('sharksContainer'),
  strengthsList: document.getElementById('strengthsList'),
  flawsList: document.getElementById('flawsList'),
  fixesList: document.getElementById('fixesList'),
  investorMatchList: document.getElementById('investorMatchList'),
  historyList: document.getElementById('historyList'),
  btnSubmit: document.getElementById('btnSubmitPitch')
};

/* ── INIT & EVENT LISTENERS ── */
document.addEventListener('DOMContentLoaded', () => {
  randomizeHeroStats();
  loadHistory();
});

function selectChip(btn, type) {
  const group = type === 'industry' ? document.getElementById('industryChips') : document.getElementById('stageChips');
  group.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
  btn.classList.add('active');
  if (type === 'industry') currentIndustry = btn.textContent;
  if (type === 'stage') currentStage = btn.textContent;
}

function updateWordCount() {
  const text = UI.textarea.value.trim();
  const words = text ? text.split(/\s+/).length : 0;
  UI.wordCount.textContent = `${words} words — Optimal: 150-300`;
  
  UI.wordCount.className = 'word-count';
  if (words > 0 && (words < 50 || words > 400)) UI.wordCount.classList.add('danger');
  else if (words > 0 && (words < 100 || words > 300)) UI.wordCount.classList.add('warning');
  
  if (words > 0 && words % 10 === 0 && Math.random() > 0.5) playTick();
}

function randomizeHeroStats() {
  document.getElementById('statMoney').textContent = (Math.random() * 5 + 1).toFixed(1) + 'B';
  document.getElementById('statSharks').textContent = Math.floor(Math.random() * 5000 + 1000).toLocaleString();
  document.getElementById('statPitches').textContent = Math.floor(Math.random() * 20000 + 5000).toLocaleString();
}

/* ── WEB AUDIO ENGINE ── */
function toggleAudio() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  if (audioEnabled) {
    audioCtx.suspend();
    document.getElementById('audioToggle').style.opacity = '0.5';
  } else {
    audioCtx.resume();
    document.getElementById('audioToggle').style.opacity = '1';
  }
  audioEnabled = !audioEnabled;
}

function playTick() {
  if (!audioEnabled || !audioCtx) return;
  const t = audioCtx.currentTime;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = 'square';
  osc.frequency.setValueAtTime(800, t);
  osc.frequency.exponentialRampToValueAtTime(100, t + 0.05);
  gain.gain.setValueAtTime(0.1, t);
  gain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);
  osc.connect(gain).connect(audioCtx.destination);
  osc.start(t); osc.stop(t + 0.05);
}

function playTensionSweep() {
  if (!audioEnabled || !audioCtx) return;
  const t = audioCtx.currentTime;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(100, t);
  osc.frequency.linearRampToValueAtTime(600, t + 4);
  gain.gain.setValueAtTime(0, t);
  gain.gain.linearRampToValueAtTime(0.2, t + 3.8);
  gain.gain.linearRampToValueAtTime(0, t + 4);
  osc.connect(gain).connect(audioCtx.destination);
  osc.start(t); osc.stop(t + 4);
}

function playResultFanfare(success) {
  if (!audioEnabled || !audioCtx) return;
  const t = audioCtx.currentTime;
  if (success) {
    // Fanfare
    [440, 554, 659].forEach((freq, i) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0, t + i*0.1);
      gain.gain.linearRampToValueAtTime(0.2, t + i*0.1 + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.01, t + i*0.1 + 1);
      osc.connect(gain).connect(audioCtx.destination);
      osc.start(t + i*0.1); osc.stop(t + i*0.1 + 1);
    });
  } else {
    // Sad Trombone
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(300, t);
    osc.frequency.linearRampToValueAtTime(150, t + 1);
    gain.gain.setValueAtTime(0.2, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 1);
    osc.connect(gain).connect(audioCtx.destination);
    osc.start(t); osc.stop(t + 1);
  }
}

/* ── PROCEDURAL EVALUATION ENGINE ── */
async function submitPitch() {
  const pitch = UI.textarea.value.trim();
  if (pitch.split(/\s+/).length < 20) {
    alert("This pitch is too short. The sharks need more meat.");
    return;
  }
  
  if (!audioCtx) toggleAudio(); // auto-enable if not on

  // Show Loading
  UI.screenInput.classList.remove('active');
  UI.screenLoading.classList.add('active');
  playTensionSweep();

  // Fake Loading Bar
  const fill = document.getElementById('loadingProgress');
  fill.style.width = '0%';
  setTimeout(() => fill.style.width = '40%', 500);
  setTimeout(() => fill.style.width = '80%', 1500);
  setTimeout(() => fill.style.width = '100%', 3000);

  // Generate Analysis
  const analysis = generateProceduralAnalysis(pitch, currentIndustry, currentStage);

  // Wait for "loading" to finish
  await new Promise(r => setTimeout(r, 3500));

  renderResults(analysis);
}

function generateProceduralAnalysis(text, industry, stage) {
  const t = text.toLowerCase();
  let score = 50; // base score

  // 1. Buzzword check
  const redFlags = ['synergy', 'uber for', 'airbnb for', 'disrupt', 'revolutionary', 'blockchain', 'web3', 'crypto'];
  const greenFlags = ['revenue', 'mrr', 'arr', 'customers', 'patent', 'loi', 'b2b', 'retention'];

  let foundRed = 0;
  let foundGreen = 0;

  redFlags.forEach(w => { if (t.includes(w)) { score -= 10; foundRed++; } });
  greenFlags.forEach(w => { if (t.includes(w)) { score += 12; foundGreen++; } });

  // 2. Length check
  const words = text.split(/\s+/).length;
  if (words < 100) score -= 20; // too short
  if (words > 300) score -= 15; // too long

  // 3. Stage expectations
  if (stage === 'Series A' && foundGreen < 2) score -= 30; // Need traction for A
  if (stage === 'Pre-Seed' && foundRed > 0) score -= 15; // Buzzwords ruin pre-seed

  // Cap score
  if (score < 5) score = Math.floor(Math.random() * 15 + 5);
  if (score > 98) score = 98;

  const isFunded = score >= 70;
  const isCond = score >= 40 && score < 70;

  // DB of Sharks
  const SHARKS = [
    { name: "Kevin", role: "The Ruthless Calculator", avatar: "👨‍💼", 
      opinions: [
        "You're dead to me. This valuation is a joke.",
        "I'll give you the money, but I want 50% and a royalty.",
        "This is a hobby, not a business. Stop wasting my time."
      ],
      goodOpinions: ["I smell money. I'm making an offer.", "The margins are beautiful. I want in."]
    },
    { name: "Mark", role: "The Tech Evangelist", avatar: "🦈", 
      opinions: [
        "Your tech stack makes no sense. I'm out.",
        "You're using AI as a buzzword, there's no real moat here.",
        "I don't see how this scales past 10,000 users."
      ],
      goodOpinions: ["You're disrupting an archaic industry. I love it.", "The tech is solid. I'm making an offer."]
    },
    { name: "Lori", role: "The Consumer Queen", avatar: "👩‍💼", 
      opinions: [
        "I don't see the mass market appeal here.",
        "It's a clever product, but it's not a company.",
        "You haven't proven that people will actually pay for this."
      ],
      goodOpinions: ["This solves a real problem. I can sell millions of these.", "I love the branding. Let's make a deal."]
    }
  ];

  const panel = SHARKS.map(s => {
    const willInvest = isFunded ? (Math.random() > 0.3) : (isCond ? Math.random() > 0.7 : false);
    const opArray = willInvest ? s.goodOpinions : s.opinions;
    return {
      name: s.name,
      role: s.role,
      avatar: s.avatar,
      opinion: opArray[Math.floor(Math.random() * opArray.length)],
      wouldInvest: willInvest
    };
  });

  const strengthsPool = [
    "Clear target market definition",
    "Identified a genuine pain point",
    "Passionate delivery",
    "Good understanding of unit economics",
    "Scalable software architecture"
  ];

  const flawsPool = [
    "Valuation is disconnected from reality",
    "No defensible moat against incumbents",
    "Customer acquisition cost (CAC) is dangerously high",
    "Solution is a vitamin, not a painkiller",
    "Team lacks technical co-founder"
  ];

  const fixPool = [
    "Lower your valuation cap immediately.",
    "Get 3 letters of intent (LOIs) before pitching again.",
    "Remove the buzzwords and explain it like I'm 5.",
    "Focus on one niche instead of boiling the ocean."
  ];

  function pickN(arr, n) {
    const shuffled = [...arr].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, n);
  }

  let verdict = 'PASS ❌';
  if (isFunded) verdict = 'FUNDED 🦈';
  if (isCond) verdict = 'CONDITIONAL ⚡';

  return {
    fundingProbability: score,
    verdict: verdict,
    tagline: isFunded ? "A unicorn in the making." : "A solution looking for a problem.",
    sharks: panel,
    strengths: pickN(strengthsPool, isFunded ? 3 : 1),
    fatalFlaws: pickN(flawsPool, isFunded ? 1 : 3),
    improvements: pickN(fixPool, 3),
    investors: [`a16z (${industry})`, `Sequoia Capital`, `Y Combinator`]
  };
}

/* ── RENDER RESULTS ── */
function renderResults(data) {
  UI.screenLoading.classList.remove('active');
  UI.screenResult.classList.add('active');

  // Audio
  playResultFanfare(data.fundingProbability >= 70);

  // Gauge Animation
  const dashVal = 125.6; // total circumference
  const targetOffset = dashVal - (dashVal * (data.fundingProbability / 100));
  
  let color = 'var(--c-red)';
  if (data.fundingProbability >= 70) color = 'var(--c-green)';
  else if (data.fundingProbability >= 40) color = 'var(--c-gold)';

  UI.gaugePath.style.stroke = color;
  
  // Animate Number
  let curr = 0;
  const numInterval = setInterval(() => {
    curr += 2;
    if (curr >= data.fundingProbability) {
      curr = data.fundingProbability;
      clearInterval(numInterval);
    }
    UI.probValue.textContent = curr;
  }, 30);

  setTimeout(() => {
    UI.gaugePath.style.strokeDashoffset = targetOffset;
  }, 100);

  // Verdict Stamp
  UI.verdictStamp.innerHTML = data.verdict;
  UI.verdictStamp.style.color = color;
  UI.verdictStamp.classList.remove('stamp-anim');
  void UI.verdictStamp.offsetWidth; // trigger reflow
  setTimeout(() => UI.verdictStamp.classList.add('stamp-anim'), 1000);

  UI.tagline.textContent = `"${data.tagline}"`;

  // Sharks
  UI.sharksContainer.innerHTML = '';
  data.sharks.forEach((s, idx) => {
    setTimeout(() => {
      const card = document.createElement('div');
      card.className = 'shark-item';
      const badge = s.wouldInvest ? `<span class="invest-badge invest-yes">Would Invest ✅</span>` : `<span class="invest-badge invest-no">I'm Out ❌</span>`;
      card.innerHTML = `
        <div class="shark-avatar">${s.avatar}</div>
        <div class="shark-info">
          <h3>${s.name}</h3>
          <div class="shark-role">${s.role}</div>
          <div class="shark-opinion">"${s.opinion}"</div>
          ${badge}
        </div>
      `;
      UI.sharksContainer.appendChild(card);
    }, 1500 + (idx * 500));
  });

  // Columns
  UI.strengthsList.innerHTML = data.strengths.map(s => `<li>${s}</li>`).join('');
  UI.flawsList.innerHTML = data.fatalFlaws.map(f => `<li>${f}</li>`).join('');
  UI.fixesList.innerHTML = data.improvements.map(f => `<li>${f}</li>`).join('');
  UI.investorMatchList.innerHTML = pickN(data.investors, 2).map(i => `<span class="pill">${i}</span>`).join('');

  setTimeout(() => document.querySelector('.analysis-card.strengths').classList.add('show'), 3000);
  setTimeout(() => document.querySelector('.analysis-card.flaws').classList.add('show'), 3500);
  setTimeout(() => document.querySelector('.fixes-card').classList.add('show'), 4000);

  // Save history
  saveHistory(data.fundingProbability, data.verdict);
}

function pickN(arr, n) {
  return [...arr].sort(() => 0.5 - Math.random()).slice(0, n);
}

function resetApp() {
  UI.screenResult.classList.remove('active');
  UI.screenInput.classList.add('active');
  UI.textarea.value = '';
  updateWordCount();
  
  // reset cards
  document.querySelector('.analysis-card.strengths').classList.remove('show');
  document.querySelector('.analysis-card.flaws').classList.remove('show');
  document.querySelector('.fixes-card').classList.remove('show');
  UI.gaugePath.style.strokeDashoffset = 125.6;
  UI.probValue.textContent = "0";
}

/* ── HISTORY ── */
function saveHistory(prob, verdict) {
  let hist = JSON.parse(localStorage.getItem('pitch_history')) || [];
  const preview = UI.textarea.value.substring(0, 30) + '...';
  hist.unshift({ prob, verdict, preview });
  if (hist.length > 5) hist.pop();
  localStorage.setItem('pitch_history', JSON.stringify(hist));
  loadHistory();
}

function loadHistory() {
  let hist = JSON.parse(localStorage.getItem('pitch_history')) || [];
  UI.historyList.innerHTML = '';
  hist.forEach(h => {
    let color = h.prob >= 70 ? 'var(--c-green)' : (h.prob >= 40 ? 'var(--c-gold)' : 'var(--c-red)');
    const div = document.createElement('div');
    div.className = 'history-item';
    div.innerHTML = `
      <div class="history-item-prob" style="color: ${color}">${h.prob}%</div>
      <div class="section-label" style="margin-bottom:0">${h.verdict}</div>
      <div class="history-item-tag">"${h.preview}"</div>
    `;
    UI.historyList.appendChild(div);
  });
}
