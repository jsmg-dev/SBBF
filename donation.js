// Donation System - Complete Frontend Implementation
// All data stored in localStorage

// Causes and Packages Configuration
const causes = {
  'child-education': {
    name: 'Child Education',
    packages: {
      'annual': { name: 'Annual Sponsorship', amount: 9999, period: 'year' },
      'monthly': { name: 'Monthly Support', amount: 999, period: 'month' },
    },
  },
  'women-empowerment': {
    name: 'Women Empowerment',
    packages: {
      'training-kit': { name: 'Training Kit', amount: 6999, period: 'one-time' },
      'monthly-program': { name: 'Monthly Empowerment Program', amount: 2999, period: 'month' },
    },
  },
  'cow-welfare': {
    name: 'Cow Welfare',
    packages: {
      'adopt-cow': { name: 'Adopt a Cow', amount: 21000, period: 'one-time' },
      'monthly-maintenance': { name: 'Monthly Maintenance', amount: 1500, period: 'month' },
    },
  },
}

// Donation Data
let donationData = {
  cause: null,
  packageId: null,
  quantity: 1,
  donorName: '',
  donorEmail: '',
  donorPhone: '',
  donorAddress: '',
  paymentMethod: null,
  donationId: null,
}

let currentStep = 1

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
  initializeDonation()
  setupEventListeners()
})

function initializeDonation() {
  // Check for URL parameters
  const urlParams = new URLSearchParams(window.location.search)
  const causeParam = urlParams.get('cause')
  const packageParam = urlParams.get('package')
  
  if (causeParam && causes[causeParam]) {
    donationData.cause = causeParam
    if (packageParam && causes[causeParam].packages[packageParam]) {
      donationData.packageId = packageParam
      currentStep = 3
    } else {
      currentStep = 2
    }
    showStep(currentStep)
  } else {
    showStep(1)
  }
}

function setupEventListeners() {
  // Cause selection
  document.querySelectorAll('.cause-card').forEach(card => {
    card.addEventListener('click', function() {
      const causeId = this.dataset.cause
      selectCause(causeId)
    })
  })

  // Donor form submission
  const donorForm = document.getElementById('donorForm')
  if (donorForm) {
    donorForm.addEventListener('submit', function(e) {
      e.preventDefault()
      if (validateDonorForm()) {
        saveDonorInfo()
        goToStep(5)
      }
    })
  }
}

function selectCause(causeId) {
  donationData.cause = causeId
  donationData.packageId = null
  showPackages(causeId)
  goToStep(2)
}

function showPackages(causeId) {
  const packagesGrid = document.getElementById('packagesGrid')
  if (!packagesGrid) return

  const cause = causes[causeId]
  if (!cause) return

  packagesGrid.innerHTML = ''
  
  Object.entries(cause.packages).forEach(([id, pkg], index) => {
    const packageCard = document.createElement('div')
    packageCard.className = `package-card ${index === 0 ? 'popular' : ''}`
    packageCard.innerHTML = `
      ${index === 0 ? '<div class="popular-badge">Most Popular</div>' : ''}
      <h3>${pkg.name}</h3>
      <div class="package-price">
        <span class="amount">₹${pkg.amount.toLocaleString()}</span>
        <span class="period">/${pkg.period}</span>
      </div>
      <button class="btn-select" onclick="selectPackage('${id}')">Select Package</button>
    `
    packagesGrid.appendChild(packageCard)
  })
}

function selectPackage(packageId) {
  donationData.packageId = packageId
  updateSummary()
  goToStep(3)
}

function changeQuantity(delta) {
  const quantityInput = document.getElementById('quantityInput')
  let quantity = parseInt(quantityInput.value) || 1
  quantity = Math.max(1, quantity + delta)
  quantityInput.value = quantity
  updateQuantity()
}

function updateQuantity() {
  const quantityInput = document.getElementById('quantityInput')
  donationData.quantity = parseInt(quantityInput.value) || 1
  updatePackageSummary()
  updateSummary()
}

