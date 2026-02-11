// 1. YOUR CONFIGURATION
const FULL_URL = `https://docs.google.com/spreadsheets/d/17cKDMNThug1BK70AlmcoqbOeztRLOEuAiFbng8eNHiM/edit?usp=sharing`;

let allProducts = [];

// 2. FETCH DATA FROM GOOGLE SHEET
async function fetchProducts() {
    const productGrid = document.getElementById('product-grid');
    
    try {
        const response = await fetch(FULL_URL);
        const text = await response.text();
        
        // Google returns a JSON wrapped in a function call, we need to extract it
        const data = JSON.parse(text.substr(47).slice(0, -2));
        const rows = data.table.rows;

        // Map the rows to our product array based on your specific columns
        allProducts = rows.map(row => ({
            model: row.c[0] ? row.c[0].v : '',
            category: row.c[1] ? row.c[1].v : '',
            specs: row.c[2] ? row.c[2].v : '',
            display: row.c[3] ? row.c[3].v : '',
            ports: row.c[4] ? row.c[4].v : '',
            price: row.c[5] ? row.c[5].v : '',
            image: row.c[6] ? row.c[6].v : 'https://via.placeholder.com/300x200?text=No+Image'
        })).filter(item => item.model !== ''); // Ignore empty rows

        displayProducts(allProducts);
    } catch (error) {
        console.error("Error fetching data:", error);
        productGrid.innerHTML = `<p style="text-align:center; color:red;">Failed to load inventory. Please check your Sheet permissions.</p>`;
    }
}

// 3. DISPLAY PRODUCTS IN THE GRID
function displayProducts(products) {
    const productGrid = document.getElementById('product-grid');
    productGrid.innerHTML = ''; // Clear loading message

    products.forEach(item => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.setAttribute('data-category', item.category.toLowerCase());

        card.innerHTML = `
            <img src="${item.image}" alt="${item.model}" style="width:100%; height:200px; object-fit:cover;">
            <div style="padding: 20px;">
                <span style="color: var(--accent-cyan); font-size: 0.8rem; font-weight: bold; text-transform: uppercase;">${item.category}</span>
                <h3 style="margin: 10px 0; color: white;">${item.model}</h3>
                <ul style="list-style: none; padding: 0; margin-bottom: 20px; font-size: 0.9rem; color: #94a3b8;">
                    <li><i class="fas fa-bolt"></i> ${item.specs}</li>
                    <li><i class="fas fa-desktop"></i> ${item.display}</li>
                    <li><i class="fas fa-plug"></i> ${item.ports}</li>
                </ul>
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span style="font-size: 1.2rem; font-weight: bold; color: var(--accent-cyan);">${item.price}</span>
                    <a href="https://wa.me/916351541231?text=I'm interested in the ${item.model}" target="_blank" class="btn-primary" style="padding: 5px 15px; font-size: 0.8rem; border-radius: 5px; text-decoration:none; color:black;">Buy Now</a>
                </div>
            </div>
        `;
        productGrid.appendChild(card);
    });
}

// 4. FILTER LOGIC
document.querySelectorAll('.filter-tab').forEach(tab => {
    tab.addEventListener('click', () => {
        // Update active class
        document.querySelector('.filter-tab.active').classList.remove('active');
        tab.classList.add('active');

        const filter = tab.getAttribute('data-filter');
        if (filter === 'all') {
            displayProducts(allProducts);
        } else {
            const filtered = allProducts.filter(item => item.category.toLowerCase().includes(filter));
            displayProducts(filtered);
        }
    });
});

// Initialize
window.onload = fetchProducts;
