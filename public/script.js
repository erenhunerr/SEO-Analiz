document.getElementById('seoForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const url = document.getElementById('url').value;
    if (!url) {
        alert('Lütfen bir URL girin');
        return;
    }
    
    const response = await fetch('/api/seo', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ url })
    });

    const data = await response.json();
    displayResults(data);
});

function displayResults(data) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = `
        <h2>SEO Analiz Sonuçları</h2>
        <p><strong>Meta Title Etiketi:</strong> ${data.title}</p>
        <p><strong>Meta Description Etiketi:</strong> ${data.description}</p>
        <p><strong>Meta Keyword Etiketi:</strong> ${Array.isArray(data.keywords) ? data.keywords.join(', ') : data.keywords}</p>
        <p><strong>Meta Author Etiketi:</strong> ${data.author}</p>
        <p><strong>Meta Robots Etiketi:</strong> ${data.robots}</p>
        <p><strong>Meta Publisher Etiketi:</strong> ${data.publisher}</p>
        <p><strong>Meta Charset Etiketi:</strong> ${data.charset}</p>
        <p><strong>Twitter Card Meta Etiketi:</strong> ${data.twitterCard}</p>
        <p><strong>Facebook Open Graph Etiketi:</strong> ${data.ogTitle}</p>
        <p><strong>Canonical Etiketi:</strong> ${data.canonical}</p>
        <p><strong>Sayfa Dil Etiketi:</strong> ${data.language}</p>
        <p><strong>Heading Etiket Yapısı:</strong> H1: ${data.headings.h1}, H2: ${data.headings.h2}, H3: ${data.headings.h3}, H4: ${data.headings.h4}, H5: ${data.headings.h5}, H6: ${data.headings.h6}</p>
        <p><strong>Dış Linkler:</strong> ${data.externalLinks.length > 0 ? data.externalLinks.join(', ') : 'Dış link yok'}</p>
        <p><strong>Yapılandırılmış Veriler:</strong> ${data.structuredData}</p>
        <p><strong>404 Sayfası:</strong> ${data.notFound}</p>
        <p><strong>Font Boyutları:</strong> ${data.fontSizes.join(', ')}</p>
        <p><strong>Iframe Kullanımı:</strong> ${data.iframes}</p>
        <p><strong>Table Etiketi Kullanımı:</strong> ${data.tables}</p>
        <p><strong>AMP Kullanımı:</strong> ${data.amp}</p>
        <p><strong>Favicon Kullanımı:</strong> ${data.favicon}</p>
        <p><strong>Responsive Tasarım:</strong> ${data.responsive}</p>
        <p><strong>Mobil Uyumluluk:</strong> ${data.mobileFriendly}</p>
        <p><strong>ALT Etiketi Olmayan Resimler:</strong> ${data.imagesWithoutAlt.length > 0 ? data.imagesWithoutAlt.join(', ') : 'Tüm resimlerde ALT etiketi mevcut'}</p>
        <p><strong>Title Etiketi Olmayan Linkler:</strong> <ul>
            ${data.linksWithoutTitle.length > 0 ? 
                data.linksWithoutTitle.map(link => `
                    <li>
                        <a href="${link.url}">Link: ${link.url}</a> - Yazı: ${link.text}
                    </li>
                `).join('') : 
                '<li>Tüm linklerde Title etiketi mevcut</li>'
            }
        </ul></p>
    `;
}