function updatePackageSummary() {
  const summary = document.getElementById('packageSummary')
  if (!summary || !donationData.cause || !donationData.packageId) return

  const cause = causes[donationData.cause]
  const pkg = cause.packages[donationData.packageId]
  const total = pkg.amount * donationData.quantity

  summary.innerHTML = `
    <div class="summary-item">
      <span>Package:</span>
      <strong>${pkg.name}</strong>
    </div>
    <div class="summary-item">
      <span>Unit Price:</span>
      <strong>₹${pkg.amount.toLocaleString()}</strong>
    </div>
    <div class="summary-item">
      <span>Quantity:</span>
      <strong>${donationData.quantity}</strong>
    </div>
    <div class="summary-item total">
      <span>Total Amount:</span>
      <strong>₹${total.toLocaleString()}</strong>
    </div>
  `
}

function validateDonorForm() {
  const name = document.getElementById('donorName').value.trim()
  const email = document.getElementById('donorEmail').value.trim()
  const phone = document.getElementById('donorPhone').value.trim()
  const address = document.getElementById('donorAddress').value.trim()

  if (!name || !email || !phone || !address) {
    alert('Please fill in all required fields')
    return false
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    alert('Please enter a valid email address')
    return false
  }

  return true
}

function saveDonorInfo() {
  donationData.donorName = document.getElementById('donorName').value.trim()
  donationData.donorEmail = document.getElementById('donorEmail').value.trim()
  donationData.donorPhone = document.getElementById('donorPhone').value.trim()
  donationData.donorAddress = document.getElementById('donorAddress').value.trim()
  updatePaymentSummary()
}

function updatePaymentSummary() {
  const summary = document.getElementById('paymentSummary')
  if (!summary || !donationData.cause || !donationData.packageId) return

  const cause = causes[donationData.cause]
  const pkg = cause.packages[donationData.packageId]
  const total = pkg.amount * donationData.quantity

  summary.innerHTML = `
    <div class="payment-summary-card">
      <h3>Donation Summary</h3>
      <div class="summary-row">
        <span>Cause:</span>
        <strong>${cause.name}</strong>
      </div>
      <div class="summary-row">
        <span>Package:</span>
        <strong>${pkg.name}</strong>
      </div>
      <div class="summary-row">
        <span>Quantity:</span>
        <strong>${donationData.quantity}</strong>
      </div>
      <div class="summary-row">
        <span>Donor:</span>
        <strong>${donationData.donorName}</strong>
      </div>
      <div class="summary-row total">
        <span>Total Amount:</span>
        <strong>₹${total.toLocaleString()}</strong>
      </div>
    </div>
  `
}

function goToStep(step) {
  currentStep = step
  showStep(step)
  updateProgress()
  updateSummary()
}

function showStep(step) {
  // Hide all steps
  document.querySelectorAll('.donation-step').forEach(el => {
    el.classList.remove('active')
    el.style.display = 'none'
  })

  // Show current step
  const stepElement = document.getElementById(`step${step}`)
  if (stepElement) {
    stepElement.classList.add('active')
    stepElement.style.display = 'block'
  }

  // Special handling for step 2 (packages)
  if (step === 2 && donationData.cause) {
    showPackages(donationData.cause)
  }

  // Special handling for step 3 (quantity)
  if (step === 3) {
    updatePackageSummary()
  }

  // Special handling for step 5 (payment)
  if (step === 5) {
    updatePaymentSummary()
  }
}

function updateProgress() {
  document.querySelectorAll('.progress-step').forEach((step, index) => {
    const stepNum = index + 1
    const circle = step.querySelector('.step-circle')
    if (stepNum < currentStep) {
      step.classList.add('completed')
      circle.textContent = '✓'
    } else if (stepNum === currentStep) {
      step.classList.add('active')
      step.classList.remove('completed')
      circle.textContent = stepNum
    } else {
      step.classList.remove('active', 'completed')
      circle.textContent = stepNum
    }
  })
}

function updateSummary() {
  const summary = document.getElementById('donationSummary')
  const content = document.getElementById('summaryContent')
  
  if (!summary || !content) return

  if (currentStep > 1 && donationData.cause) {
    summary.style.display = 'block'
    const cause = causes[donationData.cause]
    const pkg = donationData.packageId ? cause.packages[donationData.packageId] : null
    const total = pkg ? pkg.amount * donationData.quantity : 0

    content.innerHTML = `
      <div class="summary-item">
        <span>Cause:</span>
        <strong>${cause.name}</strong>
      </div>
      ${pkg ? `
        <div class="summary-item">
          <span>Package:</span>
          <strong>${pkg.name}</strong>
        </div>
        <div class="summary-item">
          <span>Quantity:</span>
          <strong>${donationData.quantity}</strong>
        </div>
        <div class="summary-item">
          <span>Unit Price:</span>
          <strong>₹${pkg.amount.toLocaleString()}</strong>
        </div>
        <div class="summary-item total">
          <span>Total:</span>
          <strong>₹${total.toLocaleString()}</strong>
        </div>
      ` : ''}
    `
  } else {
    summary.style.display = 'none'
  }
}

