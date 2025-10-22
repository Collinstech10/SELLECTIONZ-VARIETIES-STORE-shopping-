
// SELLECTIONZ - script.js
if(window.emailjs){ try{ emailjs.init("99FFfPyHHtLcv7wK-"); }catch(e){} }

const PRODUCTS = [
  {id:1,name:"Classic Ankara Fabric",price:3500,category:"fabrics",image:""},
  {id:2,name:"Men's Shirt",price:5000,category:"male",image:""},
  {id:3,name:"Women's Gown",price:8000,category:"female",image:""}
];
function renderProducts(){
  const grid = document.getElementById('product-grid');
  if(!grid) return;
  grid.innerHTML = '';
  PRODUCTS.forEach(p=>{
    const div = document.createElement('div');
    div.className='card';
    div.innerHTML = `<h4>${p.name}</h4><p>₦${p.price}</p><button onclick='addToCart(${p.id})' class='btn'>Add to Cart</button>`;
    grid.appendChild(div);
  });
}
document.addEventListener('DOMContentLoaded',()=>{ renderProducts(); loadAuthState(); loadCart(); });

function getCart(){return JSON.parse(localStorage.getItem('cartItems')||'[]');}
function saveCart(items){ localStorage.setItem('cartItems', JSON.stringify(items)); localStorage.setItem('cartTotal', calculateTotal(items)); }
function calculateTotal(items){ return items.reduce((s,i)=>s + (i.price * i.quantity),0); }
function addToCart(productId){
  const prod = PRODUCTS.find(p=>p.id===productId);
  if(!prod) return alert('Product not found');
  const items = getCart();
  const existing = items.find(i=>i.id===prod.id);
  if(existing) existing.quantity++;
  else items.push({id:prod.id,name:prod.name,price:prod.price,quantity:1});
  saveCart(items);
  alert('Added to cart');
}

function loadCart(){
  const items = getCart();
  const container = document.getElementById('cart-items');
  const summary = document.getElementById('cart-summary');
  if(container) container.innerHTML = items.map(it=>`<div>${it.name} - ₦${it.price} x ${it.quantity}</div>`).join('') || '<p>Cart is empty</p>';
  if(summary) summary.innerHTML = `<p>Total: ₦${calculateTotal(items)}</p>`;
  const link = document.getElementById('checkout-link');
  if(link) link.style.pointerEvents = items.length? 'auto':'none';
}

const WHATSAPP_NUMBER = '2349028670432';
const EMAIL_SERVICE = 'service_uioj559';
const EMAIL_TEMPLATE = 'template_53azhem';

function submitCheckoutForm(e){
  e.preventDefault && e.preventDefault();
  const fullName = document.getElementById('fullName').value || '';
  const phone = document.getElementById('phone').value || '';
  const email = document.getElementById('email').value || '';
  const address = document.getElementById('address').value || '';
  const items = getCart();
  if(!items.length){ alert('Your cart is empty'); return; }
  const productList = items.map(item=>`${item.name} (₦${item.price} x ${item.quantity})`).join("\n");
  const totalPrice = calculateTotal(items);

  if(window.emailjs){
    emailjs.send(EMAIL_SERVICE, EMAIL_TEMPLATE, {
      full_name: fullName,
      customer_email: email,
      phone: phone,
      address: address,
      total: totalPrice,
      order_details: productList
    }).then(function(resp){
      console.log('Email sent',resp);
      const message = `Hello SELLECTIONZ! I have completed my payment.\n\nOrder Details:\n${productList}\n\nName: ${fullName}\nPhone: ${phone}\nAddress: ${address}\nTotal: ₦${totalPrice}`;
      const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
      localStorage.removeItem('cartItems'); localStorage.removeItem('cartTotal');
      // wait briefly then redirect
      setTimeout(()=>{ window.location.href = url; }, 300);
    }).catch(function(err){ console.error('Email error',err); alert('Failed to send order. Please try again.'); });
  } else {
    alert('Email service not available. Redirecting to WhatsApp.');
    const message = `Hello SELLECTIONZ! I have completed my payment.\n\nOrder Details:\n${productList}\n\nName: ${fullName}\nPhone: ${phone}\nAddress: ${address}\nTotal: ₦${totalPrice}`;
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    localStorage.removeItem('cartItems'); localStorage.removeItem('cartTotal');
    window.location.href = url;
  }
}

document.addEventListener('DOMContentLoaded',()=>{
  const form = document.getElementById('checkout-form');
  if(form) form.addEventListener('submit', submitCheckoutForm);

  const loginForm = document.getElementById('login-form');
  if(loginForm) loginForm.addEventListener('submit', function(e){
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const pwd = document.getElementById('login-password').value;
    const users = JSON.parse(localStorage.getItem('sel_users')||'[]');
    const u = users.find(x=>x.email===email && x.password===pwd);
    if(u){ localStorage.setItem('sel_current_user', JSON.stringify(u)); alert('Logged in'); location.href='shop.html'; }
    else alert('Invalid credentials');
  });

  const regForm = document.getElementById('register-form');
  if(regForm) regForm.addEventListener('submit', function(e){
    e.preventDefault();
    const name=document.getElementById('reg-name').value; const email=document.getElementById('reg-email').value; const pwd=document.getElementById('reg-password').value;
    const users=JSON.parse(localStorage.getItem('sel_users')||'[]'); if(users.find(u=>u.email===email)){ alert('Email already registered'); return; }
    users.push({name:name,email:email,password:pwd}); localStorage.setItem('sel_users',JSON.stringify(users)); alert('Registered. Please login'); location.href='login.html';
  });
  loadAuthState();
  loadCart();
});

function loadAuthState(){
  const authBtn = document.getElementById('auth-btn');
  const user = JSON.parse(localStorage.getItem('sel_current_user')||'null');
  if(authBtn){
    if(user){ authBtn.textContent='Logout'; authBtn.href='#'; authBtn.onclick = ()=>{ localStorage.removeItem('sel_current_user'); location.href='index.html'; }; }
    else { authBtn.textContent='Login'; authBtn.href='login.html'; }
  }
}

function zaraShowProducts(){
  const resp = document.getElementById('zara-response');
  if(!resp) return;
  if(!PRODUCTS || !PRODUCTS.length){ resp.textContent = 'Sorry, can\'t access the information now.'; return; }
  resp.innerHTML = '<strong>Available products:</strong><br>' + PRODUCTS.map(p=>`- ${p.name} (₦${p.price})`).join('<br>');
}


