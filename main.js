// main.js - handles diseases, search, register/login (front-end localStorage) and UI interactions

document.addEventListener('DOMContentLoaded', ()=> {
  // sample disease dataset
  const diseases = [
    {
      id:1,
      name:"Late Blight",
      crops:"Potato, Tomato",
      img:"https://images.unsplash.com/photo-1506806732259-39c2d0268443?q=80&w=1200&auto=format&fit=crop",
      symptoms:"Dark brown patches on leaves, rapid leaf collapse, fruit rot",
      causes:"Fungal-like oomycete Phytophthora infestans; cool, wet conditions",
      remedies:"Remove infected plants, improve drainage, use certified seed and resistant varieties, apply fungicides as last resort."
    },
    {
      id:2,
      name:"Powdery Mildew",
      crops:"Grapes, Peas, Beans",
      img:"https://images.unsplash.com/photo-1528825871115-3581a5387919?q=80&w=1200&auto=format&fit=crop",
      symptoms:"White powdery coating on leaf surfaces; leaf distortion",
      causes:"Several fungi; poor air circulation and high humidity",
      remedies:"Improve spacing, prune for airflow, use sulfur or neem sprays, introduce resistant varieties."
    },
    {
      id:3,
      name:"Rust Disease",
      crops:"Wheat, Beans",
      img:"https://images.unsplash.com/photo-1524594154902-1f7590b3220a?q=80&w=1200&auto=format&fit=crop",
      symptoms:"Orange/brown pustules on stems and leaves, defoliation",
      causes:"Puccinia spp. fungi; wind-dispersed spores",
      remedies:"Rotate crops, remove volunteer hosts, use resistant cultivars and timely fungicide if severe."
    },
    {
      id:4,
      name:"Bacterial Leaf Blight",
      crops:"Rice",
      img:"https://images.unsplash.com/photo-1519337265831-281ec6cc8514?q=80&w=1200&auto=format&fit=crop",
      symptoms:"Yellowing streaks that turn brown, leaf drying",
      causes:"Xanthomonas oryzae; spread via water splashes and tools",
      remedies:"Use clean seed, improve field drainage, sanitize tools, follow proper irrigation management."
    },
    {
      id:5,
      name:"Mosaic Virus",
      crops:"Tomato, Tobacco, Cucumber",
      img:"https://images.unsplash.com/photo-1535909339361-0a13b3098f5b?q=80&w=1200&auto=format&fit=crop",
      symptoms:"Mottled light/dark patches on leaves, stunting",
      causes:"Viruses spread by aphids and contaminated tools",
      remedies:"Remove infected plants, control insect vectors, use virus-free seed, crop hygiene."
    },
    {
      id:6,
      name:"Root Rot (Pythium/Fusarium)",
      crops:"Vegetables, Cereals",
      img:"https://images.unsplash.com/photo-1501004318641-b39e6451bec6?q=80&w=1200&auto=format&fit=crop",
      symptoms:"Poor germination, stunted seedlings, brown water-soaked roots",
      causes:"Soil-borne pathogens favored by waterlogged soils",
      remedies:"Improve drainage, avoid overwatering, solarize soil, use well-composted organic matter, rotate crops."
    },
    {
      id:7,
      name:"Leaf Spot",
      crops:"Various (fruits, vegetables)",
      img:"https://images.unsplash.com/photo-1595433562696-d6fd8f7b5d9f?q=80&w=1200&auto=format&fit=crop",
      symptoms:"Small round spots that enlarge and coalesce, yellow halo",
      causes:"Fungal or bacterial pathogens under humid conditions",
      remedies:"Remove affected leaves, avoid overhead irrigation, apply biological controls and improve field hygiene."
    },
    {
      id:8,
      name:"Bacterial Canker",
      crops:"Citrus, Stone fruits",
      img:"https://images.unsplash.com/photo-1501004318641-b39e6451bec6?q=80&w=1200&auto=format&fit=crop",
      symptoms:"Sunken lesions on stems, gummosis, dieback",
      causes:"Bacterial infection entering through wounds",
      remedies:"Prune infected parts, disinfect tools, apply proper nutrient management and consult extension."
    }
  ];

  // expose diseases to window for other page scripts
  window.GG_DATA = { diseases };

  // Render disease cards if on diseases page
  const diseaseList = document.getElementById('diseaseList');
  if (diseaseList) renderDiseaseCards(diseases);

  // Search functionality
  const searchInput = document.getElementById('dsearch');
  const searchBtn = document.getElementById('searchBtn');
  if (searchBtn) {
    searchBtn.addEventListener('click', () => {
      const q = (searchInput.value || '').trim().toLowerCase();
      const res = diseases.filter(d=>{
        return d.name.toLowerCase().includes(q) ||
               d.symptoms.toLowerCase().includes(q) ||
               d.crops.toLowerCase().includes(q);
      });
      renderDiseaseCards(res.length ? res : diseases);
    });
    searchInput.addEventListener('keyup', (e)=> {
      if (e.key === 'Enter') searchBtn.click();
    });
  }

  // contact form
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e)=>{
      e.preventDefault();
      alert('Message sent. Thank you — GreenGuard team will reach out to you.');
      contactForm.reset();
    });
  }

  // register/login forms
  const registerForm = document.getElementById('registerForm');
  if (registerForm){
    registerForm.addEventListener('submit', e=>{
      e.preventDefault();
      const name = document.getElementById('rname').value.trim();
      const email = document.getElementById('remail').value.trim().toLowerCase();
      const role = document.getElementById('rrole').value;
      const pass = document.getElementById('rpassword').value;
      if (!name || !email || !role || pass.length < 6) return alert('Please fill correctly.');
      let users = JSON.parse(localStorage.getItem('GG_USERS') || '[]');
      if (users.some(u=>u.email===email)) return alert('Email already registered.');
      users.push({name,email,role,pass});
      localStorage.setItem('GG_USERS', JSON.stringify(users));
      alert('Registered successfully. You can login now.');
      window.location.href = 'login.html';
    });
  }

  const loginForm = document.getElementById('loginForm');
  if (loginForm){
    loginForm.addEventListener('submit', e=>{
      e.preventDefault();
      const email = (document.getElementById('lemail').value || '').trim().toLowerCase();
      const pass = document.getElementById('lpassword').value;
      let users = JSON.parse(localStorage.getItem('GG_USERS') || '[]');
      const user = users.find(u=>u.email===email && u.pass===pass);
      if (!user) return alert('Invalid credentials.');
      localStorage.setItem('GG_AUTH', JSON.stringify({name:user.name,email:user.email,role:user.role}));
      alert('Login successful. Redirecting to Home.');
      window.location.href = 'index.html';
    });
  }

  // show user display if logged in
  showUser();

  // logout detection: clicking the user name will logout
  document.addEventListener('click', (e)=>{
    if (e.target && e.target.id === 'userDisplay') {
      if (confirm('Logout?')) {
        localStorage.removeItem('GG_AUTH');
        showUser();
        alert('Logged out.');
      }
    }
  });

});