// Payment Functions
function initiateRazorpay() {
  if (!donationData.cause || !donationData.packageId) {
    alert('Please complete all steps first')
    return
  }

  const cause = causes[donationData.cause]
  const pkg = cause.packages[donationData.packageId]
  const total = pkg.amount * donationData.quantity

  // Generate donation ID
  const prefix = donationData.cause === 'child-education' ? 'EDU' : 
                 donationData.cause === 'women-empowerment' ? 'WOM' : 'COW'
  const donationId = `${prefix}-${Math.floor(100000 + Math.random() * 900000)}`
  donationData.donationId = donationId

  // Razorpay options
  const options = {
    key: 'rzp_test_1234567890', // Replace with actual key
    amount: total * 100, // Amount in paise
    currency: 'INR',
    name: 'SBB Foundation',
    description: `${pkg.name} - ${cause.name}`,
    image: '/logo.svg',
    handler: function(response) {
      handlePaymentSuccess(response.razorpay_payment_id, 'razorpay', donationId)
    },
    prefill: {
      name: donationData.donorName,
      email: donationData.donorEmail,
      contact: donationData.donorPhone,
    },
    theme: {
      color: '#14b8a6',
    },
    modal: {
      ondismiss: function() {
        console.log('Payment cancelled')
      },
    },
  }

  const razorpay = new Razorpay(options)
  razorpay.open()
}

function initiateStripe() {
  if (!donationData.cause || !donationData.packageId) {
    alert('Please complete all steps first')
    return
  }

  // Simulate Stripe payment (in production, integrate with Stripe API)
  const cause = causes[donationData.cause]
  const pkg = cause.packages[donationData.packageId]
  const total = pkg.amount * donationData.quantity

  const prefix = donationData.cause === 'child-education' ? 'EDU' : 
                 donationData.cause === 'women-empowerment' ? 'WOM' : 'COW'
  const donationId = `${prefix}-${Math.floor(100000 + Math.random() * 900000)}`
  donationData.donationId = donationId

  // Simulate payment processing
  if (confirm(`Confirm payment of ₹${total.toLocaleString()} via Stripe?`)) {
    setTimeout(() => {
      handlePaymentSuccess(`stripe_${Date.now()}`, 'stripe', donationId)
    }, 1000)
  }
}

function handlePaymentSuccess(paymentId, paymentMethod, donationId) {
  // Save donation to localStorage
  const donation = {
    id: getNextDonationId(),
    donation_id: donationId,
    cause: causes[donationData.cause].name,
    package_id: donationData.packageId,
    quantity: donationData.quantity,
    donor_name: donationData.donorName,
    donor_email: donationData.donorEmail,
    donor_phone: donationData.donorPhone,
    donor_address: donationData.donorAddress,
    amount: calculateTotal(),
    payment_id: paymentId,
    payment_method: paymentMethod,
    status: 'completed',
    created_at: new Date().toISOString(),
  }

  saveDonationToStorage(donation)

  // Show success step
  showSuccessStep(donationId)
}

function calculateTotal() {
  if (!donationData.cause || !donationData.packageId) return 0
  const cause = causes[donationData.cause]
  const pkg = cause.packages[donationData.packageId]
  return pkg.amount * donationData.quantity
}

function getNextDonationId() {
  const donations = getAllDonations()
  if (donations.length === 0) return 1
  return Math.max(...donations.map(d => d.id)) + 1
}

function getAllDonations() {
  const stored = localStorage.getItem('donations')
  return stored ? JSON.parse(stored) : []
}

function saveDonationToStorage(donation) {
  const donations = getAllDonations()
  donations.push(donation)
  localStorage.setItem('donations', JSON.stringify(donations))
}

