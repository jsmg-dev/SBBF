// Admin Dashboard - View and Manage Donations

// Check authentication
if (sessionStorage.getItem('adminAuthenticated') !== 'true') {
    window.location.href = 'admin-login.html'
}

let allDonations = []
let filteredDonations = []

// Initialize dashboard
document.addEventListener('DOMContentLoaded', function() {
    loadDonations()
    setupEventListeners()
})

function setupEventListeners() {
    document.getElementById('searchInput').addEventListener('input', filterDonations)
    document.getElementById('causeFilter').addEventListener('change', filterDonations)
    
    // Close modal on outside click
    document.getElementById('donationModal').addEventListener('click', function(e) {
        if (e.target === this) {
            closeModal()
        }
    })
}

function loadDonations() {
    const stored = localStorage.getItem('donations')
    allDonations = stored ? JSON.parse(stored) : []
    
    // Sort by date (newest first)
    allDonations.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    
    filteredDonations = [...allDonations]
    updateStats()
    renderTable()
}

function updateStats() {
    const totalDonations = allDonations.length
    const totalAmount = allDonations.reduce((sum, d) => sum + d.amount, 0)
    const uniqueDonors = new Set(allDonations.map(d => d.donor_email)).size
    const completedDonations = allDonations.filter(d => d.status === 'completed').length

    document.getElementById('statsGrid').innerHTML = `
        <div class="stat-card">
            <h3>Total Donations</h3>
            <div class="value">${totalDonations}</div>
        </div>
        <div class="stat-card">
            <h3>Total Amount</h3>
            <div class="value">₹${totalAmount.toLocaleString()}</div>
        </div>
        <div class="stat-card">
            <h3>Unique Donors</h3>
            <div class="value">${uniqueDonors}</div>
        </div>
        <div class="stat-card">
            <h3>Completed</h3>
            <div class="value">${completedDonations}</div>
        </div>
    `
}

function filterDonations() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase()
    const causeFilter = document.getElementById('causeFilter').value

    filteredDonations = allDonations.filter(donation => {
        const matchesSearch = !searchTerm || 
            donation.donor_name.toLowerCase().includes(searchTerm) ||
            donation.donor_email.toLowerCase().includes(searchTerm) ||
            donation.donation_id.toLowerCase().includes(searchTerm) ||
            donation.cause.toLowerCase().includes(searchTerm)

        const matchesCause = causeFilter === 'all' || donation.cause === causeFilter

        return matchesSearch && matchesCause
    })

    renderTable()
}

function renderTable() {
    const tbody = document.getElementById('donationsTableBody')
    
    if (filteredDonations.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="8">
                    <div class="empty-state">
                        <i class="fas fa-inbox"></i>
                        <p>No donations found</p>
                    </div>
                </td>
            </tr>
        `
        return
    }

    tbody.innerHTML = filteredDonations.map(donation => `
        <tr>
            <td><code>${donation.donation_id}</code></td>
            <td>
                <div style="font-weight: 600;">${donation.donor_name}</div>
                <div style="font-size: 0.875rem; color: #6b7280;">${donation.donor_email}</div>
            </td>
            <td>${donation.cause}</td>
            <td>${donation.package_id}</td>
            <td style="font-weight: 700; color: #14b8a6;">₹${donation.amount.toLocaleString()}</td>
            <td>${formatDate(donation.created_at)}</td>
            <td>
                <span class="status-badge status-${donation.status}">${donation.status}</span>
            </td>
            <td>
                <div class="action-buttons">
                    <button class="btn-action btn-view" onclick="viewDonation('${donation.donation_id}')" title="View Details">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn-action btn-receipt" onclick="downloadReceipt('${donation.donation_id}')" title="Download Receipt">
                        <i class="fas fa-download"></i>
                    </button>
                    <button class="btn-action btn-certificate" onclick="downloadCertificate('${donation.donation_id}')" title="Download Certificate">
                        <i class="fas fa-award"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('')
}

function formatDate(dateString) {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    })
}

