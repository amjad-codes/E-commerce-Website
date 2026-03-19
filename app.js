 
        // Product Data
        const products = [
            { id: 1, name: "Wireless Headphones", category: "Electronics", price: 79.99, icon: "🎧" },
            { id: 2, name: "Smart Watch", category: "Electronics", price: 199.99, icon: "⌚" },
            { id: 3, name: "Running Shoes", category: "Fashion", price: 89.99, icon: "👟" },
            { id: 4, name: "Backpack", category: "Accessories", price: 49.99, icon: "🎒" },
            { id: 5, name: "Sunglasses", category: "Fashion", price: 129.99, icon: "🕶️" },
            { id: 6, name: "Coffee Maker", category: "Home", price: 99.99, icon: "☕" },
            { id: 7, name: "Yoga Mat", category: "Fitness", price: 29.99, icon: "🧘" },
            { id: 8, name: "Desk Lamp", category: "Home", price: 39.99, icon: "💡" },
            { id: 9, name: "Bluetooth Speaker", category: "Electronics", price: 59.99, icon: "🔊" },
            { id: 10, name: "Water Bottle", category: "Fitness", price: 24.99, icon: "🥤" },
            { id: 11, name: "Leather Wallet", category: "Accessories", price: 44.99, icon: "👛" },
            { id: 12, name: "Gaming Mouse", category: "Electronics", price: 69.99, icon: "🖱️" }
        ];

        // Cart State
        let cart = [];

        // Initialize
        document.addEventListener('DOMContentLoaded', () => {
            renderProducts(products);
            
            // Search functionality
            document.getElementById('searchBar').addEventListener('input', (e) => {
                const searchTerm = e.target.value.toLowerCase();
                const filtered = products.filter(p => 
                    p.name.toLowerCase().includes(searchTerm) || 
                    p.category.toLowerCase().includes(searchTerm)
                );
                renderProducts(filtered);
            });
        });

        // Render Products
        function renderProducts(productsToRender) {
            const grid = document.getElementById('productsGrid');
            
            if (productsToRender.length === 0) {
                grid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; color: white; padding: 3rem;">No products found</div>';
                return;
            }

            grid.innerHTML = productsToRender.map(product => `
                <div class="product-card">
                    <div class="product-image">${product.icon}</div>
                    <div class="product-info">
                        <div class="product-category">${product.category}</div>
                        <h3 class="product-title">${product.name}</h3>
                        <div class="product-price">$${product.price.toFixed(2)}</div>
                        <button class="add-to-cart" onclick="addToCart(${product.id})">
                            <i class="fas fa-cart-plus"></i> Add to Cart
                        </button>
                    </div>
                </div>
            `).join('');
        }

        // Add to Cart
        function addToCart(productId) {
            const product = products.find(p => p.id === productId);
            const existingItem = cart.find(item => item.id === productId);

            if (existingItem) {
                existingItem.quantity++;
            } else {
                cart.push({ ...product, quantity: 1 });
            }

            updateCart();
            showSuccess('Item added to cart!');
        }

        // Update Cart UI
        function updateCart() {
            const cartCount = document.getElementById('cartCount');
            const cartItems = document.getElementById('cartItems');
            const cartFooter = document.getElementById('cartFooter');
            const cartTotal = document.getElementById('cartTotal');

            const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
            const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

            cartCount.textContent = totalItems;

            if (cart.length === 0) {
                cartItems.innerHTML = `
                    <div class="empty-cart">
                        <i class="fas fa-shopping-basket"></i>
                        <p>Your cart is empty</p>
                    </div>
                `;
                cartFooter.style.display = 'none';
            } else {
                cartItems.innerHTML = cart.map(item => `
                    <div class="cart-item">
                        <div class="cart-item-image">${item.icon}</div>
                        <div class="cart-item-details">
                            <div class="cart-item-title">${item.name}</div>
                            <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                            <div class="quantity-controls">
                                <button class="qty-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                                <span>${item.quantity}</span>
                                <button class="qty-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                                <span style="flex: 1;"></span>
                                <i class="fas fa-trash remove-item" onclick="removeFromCart(${item.id})"></i>
                            </div>
                        </div>
                    </div>
                `).join('');
                cartFooter.style.display = 'block';
                cartTotal.textContent = '$' + totalPrice.toFixed(2);
            }
        }

        // Update Quantity
        function updateQuantity(productId, change) {
            const item = cart.find(item => item.id === productId);
            if (item) {
                item.quantity += change;
                if (item.quantity <= 0) {
                    removeFromCart(productId);
                } else {
                    updateCart();
                }
            }
        }

        // Remove from Cart
        function removeFromCart(productId) {
            cart = cart.filter(item => item.id !== productId);
            updateCart();
            showSuccess('Item removed from cart');
        }

        // Toggle Cart Sidebar
        function toggleCart() {
            const sidebar = document.getElementById('cartSidebar');
            const overlay = document.getElementById('overlay');
            
            if (sidebar.classList.contains('open')) {
                sidebar.classList.remove('open');
                overlay.classList.remove('active');
            } else {
                sidebar.classList.add('open');
                overlay.classList.add('active');
            }
        }

        // Open Checkout
        function openCheckout() {
            if (cart.length === 0) return;
            document.getElementById('checkoutModal').classList.add('active');
            document.getElementById('modalOverlay').classList.add('active');
            toggleCart();
        }

        // Close Checkout
        function closeCheckout() {
            document.getElementById('checkoutModal').classList.remove('active');
            document.getElementById('modalOverlay').classList.remove('active');
        }

        // Place Order
        function placeOrder(event) {
            event.preventDefault();
            
            // Simulate processing
            const btn = event.target.querySelector('.place-order-btn');
            const originalText = btn.innerHTML;
            btn.innerHTML = '<span class="loader"></span> Processing...';
            btn.disabled = true;

            setTimeout(() => {
                cart = [];
                updateCart();
                closeCheckout();
                showSuccess('Order placed successfully! Thank you for shopping.');
                btn.innerHTML = originalText;
                btn.disabled = false;
                event.target.reset();
            }, 2000);
        }

        // Show Success Message
        function showSuccess(message) {
            const successDiv = document.getElementById('successMessage');
            const successText = document.getElementById('successText');
            
            successText.textContent = message;
            successDiv.classList.add('show');
            
            setTimeout(() => {
                successDiv.classList.remove('show');
            }, 3000);
        }

        // Search Products
        function searchProducts() {
            const searchTerm = document.getElementById('searchBar').value.toLowerCase();
            const filtered = products.filter(p => 
                p.name.toLowerCase().includes(searchTerm) || 
                p.category.toLowerCase().includes(searchTerm)
            );
            renderProducts(filtered);
            
            // Scroll to products
            document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
        }
    