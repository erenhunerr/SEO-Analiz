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
        <hr>
        <p><strong>Meta Title Etiketi:</strong> ${data.title}</p>
        <hr>
        <p><strong>Meta Description Etiketi:</strong> ${data.description}</p>
        <hr>
        <p><strong>Meta Keyword Etiketi:</strong> ${Array.isArray(data.keywords) ? data.keywords.join(', ') : data.keywords}</p>
        <hr>
        <p><strong>Meta Author Etiketi:</strong> ${data.author}</p>
        <hr>
        <p><strong>Meta Robots Etiketi:</strong> ${data.robots}</p>
        <hr>
        <p><strong>Meta Publisher Etiketi:</strong> ${data.publisher}</p>
        <hr>
        <p><strong>Meta Charset Etiketi:</strong> ${data.charset}</p>
        <hr>
        <p><strong>Twitter Card Meta Etiketi:</strong> ${data.twitterCard}</p>
        <hr>
        <p><strong>Facebook Open Graph Etiketi:</strong> ${data.ogTitle}</p>
        <hr>
        <p><strong>Canonical Etiketi:</strong> ${data.canonical}</p>
        <hr>
        <p><strong>Sayfa Dil Etiketi:</strong> ${data.language}</p>
        <hr>
        <p><strong>Heading Etiket Yapısı:</strong></p><ul>
        <li>H1: ${data.headings.h1}</li>
        <li>H2: ${data.headings.h2}</li>
        <li>H3: ${data.headings.h3}</li>
        <li>H4: ${data.headings.h4}</li>
        <li>H5: ${data.headings.h5}</li>
        <li>H6: ${data.headings.h6}</li>
        </ul>
        <hr>
        <p><strong>Dış Linkler:</strong> ${data.externalLinks.length > 0 ? data.externalLinks.map(a => `<li>${a}</li>`).join('') : 'Dış link yok'}</p>
        <hr>
        <p><strong>Yapılandırılmış Veriler:</strong> ${data.structuredData}</p>
        <hr>
        <p><strong>404 Sayfası:</strong> ${data.notFound}</p>
        <hr>
        <p><strong>Font Boyutları:</strong> ${data.fontSizes.join(', ')}</p>
        <hr>
        <p><strong>Iframe Kullanımı:</strong> ${data.iframes}</p>
        <hr>
        <p><strong>Table Etiketi Kullanımı:</strong> ${data.tables}</p>
        <hr>
        <p><strong>AMP Kullanımı:</strong> ${data.amp}</p>
        <hr>
        <p><strong>Favicon Kullanımı:</strong> ${data.favicon}</p>
        <hr>
        <p><strong>Responsive Tasarım:</strong> ${data.responsive}</p>
        <hr>
        <p><strong>Mobil Uyumluluk:</strong> ${data.mobileFriendly}</p>
        <hr>
        <p><strong>ALT Etiketi Olmayan Resimler:</strong></p>
        <ul>
            ${data.imagesWithoutAlt.length > 0 ? data.imagesWithoutAlt.map(img => `<li>${img}</li>`).join('') : 'Tüm resimlerde ALT etiketi mevcut'}
        </ul>
        <hr>
        <p><strong>Title Etiketi Olmayan Linkler:</strong> <ul>
            ${data.linksWithoutTitle.length > 0 ? 
                data.linksWithoutTitle.map(link => `
                    <li>
                        <a>Link: ${link.url}</a> - Yazı: ${link.text}
                    </li>
                `).join('') : 
                '<li>Tüm linklerde Title etiketi mevcut</li>'
            }
        </ul></p>
    `;
}


