const statusElement = document.getElementById('filter-status');
const checkboxes = Array.from(
  document.querySelectorAll<HTMLInputElement>('.filter-option input[type="checkbox"]'),
);
const products = Array.from(document.querySelectorAll<HTMLElement>('.Product'));

const textFor = (element: Element | null): string => element?.textContent?.trim() ?? '';

const productMatches = (product: HTMLElement): boolean => {
  const title = textFor(product.querySelector('.product-title')).toLowerCase();
  const price = Number.parseInt(
    textFor(product.querySelector('.product-price')).replace(/[^0-9]/g, ''),
    10,
  );
  const selected = checkboxes.filter((checkbox) => checkbox.checked).map(({ id }) => id);
  const brands = selected.filter((id) =>
    ['bmw', 'mercedes', 'audi', 'porsche', 'lamborghini', 'volkswagen', 'range-rover'].includes(id),
  );
  const ranges = selected.filter((id) =>
    ['under50k', '50k-100k', '100k-150k', 'over150k'].includes(id),
  );
  const types = selected.filter((id) => ['sedan', 'suv', 'sports', 'luxury'].includes(id));

  const brandMatch =
    brands.length === 0 ||
    brands.some((brand) =>
      brand === 'range-rover' ? title.includes('range rover') : title.includes(brand),
    );
  const rangeMatch =
    ranges.length === 0 ||
    ranges.some((range) => {
      switch (range) {
        case 'under50k':
          return price < 50000;
        case '50k-100k':
          return price >= 50000 && price <= 100000;
        case '100k-150k':
          return price > 100000 && price <= 150000;
        case 'over150k':
          return price > 150000;
        default:
          return false;
      }
    });
  const typeTerms: Record<string, string[]> = {
    sedan: ['m3', 'c63', 'a8', 's-class', 'virtus', 'panamera'],
    suv: ['x5', 'range rover', 'q8'],
    sports: ['carrera', 'amg', 'rs6', 'huracán', 'panamera'],
    luxury: ['s-class', 'a8', 'range rover', 'panamera'],
  };
  const typeMatch =
    types.length === 0 ||
    types.some((type) => typeTerms[type]?.some((term) => title.includes(term)) ?? false);

  return brandMatch && rangeMatch && typeMatch;
};

const updateResultsCount = (visibleCount: number): void => {
  let countElement = document.getElementById('results-count');
  if (!countElement) {
    const grid = document.querySelector<HTMLElement>('.GridBox');
    if (!grid) return;
    countElement = document.createElement('div');
    countElement.id = 'results-count';
    countElement.style.cssText =
      'grid-column: 1 / -1; padding: 10px 0; font-weight: 600; color: white; border-bottom: 1px solid #e9ecef; margin-bottom: 15px;';
    grid.insertBefore(countElement, grid.firstChild);
  }

  countElement.textContent =
    String(visibleCount) + ' car' + (visibleCount === 1 ? '' : 's') + ' found';
};

const filterProducts = (): void => {
  const selectedCount = checkboxes.filter((checkbox) => checkbox.checked).length;
  let visibleCount = 0;

  products.forEach((product) => {
    const isVisible = productMatches(product);
    product.style.display = isVisible ? 'block' : 'none';
    if (isVisible) visibleCount += 1;
  });

  if (statusElement) {
    statusElement.textContent =
      selectedCount > 0
        ? 'Showing ' + visibleCount + ' cars (' + selectedCount + ' filters active)'
        : 'Showing all ' + visibleCount + ' cars';
    statusElement.style.background = selectedCount > 0 ? '#fff3cd' : '#e8f5e8';
    statusElement.style.color = selectedCount > 0 ? '#856404' : '#2d5a2d';
  }

  updateResultsCount(visibleCount);
};

checkboxes.forEach((checkbox) => checkbox.addEventListener('change', filterProducts));

const clearButton = document.createElement('button');
clearButton.type = 'button';
clearButton.textContent = 'Clear All Filters';
clearButton.style.cssText =
  'width: 100%; background-color: #6c757d; color: white; border: none; padding: 10px; border-radius: 6px; font-size: 14px; font-weight: 600; cursor: pointer; margin-top: 20px;';
clearButton.addEventListener('click', () => {
  checkboxes.forEach((checkbox) => {
    checkbox.checked = false;
  });
  filterProducts();
});

document.querySelector('.FliterationBar')?.append(clearButton);
filterProducts();
