// js/auth.js
let currentUser = null;
let currentTenant = null;

// Provjeri da li je korisnik ulogovan
async function checkAuth() {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        window.location.href = 'login.html';
        return null;
    }

    // Dohvati podatke o korisniku i tenantu
    const { data: userData, error } = await supabase
        .from('users')
        .select(`
            *,
            tenants (*)
        `)
        .eq('id', user.id)
        .single();

    if (error || !userData) {
        await supabase.auth.signOut();
        window.location.href = 'login.html';
        return null;
    }

    // Provjeri da li je tenant odobren
    if (!userData.tenants.approved && userData.role !== 'super_admin') {
        showMessage('Vaš nalog čeka odobrenje administratora.', 'warning');
        await supabase.auth.signOut();
        window.location.href = 'login.html';
        return null;
    }

    currentUser = userData;
    currentTenant = userData.tenants;

    return userData;
}

// Login funkcija
async function login(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password
    });

    if (error) {
        showMessage('Greška pri prijavi: ' + error.message, 'error');
        return false;
    }

    window.location.href = 'dashboard.html';
    return true;
}

// Registracija nove firme
async function register(formData) {
    try {
        // 1. Kreiraj Auth korisnika
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email: formData.email,
            password: formData.password
        });

        if (authError) throw authError;

        // 2. Kreiraj tenant (firma)
        const { data: tenant, error: tenantError } = await supabase
            .from('tenants')
            .insert({
                naziv: formData.company_name,
                pib: formData.pib,
                adresa: formData.address,
                grad: formData.city,
                telefon: formData.phone,
                email: formData.email,
                approved: false
            })
            .select()
            .single();

        if (tenantError) throw tenantError;

        // 3. Kreiraj user zapis
        const { error: userError } = await supabase
            .from('users')
            .insert({
                id: authData.user.id,
                tenant_id: tenant.id,
                role: 'admin',
                ime: formData.name,
                email: formData.email
            });

        if (userError) throw userError;

        showMessage('Registracija uspješna! Čekajte odobrenje administratora.', 'success');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 2000);

        return true;
    } catch (error) {
        showMessage('Greška pri registraciji: ' + error.message, 'error');
        return false;
    }
}

// Logout
async function logout() {
    await supabase.auth.signOut();
    window.location.href = 'login.html';
}

// Helper za prikaz poruka
function showMessage(message, type = 'info') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type}`;
    alertDiv.textContent = message;
    alertDiv.style.cssText = 'position: fixed; top: 20px; right: 20px; z-index: 9999; padding: 15px; border-radius: 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.2);';

    if (type === 'error') alertDiv.style.backgroundColor = '#f44336';
    else if (type === 'success') alertDiv.style.backgroundColor = '#4CAF50';
    else if (type === 'warning') alertDiv.style.backgroundColor = '#ff9800';
    else alertDiv.style.backgroundColor = '#2196F3';

    alertDiv.style.color = 'white';

    document.body.appendChild(alertDiv);

    setTimeout(() => {
        alertDiv.remove();
    }, 5000);
}
