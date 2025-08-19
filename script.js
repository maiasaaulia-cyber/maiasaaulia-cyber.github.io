// Starfield background
const canvas = document.getElementById('stars');
const ctx = canvas.getContext('2d');
let stars = [];
function resizeCanvas(){canvas.width = innerWidth; canvas.height = innerHeight}
addEventListener('resize', resizeCanvas); resizeCanvas();
function createStars(){
  const count = Math.min(250, Math.floor((innerWidth*innerHeight)/6000));
  stars = Array.from({length: count}, () => ({
    x: Math.random()*canvas.width,
    y: Math.random()*canvas.height,
    r: Math.random()*1.2+0.3,
    s: Math.random()*0.5+0.2
  }));
}
function drawStars(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  for(const st of stars){
    ctx.beginPath();
    ctx.arc(st.x, st.y, st.r, 0, Math.PI*2);
    ctx.fillStyle = 'rgba(255,255,255,.9)';
    ctx.fill();
    st.x += st.s;
    if(st.x > canvas.width) st.x = 0;
  }
  requestAnimationFrame(drawStars);
}
createStars(); drawStars();

// Year
document.getElementById('year').textContent = new Date().getFullYear();

// Slider
const slidesWrap = document.querySelector('.slides');
const slides = [...document.querySelectorAll('.slide')];
const prevBtn = document.querySelector('.slide-btn.prev');
const nextBtn = document.querySelector('.slide-btn.next');
const dotsWrap = document.querySelector('.dots');
let index = 0;
function updateSlider(){
  slidesWrap.style.transform = `translateX(-${index*100}%)`;
  dotsWrap.querySelectorAll('button').forEach((d,i)=>d.classList.toggle('active', i===index));
}
slides.forEach((_,i)=>{
  const b = document.createElement('button');
  b.addEventListener('click', ()=>{ index = i; updateSlider(); });
  dotsWrap.appendChild(b);
});
dotsWrap.firstChild.classList.add('active');
prevBtn.addEventListener('click', ()=>{ index = (index-1+slides.length)%slides.length; updateSlider(); });
nextBtn.addEventListener('click', ()=>{ index = (index+1)%slides.length; updateSlider(); });
setInterval(()=>{ index = (index+1)%slides.length; updateSlider(); }, 5000);

// Products
const products = [
  {id:'bk001', title:'Kosmos: Alam Semesta', desc:'Menjelajah sejarah dan rahasia kosmos.', price:149000},
  {id:'bk002', title:'Seni Berpikir Jernih', desc:'Bias kognitif dan pengambilan keputusan.', price:99000},
  {id:'bk003', title:'Filsafat untuk Hidup', desc:'Stoikisme praktis sehari-hari.', price:119000},
  {id:'bk004', title:'Fisika Populer', desc:'Konsep sulit jadi mudah dipahami.', price:129000},
  {id:'bk005', title:'Novel Estetik', desc:'Romansa lembut berlatar aurora.', price:89000},
  {id:'bk006', title:'Produktivitas Tanpa Burnout', desc:'Bangun sistem hidup seimbang.', price:109000}
];

const grid = document.getElementById('productGrid');
products.forEach(p=>{
  const el = document.createElement('article');
  el.className = 'card';
  el.innerHTML = `
    <div class="thumb"></div>
    <div class="body">
      <h3>${p.title}</h3>
      <p>${p.desc}</p>
      <div class="price">Rp${p.price.toLocaleString('id-ID')}</div>
      <div class="actions">
        <button class="btn ghost" data-id="${p.id}">Detail</button>
        <button class="btn primary add" data-id="${p.id}">Tambah</button>
      </div>
    </div>`;
  grid.appendChild(el);
});

// Cart logic with localStorage
const cartDrawer = document.getElementById('cartDrawer');
const openCart = document.getElementById('openCart');
const closeCart = document.getElementById('closeCart');
const cartItems = document.getElementById('cartItems');
const cartCount = document.getElementById('cartCount');
const cartTotal = document.getElementById('cartTotal');
const checkoutBtn = document.getElementById('checkoutBtn');

