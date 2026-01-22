// js/dashboard.js

let dashboardData = {
    stats: {},
    recentInvoices: [],
    lowStock: [],
    salesChart: []
};

// Inicijalizuj dashboard
async function initDashboard() {
    await checkAuth();
    displayUserInfo();
    await loadDashboardStats();
    await loadRecentInvoices();
    await loadLowStockItems();
    await loadSalesChart();
}

// Prikaži info o korisniku
function displayUserInfo() {
    document.getElementById('userName').textContent = currentUser.ime || currentUser.email;
    document.getElementById('companyName').textContent = currentTenant.naziv;
}

// Učitaj statistiku
async function loadDashboardStats() {
    try {
        const today = new Date();
        const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

        // Ukupna prodaja ovog mjeseca
        const { data: invoices } = await supabase
            .from('fakture')
            .select('ukupno_sa_pdv, status, tip')
            .eq('tenant_id', currentTenant.id)
            .eq('tip', 'prodajna')
            .gte('datum', firstDayOfMonth.toISOString().split('T')[0])
            .lte('datum', lastDayOfMonth.toISOString().split('T')[0]);

        const totalSales = invoices?.reduce((sum, inv) => sum + parseFloat(inv.ukupno_sa_pdv || 0), 0) || 0;
        const paidInvoices = invoices?.filter(inv => inv.status === 'placena').length || 0;
        const unpaidInvoices = invoices?.filter(inv => inv.status === 'kreirana' || inv.status === 'poslata').length || 0;

        // Broj partnera
        const { count: partnersCount } = await supabase
            .from('partneri')
            .select('*', { count: 'exact', head: true })
            .eq('tenant_id', currentTenant.id)
            .eq('aktivan', true);

        // Broj artikala
        const { count: articlesCount } = await supabase
            .from('artikli')
            .select('*', { count: 'exact', head: true })
            .eq('tenant_id', currentTenant.id)
            .eq('aktivan', true);

        dashboardData.stats = {
            totalSales: totalSales,
            paidInvoices: paidInvoices,
            unpaidInvoices: unpaidInvoices,
            partnersCount: partnersCount || 0,
            articlesCount: articlesCount || 0
        };

        displayStats();
    } catch (error) {
        console.error('Greška pri učitavanju statistike:', error);
    }
}

// Prikaži statistiku
function displayStats() {
    document.getElementById('totalSales').textContent = 
        dashboardData.stats.totalSales.toFixed(2) + ' BAM';
    document.getElementById('paidInvoices').textContent = 
        dashboardData.stats.paidInvoices;
    document.getElementById('unpaidInvoices').textContent = 
        dashboardData.stats.unpaidInvoices;
    document.getElementById('partnersCount').textContent = 
        dashboardData.stats.partnersCount;
    document.getElementById('articlesCount').textContent = 
        dashboardData.stats.articlesCount;
}

// Učitaj najnovije fakture
async function loadRecentInvoices() {
    try {
        const { data: invoices } = await supabase
            .from('fakture')
            .select(`
                *,
                partneri (naziv)
            `)
            .eq('tenant_id', currentTenant.id)
            .order('datum', { ascending: false })
            .limit(5);

        dashboardData.recentInvoices = invoices || [];
        displayRecentInvoices();
    } catch (error) {
        console.error('Greška pri učitavanju faktura:', error);
    }
}

// Prikaži najnovije fakture
function displayRecentInvoices() {
    const tbody = document.getElementById('recentInvoicesTable');
    tbody.innerHTML = '';

    if (dashboardData.recentInvoices.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align: center;">Nema podataka</td></tr>';
        return;
    }

    dashboardData.recentInvoices.forEach(invoice => {
        const row = `
            <tr>
                <td>${invoice.broj_fakture}</td>
                <td>${invoice.partneri.naziv}</td>
                <td>${formatDate(invoice.datum)}</td>
                <td>${invoice.ukupno_sa_pdv.toFixed(2)} BAM</td>
                <td><span class="status-badge status-${invoice.status}">${invoice.status}</span></td>
            </tr>
        `;
        tbody.innerHTML += row;
    });
}

// Učitaj artikle sa malim stanjem
async function loadLowStockItems() {
    try {
        const { data: items } = await supabase
            .from('artikli')
            .select('*')
            .eq('tenant_id', currentTenant.id)
            .eq('aktivan', true)
            .filter('stanje_lagera', 'lte', 'min_stanje')
            .order('stanje_lagera', { ascending: true })
            .limit(10);

        dashboardData.lowStock = items || [];
        displayLowStockItems();
    } catch (error) {
        console.error('Greška pri učitavanju artikala:', error);
    }
}

// Prikaži artikle sa malim stanjem
function displayLowStockItems() {
    const tbody = document.getElementById('lowStockTable');
    tbody.innerHTML = '';

    if (dashboardData.lowStock.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" style="text-align: center;">Svi artikli su na zadovoljavajućem nivou</td></tr>';
        return;
    }

    dashboardData.lowStock.forEach(item => {
        const row = `
            <tr>
                <td>${item.sifra}</td>
                <td>${item.naziv}</td>
                <td>${item.stanje_lagera}</td>
                <td>${item.min_stanje}</td>
            </tr>
        `;
        tbody.innerHTML += row;
    });
}

// Učitaj grafikon prodaje (zadnjih 7 dana)
async function loadSalesChart() {
    try {
        const today = new Date();
        const sevenDaysAgo = new Date(today);
        sevenDaysAgo.setDate(today.getDate() - 7);

        const { data: invoices } = await supabase
            .from('fakture')
            .select('datum, ukupno_sa_pdv')
            .eq('tenant_id', currentTenant.id)
            .eq('tip', 'prodajna')
            .gte('datum', sevenDaysAgo.toISOString().split('T')[0])
            .order('datum', { ascending: true });

        // Grupiši po datumima
        const salesByDate = {};
        invoices?.forEach(inv => {
            const date = inv.datum;
            salesByDate[date] = (salesByDate[date] || 0) + parseFloat(inv.ukupno_sa_pdv);
        });

        dashboardData.salesChart = Object.entries(salesByDate).map(([date, total]) => ({
            date: date,
            total: total
        }));

        displaySalesChart();
    } catch (error) {
        console.error('Greška pri učitavanju grafikona:', error);
    }
}

// Prikaži grafikon prodaje (jednostavna tabela za sada)
function displaySalesChart() {
    const container = document.getElementById('salesChart');
    container.innerHTML = '';

    if (dashboardData.salesChart.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #64748b;">Nema podataka za prikaz</p>';
        return;
    }

    const table = document.createElement('table');
    table.style.width = '100%';
    table.innerHTML = `
        <thead>
            <tr>
                <th>Datum</th>
                <th style="text-align: right;">Prodaja (BAM)</th>
            </tr>
        </thead>
        <tbody>
            ${dashboardData.salesChart.map(item => `
                <tr>
                    <td>${formatDate(item.date)}</td>
                    <td style="text-align: right;">${item.total.toFixed(2)}</td>
                </tr>
            `).join('')}
        </tbody>
    `;

    container.appendChild(table);
}

// Helper funkcija za formatiranje datuma
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('bs-BA');
}

// Inicijalizuj dashboard kada se stranica učita
document.addEventListener('DOMContentLoaded', initDashboard);
