document.addEventListener('DOMContentLoaded', function() {
    console.log('Products page loaded, initializing filters...');
    
    // Update status indicator
    const statusElement = document.getElementById('filter-status');
    if (statusElement) {
        statusElement.textContent = 'Welcome, you can choose what you want.';
        statusElement.style.background = '#e8f5e8';
        statusElement.style.color = '#2d5a2d';
    }

    // Get all filter checkboxes and products
    const filterCheckboxes = document.querySelectorAll('.filter-option input[type="checkbox"]');
    const products = document.querySelectorAll('.Product');
    
    console.log('Found', filterCheckboxes.length, 'filter checkboxes');
    console.log('Found', products.length, 'products');

    // Function to check if a product matches the selected filters
    function productMatchesFilters(product) {
        const productTitle = product.querySelector('.product-title').textContent.toLowerCase();
        const productPrice = parseInt(product.querySelector('.product-price').textContent.replace(/[^0-9]/g, ''));
        
        // Get all checked filters
        const checkedBrands = [];
        const checkedPriceRanges = [];
        const checkedTypes = [];
        
        filterCheckboxes.forEach(checkbox => {
            if (checkbox.checked) {
                const id = checkbox.id;
                if (['bmw', 'mercedes', 'audi', 'porsche', 'lamborghini', 'volkswagen', 'range-rover'].includes(id)) {
                    checkedBrands.push(id);
                } else if (['under50k', '50k-100k', '100k-150k', 'over150k'].includes(id)) {
                    checkedPriceRanges.push(id);
                } else if (['sedan', 'suv', 'sports', 'luxury'].includes(id)) {
                    checkedTypes.push(id);
                }
            }
        });

        // If no filters are selected, show all products
        if (checkedBrands.length === 0 && checkedPriceRanges.length === 0 && checkedTypes.length === 0) {
            return true;
        }

        // Check brand filter
        let brandMatch = checkedBrands.length === 0;
        if (checkedBrands.length > 0) {
            brandMatch = checkedBrands.some(brand => {
                switch(brand) {
                    case 'bmw': return productTitle.includes('bmw');
                    case 'mercedes': return productTitle.includes('mercedes');
                    case 'audi': return productTitle.includes('audi');
                    case 'porsche': return productTitle.includes('porsche');
                    case 'lamborghini': return productTitle.includes('lamborghini');
                    case 'volkswagen': return productTitle.includes('volkswagen');
                    case 'range-rover': return productTitle.includes('range rover');
                    default: return false;
                }
            });
        }

        // Check price range filter
        let priceMatch = checkedPriceRanges.length === 0;
        if (checkedPriceRanges.length > 0) {
            priceMatch = checkedPriceRanges.some(range => {
                switch(range) {
                    case 'under50k': return productPrice < 50000;
                    case '50k-100k': return productPrice >= 50000 && productPrice <= 100000;
                    case '100k-150k': return productPrice > 100000 && productPrice <= 150000;
                    case 'over150k': return productPrice > 150000;
                    default: return false;
                }
            });
        }

        // Check type filter
        let typeMatch = checkedTypes.length === 0;
        if (checkedTypes.length > 0) {
            typeMatch = checkedTypes.some(type => {
                switch(type) {
                    case 'sedan':
                        return productTitle.includes('m3') || 
                               productTitle.includes('c63') || 
                               productTitle.includes('a8') || 
                               productTitle.includes('s-class') || 
                               productTitle.includes('virtus') || 
                               productTitle.includes('panamera');
                    case 'suv':
                        return productTitle.includes('x5') || 
                               productTitle.includes('range rover') || 
                               productTitle.includes('q8');
                    case 'sports':
                        return productTitle.includes('carrera') || 
                               productTitle.includes('amg') || 
                               productTitle.includes('rs6') || 
                               productTitle.includes('huracán') || 
                               productTitle.includes('panamera');
                    case 'luxury':
                        return productTitle.includes('s-class') || 
                               productTitle.includes('a8') || 
                               productTitle.includes('range rover') ||
                               productTitle.includes('panamera');
                    default: return false;
                }
            });
        }

        return brandMatch && priceMatch && typeMatch;
    }

    // Function to filter and display products
    function filterProducts() {
        console.log('Filtering products...');
        let visibleCount = 0;
        
        products.forEach(product => {
            if (productMatchesFilters(product)) {
                product.style.display = 'block';
                visibleCount++;
            } else {
                product.style.display = 'none';
            }
        });

        console.log('Visible products:', visibleCount);
        
        if (statusElement) {
            const activeFilters = [];
            filterCheckboxes.forEach(checkbox => {
                if (checkbox.checked) {
                    activeFilters.push(checkbox.id);
                }
            });
            
            if (activeFilters.length > 0) {
                statusElement.textContent = `Showing ${visibleCount} cars (${activeFilters.length} filter${activeFilters.length > 1 ? 's' : ''} active)`;
                statusElement.style.background = '#fff3cd';
                statusElement.style.color = '#856404';
            } else {
                statusElement.textContent = `Showing all ${visibleCount} cars`;
                statusElement.style.background = '#e8f5e8';
                statusElement.style.color = '#2d5a2d';
            }
        }
        
        updateResultsCount();
    }

    function updateResultsCount() {
        const visibleProducts = Array.from(products).filter(product => product.style.display !== 'none');
        const resultsCount = document.getElementById('results-count');
        
        if (!resultsCount) {
            const gridBox = document.querySelector('.GridBox');
            if (gridBox) {
                const countElement = document.createElement('div');
                countElement.id = 'results-count';
                countElement.style.cssText = 'grid-column: 1 / -1; padding: 10px 0; font-weight: 600; color: #333; border-bottom: 1px solid #e9ecef; margin-bottom: 15px;';
                gridBox.insertBefore(countElement, gridBox.firstChild);
            }
        }
        
        const countElement = document.getElementById('results-count');
        if (countElement) {
            countElement.textContent = `${visibleProducts.length} car${visibleProducts.length !== 1 ? 's' : ''} found`;
        }
    }

    // Add event listeners to all filter checkboxes
    filterCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            console.log('Filter changed:', this.id, this.checked);
            filterProducts();
        });
    });

    const clearFiltersBtn = document.createElement('button');
    clearFiltersBtn.textContent = 'Clear All Filters';
    clearFiltersBtn.style.cssText = `
        width: 100%;
        background-color: #6c757d;
        color: white;
        border: none;
        padding: 10px;
        border-radius: 6px;
        font-size: 14px;
        font-weight: 600;
        cursor: pointer;
        transition: background-color 0.3s ease;
        margin-top: 20px;
    `;
    
    clearFiltersBtn.addEventListener('mouseenter', function() {
        this.style.backgroundColor = '#5a6268';
    });
    
    clearFiltersBtn.addEventListener('mouseleave', function() {
        this.style.backgroundColor = '#6c757d';
    });
    
    clearFiltersBtn.addEventListener('click', function() {
        console.log('Clearing all filters');
        filterCheckboxes.forEach(checkbox => {
            checkbox.checked = false;
        });
        filterProducts();
    });

    const filterBar = document.querySelector('.FliterationBar');
    if (filterBar) {
        filterBar.appendChild(clearFiltersBtn);
        console.log('Clear filters button added');
    } else {
        console.error('Filter bar not found!');
    }

    updateResultsCount();
    
    console.log('Products page initialization complete');
});
