const tabs = document.querySelectorAll<HTMLButtonElement>('.tab-btn');
const contents = document.querySelectorAll<HTMLElement>('.tab-content');

tabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    const targetId = tab.dataset.tab;
    const target = targetId ? document.getElementById(targetId) : null;
    if (!target) return;

    tabs.forEach((item) => item.classList.toggle('active', item === tab));
    contents.forEach((item) => item.classList.toggle('active', item === target));
  });
});
