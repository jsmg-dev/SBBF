// Simple bilingual toggle (EN/HI) using data-i18n keys
const translations = {
    en: {
        heroTitle: "Adopt a Cow. Sponsor a Child. Serve Humanity.",
        heroLead: "Transparent, grassroots impact in Rajasthan through gaushala care, child sponsorship, and women empowerment.",
        donateNow: "Donate Now — दान करें",
        adoptCow: "Adopt a Cow",
        sponsorChild: "Sponsor a Child",
        volunteer: "Volunteer",
        counters: ["Cows adopted", "Children sponsored", "Meals served", "Projects completed"],
        aboutTitle: "Why SBB Foundation",
        aboutLead: "Registered NGO (Reg. No: 202501182014600) delivering monthly reports, verified beneficiaries, and receipts for every donation.",
        programsTitle: "Programs",
        cowDesc: "Shelter, fodder, and veterinary care at our gaushala in Gram Chhan, Tonk (Rajasthan). Monthly updates and photos.",
        childDesc: "Fund education, meals, and learning kits. Sponsors receive progress notes and attendance snapshots.",
        womenDesc: "Skill training, self-help groups, and micro-enterprise linkages for sustainable incomes.",
        tiersLabel: "Popular plans",
        donateTitle: "Donation Plans",
        donateLead: "Choose a preset, make a one-time gift, or enable recurring. Instant email receipt with PDF.",
        offlineTitle: "Offline Donation",
        offlineLead: "Bank transfer / UPI accepted. Share payment proof to get your receipt.",
        gaushalaTitle: "Gaushala & Fieldwork",
        gaushalaLead: "Daily seva, vaccination, and fodder support at our gaushala. Visitors welcome by appointment.",
        newsTitle: "News & Updates",
        newsLead: "Press, success stories, and monthly impact digests.",
        faqTitle: "FAQ",
        contactTitle: "Contact & Help",
        contactLead: "Call/WhatsApp: +91 9166010400 · Email: jitendra.sharma@sbbf.in",
        adminCta: "Donor / Admin Login",
        footer: "Transparency • Receipts • Monthly updates"
    },
    hi: {
        heroTitle: "गोमाता दत्तक • बाल शिक्षा • जनकल्याण — आज ही जुड़ें।",
        heroLead: "राजस्थान में गौसेवा, बाल शिक्षा और महिला सशक्तिकरण के लिए पारदर्शी सेवा। प्रत्येक दान पर रसीद और मासिक अपडेट।",
        donateNow: "Donate Now — दान करें",
        adoptCow: "गोमाता दत्तक",
        sponsorChild: "बाल शिक्षा प्रायोजन",
        volunteer: "स्वयंसेवक बनें",
        counters: ["गोद ली गई गायें", "प्रायोजित बच्चे", "सेवे गए भोजन", "पूरित प्रोजेक्ट"],
        aboutTitle: "क्यों चुनें SBB फाउंडेशन",
        aboutLead: "पंजीकृत NGO (Reg. No: 202501182014600) — सत्यापित लाभार्थी, हर दान पर रसीद, मासिक रिपोर्ट।",
        programsTitle: "मुख्य कार्यक्रम",
        cowDesc: "ग्राम छान, टोंक (राजस्थान) स्थित गौशाला में आश्रय, चारा और पशु चिकित्सा देखभाल। मासिक फोटो अपडेट।",
        childDesc: "शिक्षा, भोजन और लर्निंग किट का समर्थन। प्रगति रिपोर्ट और उपस्थिति अपडेट साझा किए जाते हैं।",
        womenDesc: "कौशल प्रशिक्षण, स्वयं सहायता समूह और सूक्ष्म उद्यम जोड़ाव से स्थायी आजीविका।",
        tiersLabel: "लोकप्रिय योजनाएं",
        donateTitle: "दान योजनाएं",
        donateLead: "पूर्व-निर्धारित योजना चुनें, एकमुश्त दान करें या आवर्ती सक्षम करें। तुरंत ईमेल रसीद और पीडीएफ।",
        offlineTitle: "ऑफ़लाइन दान",
        offlineLead: "बैंक ट्रांसफ़र / UPI स्वीकृत। भुगतान प्रमाण साझा करें ताकि रसीद मिल सके।",
        gaushalaTitle: "गौशाला और कार्य",
        gaushalaLead: "गौसेवा, टीकाकरण और चारे का दैनिक प्रबंधन। पूर्व नियुक्ति पर विज़िट संभव है।",
        newsTitle: "समाचार और अपडेट",
        newsLead: "प्रेस, सफलता कहानियां और मासिक प्रभाव सारांश।",
        faqTitle: "सामान्य प्रश्न",
        contactTitle: "संपर्क / सहायता",
        contactLead: "कॉल/व्हाट्सएप: +91 9166010400 · ईमेल: jitendra.sharma@sbbf.in",
        adminCta: "डोनर / एडमिन लॉगिन",
        footer: "पारदर्शिता • रसीद • मासिक अपडेट"
    }
};

// Events and press galleries (extend ranges if more photos are added)
const eventImages = Array.from({ length: 78 }, (_, i) => `images/event/event${i + 1}.jpeg`);
const pressImages = Array.from({ length: 52 }, (_, i) => `images/press/press${i + 1}.jpeg`);

const state = { lang: 'en' };

function setLanguage(lang) {
    state.lang = lang;
    const dict = translations[lang];
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (key === 'counters') {
            el.querySelectorAll('[data-i18n-item]').forEach((item, idx) => {
                item.textContent = dict.counters[idx] || '';
            });
        } else if (dict[key]) {
            el.textContent = dict[key];
        }
    });
    document.documentElement.lang = lang === 'hi' ? 'hi' : 'en';
}

document.addEventListener('DOMContentLoaded', () => {
    // Lang toggle
    const langBtn = document.getElementById('lang-toggle');
    langBtn?.addEventListener('click', () => {
        const next = state.lang === 'en' ? 'hi' : 'en';
        setLanguage(next);
        langBtn.textContent = next === 'en' ? 'EN' : 'हिंदी';
    });

    // Scroll to target for CTA buttons
    document.querySelectorAll('[data-scroll]').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.getAttribute('data-scroll');
            const target = document.getElementById(id);
            target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });

    renderGallery('event-gallery', eventImages, 'Event photo');
    renderGallery('press-gallery', pressImages, 'Press photo');

    setLanguage('en');
});

function renderGallery(containerId, images, label) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const frag = document.createDocumentFragment();
    images.forEach((src, idx) => {
        const link = document.createElement('a');
        link.href = src;
        link.target = '_blank';
        link.rel = 'noreferrer';

        const img = document.createElement('img');
        img.loading = 'lazy';
        img.src = src;
        img.alt = `${label} ${idx + 1}`;

        link.appendChild(img);
        frag.appendChild(link);
    });

    container.appendChild(frag);
}

