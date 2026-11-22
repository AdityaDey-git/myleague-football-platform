let teams = [];
let matches = [];
let venues = [];
let curMatchId = 0;

function login() {
  let oName = document.getElementById("orgName").value.trim();
  let tName = document.getElementById("tourneyName").value.trim();
  let tEmail = document.getElementById("tourneyEmail").value.trim();
  let tContact = document.getElementById("contactNum").value.trim();
  
  if (oName === "" || tName === "" || tEmail === "" || tContact === "") {
    alert("Please fill in all details before starting!");
    return;
  }
  
  document.getElementById("dashTitle").innerText = tName;
  document.getElementById("profOrg").innerText = oName;
  document.getElementById("profName").innerText = tName;
  document.getElementById("profEmail").innerText = tEmail;
  document.getElementById("profContact").innerText = tContact;

  document.getElementById("login").classList.remove("active");
  document.getElementById("dash").classList.add("active");
  renderData();
}

function logout() {
  document.getElementById("dash").classList.remove("active");
  document.getElementById("login").classList.add("active");
}

function addTeam() {
  let name = document.getElementById("tName").value.trim();
  let mgr = document.getElementById("tMgr").value.trim();
  if (name !== "" && mgr !== "") {
    teams.push({ id: teams.length, name: name, mgr: mgr, starters: [], subs: [], p: 0, w: 0, d: 0, l: 0, pts: 0 });
    document.getElementById("tName").value = "";
    document.getElementById("tMgr").value = "";
    renderData();
  }
}

function addPlayer() {
  let tId = document.getElementById("pTeam").value;
  let name = document.getElementById("pName").value.trim();
  let pos = document.getElementById("pPos").value;
  
  if (name !== "" && tId !== "") {
    let team = teams[tId];
    if (pos === "Starter" && team.starters.length < 11) {
      team.starters.push(name);
    } else if (pos === "Sub" && team.subs.length < 5) {
      team.subs.push(name);
    } else {
      alert("Limit reached! Max 11 Starters and 5 Substitutes.");
    }
    document.getElementById("pName").value = "";
    renderData();
  }
}

function addVenue() {
  let name = document.getElementById("vName").value.trim();
  let city = document.getElementById("vCity").value.trim();
  let cap = document.getElementById("vCap").value.trim();
  if (name !== "" && city !== "") {
    venues.push({ name: name, city: city, cap: cap });
    document.getElementById("vName").value = "";
    document.getElementById("vCity").value = "";
    document.getElementById("vCap").value = "";
    renderData();
  }
}

function addMatch() {
  let h = document.getElementById("mHome").value;
  let a = document.getElementById("mAway").value;
  let v = document.getElementById("mVen").value;
  let d = document.getElementById("mDate").value;
  
  if (h !== a && h !== "" && a !== "" && v !== "" && d !== "") {
    matches.push({ id: matches.length, h: h, a: a, v: v, d: d, done: false, hs: 0, as: 0 });
    document.getElementById("mDate").value = "";
    renderData();
  } else {
    alert("Please select two different teams, a venue, and a match date.");
  }
}

function renderData() {
  // 1. Standings Table
  let tb = "<tr><th>Pos</th><th>Team</th><th>Played</th><th>Won</th><th>Drawn</th><th>Lost</th><th>PTS</th></tr>";
  let sortedTeams = [...teams].sort(function(a, b) { return b.pts - a.pts; });
  
  for (let i = 0; i < sortedTeams.length; i++) {
    let t = sortedTeams[i];
    tb += "<tr><td>" + (i + 1) + "</td><td>" + t.name + "</td><td>" + t.p + "</td><td>" + t.w + "</td><td>" + t.d + "</td><td>" + t.l + "</td><td><strong>" + t.pts + "</strong></td></tr>";
  }
  document.getElementById("ptsTable").innerHTML = tb;

  // 2. Select Dropdowns
  let opts = "";
  for (let i = 0; i < teams.length; i++) {
    opts += "<option value='" + teams[i].id + "'>" + teams[i].name + "</option>";
  }
  document.getElementById("pTeam").innerHTML = opts;
  document.getElementById("mHome").innerHTML = opts;
  document.getElementById("mAway").innerHTML = opts;

  let vOpts = "";
  for (let i = 0; i < venues.length; i++) {
    vOpts += "<option value='" + venues[i].name + "'>" + venues[i].name + "</option>";
  }
  document.getElementById("mVen").innerHTML = vOpts;

  // 3. Teams List
  let tl = "";
  for (let i = 0; i < teams.length; i++) {
    tl += "<div class='box'><h3 class='accent'>" + teams[i].name + "</h3><p>Manager: " + teams[i].mgr + "</p></div>";
  }
  document.getElementById("teamList").innerHTML = tl;

  // 4. Squads List
  let sl = "";
  for (let i = 0; i < teams.length; i++) {
    let t = teams[i];
    sl += "<div class='box'><h3 class='accent'>" + t.name + " Squad</h3>";
    sl += "<p><strong>Starters (" + t.starters.length + "/11):</strong> " + (t.starters.join(", ") || "None") + "</p>";
    sl += "<p><strong>Substitutes (" + t.subs.length + "/5):</strong> " + (t.subs.join(", ") || "None") + "</p></div>";
  }
  document.getElementById("squadList").innerHTML = sl;

  // 5. Venues List
  let vl = "";
  for (let i = 0; i < venues.length; i++) {
    vl += "<div class='box'><h3 class='accent'>" + venues[i].name + "</h3><p>City: " + venues[i].city + " | Capacity: " + venues[i].cap + "</p></div>";
  }
  document.getElementById("venueList").innerHTML = vl;

  // 6. Matches List
  let ml = "";
  for (let i = 0; i < matches.length; i++) {
    let m = matches[i];
    ml += "<div class='box'><p><strong>" + teams[m.h].name + " vs " + teams[m.a].name + "</strong> | Venue: " + m.v + " | Date: " + m.d + "</p>";
    if (m.done) {
      ml += "<p class='accent'>Final Score: " + m.hs + " - " + m.as + "</p></div>";
    } else {
      ml += "<button onclick='openModal(" + m.id + ")'>Add Score</button></div>";
    }
  }
  document.getElementById("matchList").innerHTML = ml;
}

function openModal(id) {
  curMatchId = id;
  let m = matches[id];
  document.getElementById("mTitle").innerText = teams[m.h].name + " vs " + teams[m.a].name;
  document.getElementById("modal").classList.add("active");
}

function closeModal() {
  document.getElementById("modal").classList.remove("active");
}

function saveScore() {
  let m = matches[curMatchId];
  m.hs = parseInt(document.getElementById("sHome").value) || 0;
  m.as = parseInt(document.getElementById("sAway").value) || 0;
  m.done = true;

  let ht = teams[m.h];
  let at = teams[m.a];
  ht.p++;
  at.p++;

  if (m.hs > m.as) {
    ht.w++; ht.pts += 3; at.l++;
  } else if (m.as > m.hs) {
    at.w++; at.pts += 3; ht.l++;
  } else {
    ht.d++; ht.pts += 1; at.d++; at.pts += 1;
  }

  document.getElementById("sHome").value = "";
  document.getElementById("sAway").value = "";
  closeModal();
  renderData();
}