const CART_KEY = 'galaxy_cart_v1';
function getCart(){ return JSON.parse(localStorage.getItem(CART_KEY) || '[]'); }
function saveCart(c){ localStorage.setItem(CART_KEY, JSON.stringify(c)); }
function addToCart(id){
  const c = getCart();
  const i = c.find(x=>x.id===id);
  if(i) i.qty++; else c.push({id, qty:1});
  saveCart(c); renderCart();
}
function removeFromCart(id){
  let c = getCart().filter(x=>x.id!==id);
  saveCart(c); renderCart();
}
function updateQty(id, delta){
  const c = getCart();
  const i = c.find(x=>x.id===id);
  if(!i) return;
  i.qty += delta;
  if(i.qty<=0){ return removeFromCart(id); }
  saveCart(c); renderCart();
}
function renderCart(){
  const c = getCart();
  cartItems.innerHTML = '';
  let total = 0, count = 0;
  c.forEach(item=>{
    const p = products.find(pp=>pp.id===item.id);
    const subtotal = p.price * item.qty;
    total += subtotal; count += item.qty;
    const row = document.createElement('div');
    row.className = 'cart-item';
    row.innerHTML = `
      <div class="thumb"></div>
      <div>
        <div style="font-weight:700">${p.title}</div>
        <div class="qty">
          <button aria-label="kurang" onclick="updateQty('${p.id}',-1)">−</button>
          <span>${item.qty}</span>
          <button aria-label="tambah" onclick="updateQty('${p.id}',1)">+</button>
        </div>
        <button class="btn icon" onclick="removeFromCart('${p.id}')">Hapus</button>
      </div>
      <div>Rp${subtotal.toLocaleString('id-ID')}</div>`;
    cartItems.appendChild(row);
  });
  cartCount.textContent = count;
  cartTotal.textContent = 'Rp'+ total.toLocaleString('id-ID');
}
window.updateQty = updateQty; // expose for inline onclick

document.body.addEventListener('click', (e)=>{
  if(e.target.classList.contains('add')){
    const id = e.target.dataset.id;
    addToCart(id);
    cartDrawer.classList.add('open');
  }
});
openCart.addEventListener('click', ()=>cartDrawer.classList.add('open'));
closeCart.addEventListener('click', ()=>cartDrawer.classList.remove('open'));

// Contact form (mock)
document.getElementById('contactForm').addEventListener('submit', (e)=>{
  e.preventDefault();
  const status = document.getElementById('contactStatus');
  status.textContent = 'Terima kasih! Pesan Anda sudah kami terima.';
  e.target.reset();
  setTimeout(()=> status.textContent='', 4000);
});

// Checkout
const checkoutModal = document.getElementById('checkoutModal');
checkoutBtn.addEventListener('click', ()=>{
  const cart = getCart();
  if(!cart.length){ alert('Keranjang masih kosong.'); return; }
  const summary = document.getElementById('checkoutSummary');
  const rows = cart.map(item=>{
    const p = products.find(pp=>pp.id===item.id);
    return `• ${p.title} × ${item.qty} — Rp${(p.price*item.qty).toLocaleString('id-ID')}`;
  }).join('<br>');
  const total = cart.reduce((a,item)=> a + products.find(p=>p.id===item.id).price*item.qty, 0);
  summary.innerHTML = rows + '<hr>' + '<b>Total: Rp'+ total.toLocaleString('id-ID') + '</b>';
  checkoutModal.showModal();
});

document.getElementById('checkoutForm').addEventListener('submit', (e)=>{
  e.preventDefault();
  const data = Object.fromEntries(new FormData(e.target).entries());
  const order = { items: getCart(), customer: data, time: new Date().toISOString() };
  localStorage.setItem('galaxy_last_order', JSON.stringify(order));
  document.getElementById('checkoutStatus').textContent = 'Pesanan dikonfirmasi! Rincian tersimpan di browser Anda.';
  localStorage.removeItem(CART_KEY);
  renderCart();
  setTimeout(()=> checkoutModal.close(), 1200);
});

// init cart on load
renderCart();
