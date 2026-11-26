// Panjiriwala Mumbai storefront demo. Confirm actual product prices, sizes and WhatsApp number before launch.
const WHATSAPP_NUMBER = "917719599710"; // Panjiriwala Mumbai WhatsApp (India country code + number, digits only)
const products = [
  {
    id: 1,
    name: "Traditional Panjiri",
    category: "panjiri",
    desc: "A wholesome taste of tradition, prepared for sharing.",
    price: 499,
    badge: "HOUSE FAVOURITE",
    image: "assets/protein powder.jpg",
    long: "A comforting traditional treat inspired by familiar homemade flavours. Confirm ingredients, pack size and price with Panjiriwala before publishing."
  },

  {
    id: 2,
    name: "Desi Ghee Laddoo",
    category: "laddoo",
    desc: "Rich, comforting and made for sharing.",
    price: 599,
    badge: "BESTSELLER",
    image: "assets/laddu.jpg",
    long: "A classic laddoo treat for family gatherings, festive moments and everyday cravings. Actual ingredients and pack size to be confirmed."
  },

  {
    id: 3,
    name: "Panjiri Gift Box",
    category: "gifting",
    desc: "A thoughtful gift for your loved ones.",
    price: 799,
    badge: "GIFT READY",
    image: "assets/gifting-special.jpg",
    long: "A gifting concept featuring traditional Panjiri. The gift packaging and contents can be finalized to suit the occasion."
  },

  {
    id: 4,
    name: "Festive Laddoo Box",
    category: "gifting",
    desc: "Celebrate life's sweetest occasions.",
    price: 899,
    badge: "CELEBRATION",
    image: "assets/laddu-box.jpg",
    long: "A festive gifting option for celebrations, visits and special moments. Confirm available assortments and box size."
  },
];
let cart = JSON.parse(localStorage.getItem("panjiriwalaCart") || "[]");
const productGrid = document.getElementById("productGrid");
const cartDrawer = document.getElementById("cartDrawer");
const cartOverlay = document.getElementById("cartOverlay");
const toast = document.getElementById("toast");
let currentQuickView = null;
function money(n){return new Intl.NumberFormat("en-IN",{style:"currency",currency:"INR",maximumFractionDigits:0}).format(n)}
function saveCart(){localStorage.setItem("panjiriwalaCart",JSON.stringify(cart));renderCart();const cartButton=document.getElementById("cartOpen");cartButton.classList.remove("bump");void cartButton.offsetWidth;cartButton.classList.add("bump")}
function productCard(p){return `<article class="product-card"><button class="product-image image-view" data-view="${p.id}" style="background-image:url('${p.image}')" aria-label="View ${p.name} image"><span class="product-badge">${p.badge}</span><span class="image-zoom-hint">View product ↗</span></button><div class="product-details"><h3>${p.name}</h3><p>${p.desc}</p><button class="quick-view-link" data-quick="${p.id}">View details ↗</button><div class="product-bottom"><span class="product-price">${money(p.price)}</span><button class="add-btn" data-add="${p.id}">Add to cart +</button></div></div></article>`}
function renderProducts(filter="all"){const shown=filter==="all"?products:products.filter(p=>p.category===filter);productGrid.innerHTML=shown.map(productCard).join("");productGrid.querySelectorAll(".product-card").forEach((card,i)=>{card.style.animationDelay=`${i*70}ms`;card.classList.remove("card-enter");void card.offsetWidth;card.classList.add("card-enter")})}
function addProduct(id){const p=products.find(x=>x.id===id);if(!p)return;const existing=cart.find(x=>x.id===id);if(existing)existing.qty++;else cart.push({...p,qty:1});saveCart();showToast(`${p.name} added to cart`)}
function renderCart(){const count=cart.reduce((s,i)=>s+i.qty,0);document.getElementById("cartCount").textContent=count;document.getElementById("cartTitleCount").textContent=`(${count})`;const total=cart.reduce((s,i)=>s+i.qty*i.price,0);document.getElementById("cartSubtotal").textContent=money(total);const container=document.getElementById("cartItems");if(!cart.length){container.innerHTML='<div class="empty-cart">Your cart is waiting for a little sweetness. 🍬</div>';return}container.innerHTML=cart.map(i=>`<div class="cart-item"><div class="cart-item-image" style="background-image:url('${i.image}')"></div><div><div class="cart-item-name">${i.name}</div><div class="cart-item-price">${money(i.price)} each</div><div class="qty-controls"><button data-qty="minus" data-id="${i.id}">−</button><span>${i.qty}</span><button data-qty="plus" data-id="${i.id}">+</button></div></div><button class="remove-item" data-remove="${i.id}">Remove</button></div>`).join("")}
function openCart(){cartDrawer.classList.add("open");cartOverlay.classList.add("open");document.body.style.overflow="hidden"}
function closeCart(){cartDrawer.classList.remove("open");cartOverlay.classList.remove("open");document.body.style.overflow=""}
let toastTimer;function showToast(msg){toast.textContent=msg;toast.classList.add("show");clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.classList.remove("show"),2300)}
function openQuickView(id){const p=products.find(x=>x.id===id);if(!p)return;currentQuickView=p;document.getElementById("quickViewImage").style.backgroundImage=`url('${p.image}')`;document.getElementById("quickViewBadge").textContent=p.badge;document.getElementById("quickViewName").textContent=p.name;document.getElementById("quickViewDesc").textContent=p.long;document.getElementById("quickViewPrice").textContent=money(p.price);const overlay=document.getElementById("quickViewOverlay");overlay.classList.add("open");overlay.setAttribute("aria-hidden","false");document.body.style.overflow="hidden"}
function closeQuickView(){const overlay=document.getElementById("quickViewOverlay");overlay.classList.remove("open");overlay.setAttribute("aria-hidden","true");document.body.style.overflow="";currentQuickView=null}
productGrid.addEventListener("click",e=>{const add=e.target.closest("[data-add]");const view=e.target.closest("[data-view]");const quick=e.target.closest("[data-quick]");if(add)addProduct(Number(add.dataset.add));if(view)openQuickView(Number(view.dataset.view));if(quick)openQuickView(Number(quick.dataset.quick))});
document.querySelectorAll(".filter-chip").forEach(btn=>btn.addEventListener("click",()=>{document.querySelectorAll(".filter-chip").forEach(b=>b.classList.remove("active"));btn.classList.add("active");renderProducts(btn.dataset.filter)}));
document.getElementById("quickViewClose").addEventListener("click",closeQuickView);document.getElementById("quickViewOverlay").addEventListener("click",e=>{if(e.target.id==="quickViewOverlay")closeQuickView()});document.getElementById("quickViewAdd").addEventListener("click",()=>{if(currentQuickView){addProduct(currentQuickView.id);closeQuickView()}});
document.getElementById("cartOpen").addEventListener("click",openCart);document.getElementById("cartClose").addEventListener("click",closeCart);cartOverlay.addEventListener("click",closeCart);
document.getElementById("cartItems").addEventListener("click",e=>{const qty=e.target.closest("[data-qty]");const remove=e.target.closest("[data-remove]");if(qty){const item=cart.find(i=>i.id===Number(qty.dataset.id));if(!item)return;if(qty.dataset.qty==="plus")item.qty++;else item.qty--;if(item.qty<=0)cart=cart.filter(i=>i.id!==item.id);saveCart()}if(remove){cart=cart.filter(i=>i.id!==Number(remove.dataset.remove));saveCart()}});
function orderText(){const lines=cart.map(i=>`• ${i.name} x ${i.qty} — ${money(i.qty*i.price)}`).join("\n");const total=cart.reduce((s,i)=>s+i.price*i.qty,0);return `Hello Panjiriwala Mumbai! I'd like to place an order:\n\n${lines}\n\nSubtotal: ${money(total)}\n\nPlease share delivery details and next steps.`}
document.getElementById("checkoutBtn").addEventListener("click",()=>{if(!cart.length){showToast("Your cart is empty — add something sweet first!");return}if(!WHATSAPP_NUMBER){showToast("WhatsApp number is not configured yet.");return}window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(orderText())}`,"_blank","noopener,noreferrer")});
document.getElementById("whatsappContact").addEventListener("click",e=>{e.preventDefault();if(!WHATSAPP_NUMBER){showToast("WhatsApp number is not configured yet.");return}window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hello Panjiriwala Mumbai! I'd like to enquire about your products and gifting.")}`,"_blank","noopener,noreferrer")});
document.getElementById("menuToggle").addEventListener("click",()=>document.getElementById("mainNav").classList.toggle("open"));document.querySelectorAll("#mainNav a").forEach(a=>a.addEventListener("click",()=>document.getElementById("mainNav").classList.remove("open")));
document.getElementById("year").textContent=new Date().getFullYear();renderProducts();renderCart();
const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add("visible");observer.unobserve(entry.target)}}),{threshold:.12});document.querySelectorAll(".reveal").forEach(el=>observer.observe(el));
