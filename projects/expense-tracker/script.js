// DOM Elements
const descInput = document.getElementById('desc');
const amountInput = document.getElementById('amount');
const typeSelect = document.getElementById('type');
const categorySelect = document.getElementById('category');
const addBtn = document.getElementById('addBtn');
const transactionsDiv = document.getElementById('transactions');
const totalIncome = document.getElementById('totalIncome');
const totalExpense = document.getElementById('totalExpense');
const balanceEl = document.getElementById('balance');
const filterBtns = document.querySelectorAll('.filter-btn');

let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
let currentFilter = 'all';

const categoryIcons = {
    food: '🍔',
    transport: '🚗',
    shopping: '🛍️',
    bills: '📄',
    entertainment: '🎬',
    salary: '💰',
    freelance: '💻',
    investment: '📈',
    other: '📌'
};

function saveTransactions() {
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

function formatCurrency(amount) {
    return '₹' + Math.abs(amount).toLocaleString('en-IN');
}

function updateSummary() {
    const income = transactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);
    const expense = transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);

    totalIncome.textContent = formatCurrency(income);
    totalExpense.textContent = formatCurrency(expense);
    balanceEl.textContent = formatCurrency(income - expense);
}

function renderTransactions() {
    const filtered = currentFilter === 'all'
        ? transactions
        : transactions.filter(t => t.type === currentFilter);

    if (filtered.length === 0) {
        transactionsDiv.innerHTML = '<p class="no-transactions">No transactions yet. Add one above! 📝</p>';
        return;
    }

    transactionsDiv.innerHTML = filtered.map((t, i) => `
        <div class="transaction">
            <div class="tx-left">
                <span class="tx-icon">${categoryIcons[t.category] || '📌'}</span>
                <div class="tx-info">
                    <h4>${t.description}</h4>
                    <p>${t.category.charAt(0).toUpperCase() + t.category.slice(1)} • ${t.date}</p>
                </div>
            </div>
            <div class="tx-right">
                <span class="tx-amount ${t.type}">${t.type === 'income' ? '+' : '-'}${formatCurrency(t.amount)}</span>
                <button class="delete-btn" onclick="deleteTransaction(${i})" title="Delete">🗑️</button>
            </div>
        </div>
    `).join('');
}

function addTransaction() {
    const description = descInput.value.trim();
    const amount = parseFloat(amountInput.value);
    const type = typeSelect.value;
    const category = categorySelect.value;

    if (!description || isNaN(amount) || amount <= 0) {
        alert('Please fill in all fields with valid values.');
        return;
    }

    const transaction = {
        description,
        amount,
        type,
        category,
        date: new Date().toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        })
    };

    transactions.unshift(transaction);
    saveTransactions();
    updateSummary();
    renderTransactions();

    descInput.value = '';
    amountInput.value = '';
}

function deleteTransaction(index) {
    const filtered = currentFilter === 'all'
        ? transactions
        : transactions.filter(t => t.type === currentFilter);

    const actualIndex = transactions.indexOf(filtered[index]);
    if (actualIndex > -1) {
        transactions.splice(actualIndex, 1);
        saveTransactions();
        updateSummary();
        renderTransactions();
    }
}

// Event Listeners
addBtn.addEventListener('click', addTransaction);

amountInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTransaction();
});

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.dataset.filter;
        renderTransactions();
    });
});

// Initial render
updateSummary();
renderTransactions();