function showSuccessStep(donationId) {
  document.querySelectorAll('.donation-step').forEach(el => {
    el.classList.remove('active')
    el.style.display = 'none'
  })

  const successStep = document.getElementById('stepSuccess')
  if (successStep) {
    successStep.style.display = 'block'
    successStep.classList.add('active')
    document.getElementById('donationIdDisplay').textContent = `Donation ID: ${donationId}`
  }

  // Store current donation for receipt/certificate generation
  window.currentDonation = {
    donationId,
    donationData: { ...donationData },
    total: calculateTotal(),
    cause: causes[donationData.cause],
    package: causes[donationData.cause].packages[donationData.packageId],
  }
}

function downloadReceipt() {
  if (!window.currentDonation) return

  const { jsPDF } = window.jspdf
  const doc = new jsPDF()
  
  const donation = window.currentDonation
  const donationData = donation.donationData

  // Header
  doc.setFontSize(20)
  doc.setTextColor(20, 184, 166) // Teal color
  doc.text('SBB Foundation', 105, 20, { align: 'center' })
  
  doc.setFontSize(16)
  doc.setTextColor(0, 0, 0)
  doc.text('DONATION RECEIPT', 105, 30, { align: 'center' })
  
  // Receipt Details
  doc.setFontSize(10)
  doc.text(`Receipt No: ${donation.donationId}`, 20, 45)
  doc.text(`Date: ${new Date().toLocaleDateString('en-IN')}`, 20, 52)
  
  // Donor Information
  doc.setFontSize(12)
  doc.setFont(undefined, 'bold')
  doc.text('Donor Information:', 20, 65)
  
  doc.setFont(undefined, 'normal')
  doc.setFontSize(10)
  doc.text(`Name: ${donationData.donorName}`, 20, 72)
  doc.text(`Email: ${donationData.donorEmail}`, 20, 79)
  doc.text(`Phone: ${donationData.donorPhone}`, 20, 86)
  doc.text(`Address: ${donationData.donorAddress}`, 20, 93, { maxWidth: 170 })
  
  // Donation Details
  doc.setFontSize(12)
  doc.setFont(undefined, 'bold')
  doc.text('Donation Details:', 20, 110)
  
  doc.setFont(undefined, 'normal')
  doc.setFontSize(10)
  doc.text(`Cause: ${donation.cause.name}`, 20, 117)
  doc.text(`Package: ${donation.package.name}`, 20, 124)
  doc.text(`Amount: ₹${donation.total.toLocaleString()}`, 20, 131)
  
  // Tax Information
  doc.setFontSize(10)
  doc.text('This donation is eligible for tax deduction under Section 80G of the Income Tax Act, 1961.', 20, 145, { maxWidth: 170 })
  
  // Footer
  doc.setFontSize(8)
  doc.setTextColor(100, 100, 100)
  doc.text('SBB Foundation - Registered NGO | 80G Certified', 105, 280, { align: 'center' })
  
  // Save PDF
  doc.save(`donation-receipt-${donation.donationId}.pdf`)
}

function downloadCertificate() {
  if (!window.currentDonation) return

  const { jsPDF } = window.jspdf
  const doc = new jsPDF('landscape', 'mm', 'a4')
  
  const donation = window.currentDonation
  const donationData = donation.donationData

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
  doc.text(donationData.donorName.toUpperCase(), 148.5, 90, { align: 'center' })
  
  // Certificate Text
  doc.setFontSize(12)
  doc.setFont(undefined, 'normal')
  const certificateText = `has made a generous donation towards ${donation.cause.name} 
through the ${donation.package.name} program. This contribution will help transform lives 
and create lasting impact in our communities.`
  
  doc.text(certificateText, 148.5, 110, { 
    align: 'center',
    maxWidth: 250,
  })
  
  // Donation ID
  doc.setFontSize(10)
  doc.text(`Donation ID: ${donation.donationId}`, 148.5, 140, { align: 'center' })
  doc.text(`Date: ${new Date().toLocaleDateString('en-IN', { 
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
  
  // Save PDF
  doc.save(`donation-certificate-${donation.donationId}.pdf`)
}

function resetDonation() {
  donationData = {
    cause: null,
    packageId: null,
    quantity: 1,
    donorName: '',
    donorEmail: '',
    donorPhone: '',
    donorAddress: '',
    paymentMethod: null,
    donationId: null,
  }
  currentStep = 1
  window.currentDonation = null
  
  // Reset form
  const form = document.getElementById('donorForm')
  if (form) form.reset()
  
  showStep(1)
  updateProgress()
  updateSummary()
}