function viewDonation(donationId) {
    const donation = allDonations.find(d => d.donation_id === donationId)
    if (!donation) return

    document.getElementById('modalContent').innerHTML = `
        <div style="margin-bottom: 1.5rem;">
            <h3 style="font-size: 1.1rem; color: #374151; margin-bottom: 1rem;">Donation Information</h3>
            <div class="detail-row">
                <span class="detail-label">Donation ID:</span>
                <span class="detail-value"><code>${donation.donation_id}</code></span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Cause:</span>
                <span class="detail-value">${donation.cause}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Package:</span>
                <span class="detail-value">${donation.package_id}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Quantity:</span>
                <span class="detail-value">${donation.quantity}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Amount:</span>
                <span class="detail-value" style="color: #14b8a6; font-size: 1.25rem;">₹${donation.amount.toLocaleString()}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Payment Method:</span>
                <span class="detail-value">${donation.payment_method}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Payment ID:</span>
                <span class="detail-value"><code>${donation.payment_id}</code></span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Status:</span>
                <span class="detail-value">
                    <span class="status-badge status-${donation.status}">${donation.status}</span>
                </span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Date:</span>
                <span class="detail-value">${new Date(donation.created_at).toLocaleString('en-IN')}</span>
            </div>
        </div>

        <div>
            <h3 style="font-size: 1.1rem; color: #374151; margin-bottom: 1rem;">Donor Information</h3>
            <div class="detail-row">
                <span class="detail-label">Name:</span>
                <span class="detail-value">${donation.donor_name}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Email:</span>
                <span class="detail-value">${donation.donor_email}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Phone:</span>
                <span class="detail-value">${donation.donor_phone}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Address:</span>
                <span class="detail-value">${donation.donor_address}</span>
            </div>
        </div>

        <div style="margin-top: 2rem; display: flex; gap: 1rem;">
            <button class="btn-export" onclick="downloadReceipt('${donation.donation_id}')" style="flex: 1;">
                <i class="fas fa-download"></i> Download Receipt
            </button>
            <button class="btn-export" onclick="downloadCertificate('${donation.donation_id}')" style="flex: 1; background: #f59e0b;">
                <i class="fas fa-award"></i> Download Certificate
            </button>
        </div>
    `

    document.getElementById('donationModal').classList.add('active')
}

function closeModal() {
    document.getElementById('donationModal').classList.remove('active')
}

function downloadReceipt(donationId) {
    const donation = allDonations.find(d => d.donation_id === donationId)
    if (!donation) return

    const { jsPDF } = window.jspdf
    const doc = new jsPDF()
    
    // Header
    doc.setFontSize(20)
    doc.setTextColor(20, 184, 166)
    doc.text('SBB Foundation', 105, 20, { align: 'center' })
    
    doc.setFontSize(16)
    doc.setTextColor(0, 0, 0)
    doc.text('DONATION RECEIPT', 105, 30, { align: 'center' })
    
    // Receipt Details
    doc.setFontSize(10)
    doc.text(`Receipt No: ${donation.donation_id}`, 20, 45)
    doc.text(`Date: ${new Date(donation.created_at).toLocaleDateString('en-IN')}`, 20, 52)
    
    // Donor Information
    doc.setFontSize(12)
    doc.setFont(undefined, 'bold')
    doc.text('Donor Information:', 20, 65)
    
    doc.setFont(undefined, 'normal')
    doc.setFontSize(10)
    doc.text(`Name: ${donation.donor_name}`, 20, 72)
    doc.text(`Email: ${donation.donor_email}`, 20, 79)
    doc.text(`Phone: ${donation.donor_phone}`, 20, 86)
    doc.text(`Address: ${donation.donor_address}`, 20, 93, { maxWidth: 170 })
    
    // Donation Details
    doc.setFontSize(12)
    doc.setFont(undefined, 'bold')
    doc.text('Donation Details:', 20, 110)
    
    doc.setFont(undefined, 'normal')
    doc.setFontSize(10)
    doc.text(`Cause: ${donation.cause}`, 20, 117)
    doc.text(`Package: ${donation.package_id}`, 20, 124)
    doc.text(`Amount: ₹${donation.amount.toLocaleString()}`, 20, 131)
    
    // Tax Information
    doc.setFontSize(10)
    doc.text('This donation is eligible for tax deduction under Section 80G of the Income Tax Act, 1961.', 20, 145, { maxWidth: 170 })
    
    // Footer
    doc.setFontSize(8)
    doc.setTextColor(100, 100, 100)
    doc.text('SBB Foundation - Registered NGO | 80G Certified', 105, 280, { align: 'center' })
    
    doc.save(`donation-receipt-${donation.donation_id}.pdf`)
}