// Render disease cards
function renderDiseaseCards(list){
  const container = document.getElementById('diseaseList');
  if (!container) return;
  container.innerHTML = '';
  list.forEach(d => {
    const el = document.createElement('article');
    el.className = 'd-card';
    el.innerHTML = `
      <img src="${d.img}" alt="${d.name}">
      <h4>${d.name}</h4>
      <small class="badge">Crops: ${d.crops}</small>
      <p><strong>Symptoms:</strong> ${d.symptoms}</p>
      <p><strong>Causes:</strong> ${d.causes}</p>
      <p><strong>Remedies:</strong> ${d.remedies}</p>
      <div style="margin-top:10px"><button class="btn btn-outline" onclick="saveForLater(${d.id})">Save</button></div>
    `;
    container.appendChild(el);
  });
}

// simple save favorite function (uses localStorage)
function saveForLater(id){
  const data = window.GG_DATA.diseases;
  const found = data.find(d=>d.id===id);
  if (!found) return alert('Not found');
  let fav = JSON.parse(localStorage.getItem('GG_FAV') || '[]');
  if (fav.some(f=>f.id===id)) return alert('Already saved.');
  fav.push(found);
  localStorage.setItem('GG_FAV', JSON.stringify(fav));
  alert('Saved to favorites (local).');
}

// show user if logged in
function showUser(){
  const auth = JSON.parse(localStorage.getItem('GG_AUTH') || 'null');
  const els = [
    document.getElementById('userDisplay'),
    document.getElementById('userDisplayReg'),
    document.getElementById('userDisplayLog'),
    document.getElementById('userDisplaySym'),
    document.getElementById('userDisplayRem'),
    document.getElementById('userDisplaySol'),
    document.getElementById('userDisplayAbout'),
    document.getElementById('userDisplayContact')
  ];
  els.forEach(el=>{ if(el) el.textContent = ''; });
  if (auth) {
    const name = auth.name.split(' ')[0];
    const userEl = document.getElementById('userDisplay');
    if (userEl) userEl.innerHTML = `<span style="color:#fff;cursor:pointer;font-weight:700">${name} ⎯ click to logout</span>`;
    els.forEach(el=>{ if(el) el.textContent = `${name}`; });
    // hide register/login buttons
    const loginBtn = document.getElementById('loginBtn');
    const regBtn = document.getElementById('regBtn');
    if (loginBtn) loginBtn.style.display = 'none';
    if (regBtn) regBtn.style.display = 'none';
  } else {
    const loginBtn = document.getElementById('loginBtn');
    const regBtn = document.getElementById('regBtn');
    if (loginBtn) loginBtn.style.display = 'inline-block';
    if (regBtn) regBtn.style.display = 'inline-block';
  }
}
