/* SBB Foundation — Product cart & WhatsApp checkout */
const WHATSAPP_NUMBER = '919166010400';

const cart = [];

function parsePrice(el) {
    const text = el?.textContent || '0';
    return parseInt(text.replace(/[^\d]/g, ''), 10) || 0;
}

function formatPrice(n) {
    return '₹' + n.toLocaleString('en-IN');
}

function getProductFromCard(card) {
    const name = card.querySelector('h4')?.textContent.trim() || 'Product';
    const price = parsePrice(card.querySelector('.sale-price'));
    const id = name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
    return { id, name, price };
}

function cartCount() {
    return cart.reduce((sum, item) => sum + item.qty, 0);
}

function cartTotal() {
    return cart.reduce((sum, item) => sum + item.price * item.qty, 0);
}

function updateCartBadge() {
    const badge = document.getElementById('cart-count');
    if (!badge) return;
    const count = cartCount();
    badge.textContent = count;
    badge.hidden = count === 0;
}

function renderCartItems() {
    const list = document.getElementById('cart-items');
    const empty = document.getElementById('cart-empty');
    const footer = document.getElementById('cart-footer');
    if (!list) return;

    if (cart.length === 0) {
        list.innerHTML = '';
        empty.hidden = false;
        footer.hidden = true;
        return;
    }

    empty.hidden = true;
    footer.hidden = false;

    list.innerHTML = cart.map(item => `
        <div class="cart-item" data-id="${item.id}">
            <div class="cart-item-info">
                <strong>${item.name}</strong>
                <span>${formatPrice(item.price)} each</span>
            </div>
            <div class="cart-item-actions">
                <button type="button" class="qty-btn" data-action="dec" data-id="${item.id}" aria-label="Decrease quantity">−</button>
                <span class="qty-val">${item.qty}</span>
                <button type="button" class="qty-btn" data-action="inc" data-id="${item.id}" aria-label="Increase quantity">+</button>
                <button type="button" class="cart-remove" data-id="${item.id}" aria-label="Remove">✕</button>
            </div>
            <div class="cart-item-subtotal">${formatPrice(item.price * item.qty)}</div>
        </div>
    `).join('');

    document.getElementById('cart-total').textContent = formatPrice(cartTotal());

    list.querySelectorAll('.qty-btn, .cart-remove').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.dataset.id;
            const item = cart.find(i => i.id === id);
            if (!item) return;

            if (btn.classList.contains('cart-remove')) {
                const idx = cart.indexOf(item);
                cart.splice(idx, 1);
            } else if (btn.dataset.action === 'inc') {
                item.qty += 1;
            } else if (item.qty > 1) {
                item.qty -= 1;
            } else {
                const idx = cart.indexOf(item);
                cart.splice(idx, 1);
            }
            updateCartBadge();
            renderCartItems();
        });
    });
}

function addToCart(product, qty = 1) {
    const existing = cart.find(i => i.id === product.id);
    if (existing) {
        existing.qty += qty;
    } else {
        cart.push({ ...product, qty });
    }
    updateCartBadge();
    renderCartItems();
}

function openCart() {
    document.getElementById('cart-drawer')?.classList.add('open');
    document.getElementById('cart-backdrop')?.classList.add('open');
    document.body.style.overflow = 'hidden';
}

function closeCart() {
    document.getElementById('cart-drawer')?.classList.remove('open');
    document.getElementById('cart-backdrop')?.classList.remove('open');
    document.body.style.overflow = '';
}

function openCheckout() {
    if (cart.length === 0) {
        alert('Your cart is empty. Please add products first.');
        return;
    }
    closeCart();
    document.getElementById('checkout-modal')?.classList.add('open');
    document.getElementById('checkout-backdrop')?.classList.add('open');
    document.body.style.overflow = 'hidden';
    document.getElementById('checkout-summary').innerHTML = cart.map((item, i) =>
        `<div>${i + 1}. ${item.name} × ${item.qty} — ${formatPrice(item.price * item.qty)}</div>`
    ).join('') + `<div class="checkout-total-line"><strong>Total: ${formatPrice(cartTotal())}</strong></div>`;
}

function closeCheckout() {
    document.getElementById('checkout-modal')?.classList.remove('open');
    document.getElementById('checkout-backdrop')?.classList.remove('open');
    document.body.style.overflow = '';
}

function buildWhatsAppMessage(data) {
    const lines = [
        '🛒 *New Product Order — SBB Foundation*',
        '',
        '*Customer Details:*',
        `Name: ${data.name}`,
        `Phone: ${data.phone}`,
        data.email ? `Email: ${data.email}` : null,
        `Address: ${data.address}`,
        `City: ${data.city}`,
        `Pincode: ${data.pincode}`,
        '',
        '*Order Items:*'
    ].filter(Boolean);

    cart.forEach((item, i) => {
        lines.push(`${i + 1}. ${item.name} × ${item.qty} — ${formatPrice(item.price * item.qty)}`);
    });

    lines.push('', `*Grand Total: ${formatPrice(cartTotal())}*`);
    if (data.notes) lines.push('', `Notes: ${data.notes}`);
    lines.push('', 'Please confirm availability and share payment details. Thank you!');

    return lines.join('\n');
}

function sendToWhatsApp(data) {
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(buildWhatsAppMessage(data))}`;
    window.open(url, '_blank', 'noopener,noreferrer');
}

function enhanceProductCards() {
    document.querySelectorAll('.product-card').forEach(card => {
        const product = getProductFromCard(card);
        const oldBtn = card.querySelector('.buy-btn');
        if (!oldBtn || card.querySelector('.cart-actions')) return;

        const wrap = document.createElement('div');
        wrap.className = 'cart-actions';
        wrap.innerHTML = `
            <button type="button" class="buy-btn add-cart-btn">Add to Cart</button>
            <button type="button" class="buy-btn buy-now-btn">Buy Now</button>
        `;
        oldBtn.replaceWith(wrap);

        wrap.querySelector('.add-cart-btn').addEventListener('click', () => {
            addToCart(product);
            openCart();
        });

        wrap.querySelector('.buy-now-btn').addEventListener('click', () => {
            cart.length = 0;
            addToCart(product, 1);
            openCheckout();
        });
    });
}

function initCartUI() {
    document.getElementById('cart-open-btn')?.addEventListener('click', openCart);
    document.getElementById('cart-close-btn')?.addEventListener('click', closeCart);
    document.getElementById('cart-backdrop')?.addEventListener('click', closeCart);
    document.getElementById('checkout-btn')?.addEventListener('click', openCheckout);
    document.getElementById('checkout-close-btn')?.addEventListener('click', closeCheckout);
    document.getElementById('checkout-backdrop')?.addEventListener('click', closeCheckout);

    document.getElementById('checkout-form')?.addEventListener('submit', e => {
        e.preventDefault();
        const form = e.target;
        const data = {
            name: form.name.value.trim(),
            phone: form.phone.value.trim(),
            email: form.email.value.trim(),
            address: form.address.value.trim(),
            city: form.city.value.trim(),
            pincode: form.pincode.value.trim(),
            notes: form.notes.value.trim()
        };

        if (!data.name || !data.phone || !data.address || !data.city || !data.pincode) {
            alert('Please fill all required fields.');
            return;
        }

        sendToWhatsApp(data);
        closeCheckout();
        cart.length = 0;
        updateCartBadge();
        renderCartItems();
        form.reset();
    });
}

document.addEventListener('DOMContentLoaded', () => {
    enhanceProductCards();
    initCartUI();
    updateCartBadge();
    renderCartItems();
});