function downloadCertificate(donationId) {
    const donation = allDonations.find(d => d.donation_id === donationId)
    if (!donation) return

    const { jsPDF } = window.jspdf
    const doc = new jsPDF('landscape', 'mm', 'a4')
    
    // Background
    doc.setFillColor(240, 248, 255)
    doc.rect(0, 0, 297, 210, 'F')
    
    // Border
    doc.setDrawColor(20, 184, 166)
    doc.setLineWidth(2)
    doc.rect(10, 10, 277, 190)
    
    // Title
    doc.setFontSize(28)
    doc.setTextColor(20, 184, 166)
    doc.setFont(undefined, 'bold')
    doc.text('CERTIFICATE OF APPRECIATION', 148.5, 50, { align: 'center' })
    
    // Subtitle
    doc.setFontSize(14)
    doc.setTextColor(0, 0, 0)
    doc.setFont(undefined, 'normal')
    doc.text('This is to certify that', 148.5, 70, { align: 'center' })
    
    // Donor Name
    doc.setFontSize(24)
    doc.setFont(undefined, 'bold')
    doc.setTextColor(0, 0, 0)
    doc.text(donation.donor_name.toUpperCase(), 148.5, 90, { align: 'center' })
    
    // Certificate Text
    doc.setFontSize(12)
    doc.setFont(undefined, 'normal')
    const certificateText = `has made a generous donation towards ${donation.cause} 
through the ${donation.package_id} program. This contribution will help transform lives 
and create lasting impact in our communities.`
    
    doc.text(certificateText, 148.5, 110, { 
        align: 'center',
        maxWidth: 250,
    })
    
    // Donation ID
    doc.setFontSize(10)
    doc.text(`Donation ID: ${donation.donation_id}`, 148.5, 140, { align: 'center' })
    doc.text(`Date: ${new Date(donation.created_at).toLocaleDateString('en-IN', { 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric' 
    })}`, 148.5, 150, { align: 'center' })
    
    // Signature
    doc.setFontSize(10)
    doc.text('_________________________', 60, 170)
    doc.text('Authorized Signatory', 60, 175)
    doc.text('SBB Foundation', 60, 180)
    
    // Logo/Seal area
    doc.setFontSize(8)
    doc.text('80G Certified | Registered NGO', 237, 180, { align: 'right' })
    
    doc.save(`donation-certificate-${donation.donation_id}.pdf`)
}

function exportToCSV() {
    if (filteredDonations.length === 0) {
        alert('No donations to export')
        return
    }

    // CSV Headers
    const headers = ['Donation ID', 'Donor Name', 'Donor Email', 'Donor Phone', 'Cause', 'Package', 'Quantity', 'Amount', 'Payment Method', 'Payment ID', 'Status', 'Date']
    
    // CSV Rows
    const rows = filteredDonations.map(d => [
        d.donation_id,
        d.donor_name,
        d.donor_email,
        d.donor_phone,
        d.cause,
        d.package_id,
        d.quantity,
        d.amount,
        d.payment_method,
        d.payment_id,
        d.status,
        new Date(d.created_at).toLocaleDateString('en-IN')
    ])
    
    // Combine headers and rows
    const csvContent = [
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n')
    
    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `donations-${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
}

function logout() {
    sessionStorage.removeItem('adminAuthenticated')
    window.location.href = 'index.html'
}

