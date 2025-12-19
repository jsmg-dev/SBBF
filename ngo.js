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
        cowDesc: "Take responsibility for a cow through our gaushala program in Rajasthan—safe shelter, nutritious fodder, and regular veterinary care with monthly photo/status updates.",
        adoptDesc: "Take responsibility for a cow through our Rajasthan gaushala. Your support provides safe shelter, nutritious fodder, and regular veterinary care. Monthly photo/status updates connect you to the seva.",
        adoptTier1: "₹501 / month: Essential fodder and basic care + monthly photos/updates",
        adoptTier2: "₹1100 / month: Full nutrition, medical care, and safety + health reports",
        adoptTier3: "₹2100 / month: High-quality fodder, regular checkups, special care + photo/video updates",
        childDesc: "Education, safety, and a better future for children from low-income families—covering books, meals, uniforms, school support, and a safe learning environment with regular progress updates.",
        childTier1: "₹1100 / month: Basic study materials, meals, and school support + monthly progress/attendance updates",
        childTier2: "₹2100 / month: Complete educational package (materials, uniform, meals, extra classes) + activity/achievement updates",
        childTier3: "₹5100 / month: Life-changing package (education, nutrition, health, better environment) + detailed reports/photos/videos",
        womenDesc: "Women’s Empowerment",
        womenIntro: "We build women’s economic independence through skill training, digital literacy, tailoring, and SHG formation. We also provide seed capital, market access, and sales opportunities.",
        womenActivities: "Key activities: digital education, tailoring batches, SHG formation with financial guidance, market linkage, and micro-enterprise support.",
        womenTier1: "₹11,000 / month: Foundational skill training and SHG onboarding + monthly progress updates",
        womenTier2: "₹51,000 / month: Advanced skills, digital education, seed capital, and market access + monthly photos/stories",
        womenTier3: "₹1,11,000 / month: Full empowerment package (business start, SHG support, market connections, financial guidance) + special reports/videos",
        tiersLabel: "Popular plans",
        donateTitle: "Donation Plans",
        donateLead: "Choose an amount, pay via UPI/QR or bank, and share proof for your receipt.",
        donateEssentialsLead: "SBB Foundation goes beyond education, cow adoption, and women empowerment. We also ensure basic necessities reach those in need.",
        donateEssentialsBlankets: "Blankets: Distributed during winters to keep vulnerable families warm.",
        donateEssentialsFood: "Food: Clean, nutritious meals for hungry individuals and needy families.",
        donateEssentialsSupport: "Your support covers education, women empowerment, cow welfare, and essentials for the underprivileged.",
        donateOptionsLabel: "Donation options:",
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
        cowDesc: "राजस्थान स्थित गौशाला में आश्रय, चारा और पशु चिकित्सा देखभाल। मासिक फोटो अपडेट।",
        adoptDesc: "SBB Foundation की गोदर्शन योजना के तहत आप एक गौ माता की जिम्मेदारी लेते हैं। आपका सहयोग हमारी राजस्थान स्थित गौशाला की गायों को सुरक्षित आश्रय, पौष्टिक चारा और नियमित पशु-चिकित्सा सेवाएँ देता है। प्रत्येक दानदाता को मासिक आधार पर गाय की स्थिति, फोटो और देखभाल अपडेट मिलते हैं। यह गोसेवा भारतीय संस्कृति, परंपरा और पर्यावरण संरक्षण से भी जुड़ी है।",
        adoptTier1: "₹501 / माह: आवश्यक चारा और बुनियादी देखभाल + मासिक फोटो/अपडेट",
        adoptTier2: "₹1100 / माह: संपूर्ण पोषण, चिकित्सकीय देखभाल और सुरक्षा + स्वास्थ्य रिपोर्ट",
        adoptTier3: "₹2100 / माह: उच्च गुणवत्ता वाला चारा, नियमित परीक्षण व विशेष देखभाल + विशेष फोटो/वीडियो अपडेट",
        childDesc: "SBB Foundation का बाल शिक्षा कार्यक्रम आर्थिक रूप से कमजोर बच्चों को शिक्षा, सुरक्षा और बेहतर भविष्य देता है। आपका स्पॉन्सरशिप पढ़ाई की सामग्री, पोषणयुक्त भोजन, यूनिफॉर्म, स्कूल सपोर्ट और सुरक्षित सीखने का माहौल सुनिश्चित करता है। हम समय-समय पर बच्चे की प्रगति, उपस्थिति, गतिविधियों और उपलब्धियों का अपडेट भेजते हैं।",
        childTier1: "₹1100 / माह: बुनियादी पढ़ाई सामग्री, भोजन और स्कूल सपोर्ट + मासिक प्रगति/उपस्थिति अपडेट",
        childTier2: "₹2100 / माह: पूरा शैक्षिक पैकेज (सामग्री, यूनिफ़ॉर्म, भोजन, अतिरिक्त कक्षाएं) + गतिविधि/उपलब्धि अपडेट",
        childTier3: "₹5100 / माह: संपूर्ण जीवन-परिवर्तक पैकेज (शिक्षा, पोषण, स्वास्थ्य, बेहतर वातावरण) + डिटेल्ड रिपोर्ट/फोटो/वीडियो",
        womenDesc: "कौशल प्रशिक्षण, स्वयं सहायता समूह और सूक्ष्म उद्यम जोड़ाव से स्थायी आजीविका।",
        womenIntro: "हम महिलाओं को आर्थिक रूप से आत्मनिर्भर बनाने के लिए कौशल प्रशिक्षण, डिजिटल साक्षरता, सिलाई-बुनाई कोर्स, और स्वयं सहायता समूह (SHG) गठन पर काम करते हैं। महिलाएँ कौशल सीखकर छोटे व्यवसाय शुरू करती हैं; हम उन्हें बीज पूंजी, बाज़ार तक पहुँच और उत्पाद बेचने के अवसर भी उपलब्ध कराते हैं।",
        womenActivities: "मुख्य गतिविधियाँ: डिजिटल शिक्षा, सिलाई–कटिंग बैच, SHG निर्माण व वित्तीय मार्गदर्शन, मार्केट कनेक्शन व माइक्रो-एंटरप्राइज सपोर्ट।",
        womenTier1: "₹11,000 / माह: बुनियादी कौशल प्रशिक्षण और SHG नेटवर्क में जोड़ना + मासिक प्रगति अपडेट",
        womenTier2: "₹51,000 / माह: उन्नत कौशल प्रशिक्षण, डिजिटल शिक्षा, बीज पूंजी और बाज़ार पहुँच + मासिक फोटो/कहानियाँ",
        womenTier3: "₹1,11,000 / माह: पूरा सशक्तिकरण पैकेज (व्यवसाय शुरू करना, SHG सपोर्ट, मार्केट कनेक्शन, वित्तीय मार्गदर्शन) + विशेष रिपोर्ट/वीडियो",
        donationTiersLabel: "दान श्रेणियाँ:",
        tiersLabel: "लोकप्रिय योजनाएं",
        donateTitle: "दान योजनाएं",
        donateLead: "राशि चुनें, UPI/QR या बैंक से भुगतान करें, प्रमाण साझा करें और रसीद प्राप्त करें।",
        donateEssentialsLead: "SBB Foundation शिक्षा, गो सेवा और महिला सशक्तिकरण से आगे बढ़कर जरूरतमंदों तक आवश्यक वस्तुएँ भी पहुँचाता है।",
        donateEssentialsBlankets: "कंबल: सर्दियों में जरूरतमंद परिवारों को ऊष्मा के लिए वितरित।",
        donateEssentialsFood: "भोजन: भूखे व्यक्तियों और गरीब परिवारों को स्वच्छ, पौष्टिक भोजन।",
        donateEssentialsSupport: "आपका सहयोग शिक्षा, महिला सशक्तिकरण, गो सेवा और जरूरतमंदों की आवश्यक जरूरतों को पूरा करता है।",
        donateOptionsLabel: "दान विकल्प:",
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
const eventImages = Array.from({ length: 78 }, (_, i) => `images/event/event${i + 1}.jpeg`)
    .filter(src => !src.includes('event76.jpeg') && !src.includes('event77.jpeg') && !src.includes('event78.jpeg'));
	// ➕ Add your new photos here
eventImages.unshift(
    "images/event/K7.jpeg",
    "images/event/B1.jpeg",
    "images/event/K2.jpeg",
    "images/event/K2.jpeg",
	"images/event/K3.jpeg",
	"images/event/K4.jpeg",
	"images/event/K5.jpeg",
	"images/event/K6.jpeg",
	"images/event/event71.jpeg",
	"images/event/event72.jpeg",
	"images/event/event73.jpeg",
	"images/event/event74.jpeg",
	"images/event/event75.jpeg"
);
const pressImages = Array.from({ length: 52 }, (_, i) => `images/press/press${i + 1}.jpeg`).filter(src => !src.includes('press49.jpeg'));

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

