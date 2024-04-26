function updateBuyFees() {
    const buyPrice = parseFloat(document.getElementById('buyPrice').value);
    const contracts = parseInt(document.getElementById('contracts').value);
    if (buyPrice > 0 && contracts > 0) {
        const fees = calculateBuyFees(buyPrice, contracts);
        document.getElementById('buyFees').textContent = fees.toFixed(2);
        updateNetRevenue();
    }
}

function updateSellFees() {
    const sellPrice = parseFloat(document.getElementById('sellPrice').value);
    const contracts = parseInt(document.getElementById('contracts').value);
    if (sellPrice > 0 && contracts > 0) {
        const fees = calculateSellFees(sellPrice, contracts);
        document.getElementById('sellFees').textContent = fees.toFixed(2);
        updateNetRevenue();
    }
}

function updateNetRevenue() {
    const buyPrice = parseFloat(document.getElementById('buyPrice').value);
    const sellPrice = parseFloat(document.getElementById('sellPrice').value);
    const contracts = parseInt(document.getElementById('contracts').value);
    if (buyPrice > 0 && sellPrice > 0 && contracts > 0) {
        const values = calculateValue(buyPrice, sellPrice, contracts);
        document.getElementById('totalRevenue').textContent = values['总收益'].toFixed(2);
        document.getElementById('netRevenue').textContent = values['净收益'].toFixed(2);
    }
}

function syncInputWithSlider(inputId, value) {
    document.getElementById(inputId).value = value;
    if (inputId === 'buyPrice' || inputId === 'contracts') {
        updateBuyFees();
    }
    if (inputId === 'sellPrice' || inputId === 'contracts') {
        updateSellFees();
    }
}

function calculateBuyFees(buyPrice, contracts) {
    const commission = Math.max(1.99, contracts * (buyPrice > 0.1 ? 0.65 : 0.15));
    const platformFee = contracts * 0.3;
    const regulatoryOptionFee = contracts * 0.012;
    const clearingFee = Math.min(55, contracts * 0.02);
    const settlementFee = contracts * 0.18;
    return commission + platformFee + regulatoryOptionFee + clearingFee + settlementFee;
}

function calculateSellFees(sellPrice, contracts) {
    const commission = Math.max(1.99, contracts * (sellPrice > 0.1 ? 0.65 : 0.15));
    const platformFee = contracts * 0.3;
    const secFee = Math.max(0.01, sellPrice * contracts * 0.000008);
    const tradingActivityFee = Math.max(0.01, contracts * 0.00279);
    const regulatoryOptionFee = contracts * 0.012;
    const clearingFee = Math.min(55, contracts * 0.02);
    const settlementFee = contracts * 0.18;
    return commission + platformFee + secFee + tradingActivityFee + regulatoryOptionFee + clearingFee + settlementFee;
}

function calculateValue(buyPrice, sellPrice, contracts) {
    const totalBuyFees = calculateBuyFees(buyPrice, contracts);
    const totalSellFees = calculateSellFees(sellPrice, contracts);
    const totalValue = (sellPrice - buyPrice) * contracts * 100;
    return {
        '总收益': totalValue,
        '净收益': totalValue - totalSellFees - totalBuyFees
    };
}

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').then(reg => {
        reg.addEventListener('updatefound', () => {
            // 更新发现逻辑
            const newWorker = reg.installing;
            newWorker.addEventListener('statechange', () => {

                console.log(newWorker.state , '111')
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                    // 显示更新提示
                    showUpdateNotification();
                }
            });
        });
    }).catch(error => {
        console.error('Service Worker 注册失败:', error);
    });
}
function showUpdateNotification() {
    const notification = document.getElementById('updateNotification');
    notification.classList.remove('hidden');
}

function updateApp() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistrations().then(function(registrations) {
            // 遍历所有Service Worker注册
            registrations.forEach(function(registration) {
                // 检查是否有等待中的Service Worker
                if (registration.waiting) {
                    // 通知等待中的Service Worker激活
                    registration.waiting.postMessage({type: 'SKIP_WAITING'});
                }
            });
        }).then(function() {
            console.log('Service Worker updated.');
            // 强制页面刷新
            window.location.reload(true);
        }).catch(function(error) {
            console.error('Failed to update Service Worker:', error);
        });
    }
}

