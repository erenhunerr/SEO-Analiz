const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
const cheerio = require("cheerio");
const path = require("path");

const app = express();
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public"))); // Statik dosyaları sunma

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.post("/api/seo", async (req, res) => {
  const { url } = req.body;
  try {
    const response = await axios.get(url);
    const html = response.data;
    const $ = cheerio.load(html);

    // Meta etiketler
    const title = $("title").text();
    const description = $('meta[name="description"]').attr("content") || "";
    const keywords = $('meta[name="keywords"]').attr("content")
      ? $('meta[name="keywords"]').attr("content").split(",")
      : [];
    const author =
      $('meta[name="author"]').attr("content") || "Meta Author Etiketi eksik";
    const robots =
      $('meta[name="robots"]').attr("content") || "Meta Robots Etiketi eksik";
    const publisher =
      $('meta[name="publisher"]').attr("content") ||
      "Meta Publisher Etiketi eksik";
    const charset =
      $("meta[charset]").attr("charset") || "Meta Charset Etiketi eksik";
    const twitterCard =
      $('meta[name="twitter:card"]').attr("content") ||
      "Twitter Card Meta Etiketi eksik";
    const ogTitle =
      $('meta[property="og:title"]').attr("content") ||
      "Facebook Open Graph Etiketi eksik";
    const canonical =
      $('link[rel="canonical"]').attr("href") || "Canonical Etiketi eksik";
    const language = $("html").attr("lang") || "Dil Etiketi eksik";

    // Heading etiket yapısı
    const headings = {
      h1: $("h1").length,
      h2: $("h2").length,
      h3: $("h3").length,
      h4: $("h4").length,
      h5: $("h5").length,
      h6: $("h6").length,
    };

    // Dış linkler
    const externalLinks = [];
    $("a").each((index, element) => {
      const href = $(element).attr("href");
      if (href && href.startsWith("http") && !href.includes(url)) {
        externalLinks.push(href);
      }
    });

    // Yapılandırılmış veri
    const structuredData =
      $('script[type="application/ld+json"]').html() ||
      "Yapılandırılmış Veri yok";

    // 404 sayfası kontrolü
    const notFound =
      response.status === 404 ? "404 Sayfası mevcut" : "404 Sayfası yok";

    // Font boyutları
    const fontSizes = [];
    $("*").each((index, element) => {
      const fontSize = $(element).css("font-size");
      if (fontSize) {
        fontSizes.push(fontSize);
      }
    });

    // Iframe kullanımı
    const iframes =
      $("iframe").length > 0 ? "Iframe Kullanılıyor" : "Iframe Kullanılmıyor";

    // Table etiketi kullanımı
    const tables =
      $("table").length > 0
        ? "Table Etiketi Kullanılıyor"
        : "Table Etiketi Kullanılmıyor";

    // Hızlandırılmış Mobil Sayfalar (AMP)
    const amp =
      $("html[amp]").length > 0 ? "AMP Kullanılıyor" : "AMP Kullanılmıyor";

    // Favicon kullanımı
    const favicon =
      $('link[rel="icon"]').attr("href") || "Favicon Kullanılmıyor";

    // Responsive tasarım kontrolü
    const responsive = $('meta[name="viewport"]').attr("content")
      ? "Responsive Tasarım Var"
      : "Responsive Tasarım Yok";

    // Mobil uyumluluk
    // Mobil uyumluluk
    const mobileFriendlyMetaTag = $('meta[name="viewport"]').attr("content");
    const mobileFriendlyWebAppCapable = $(
      'meta[name="mobile-web-app-capable"]'
    ).attr("content");
    const mobileFriendly =
      mobileFriendlyMetaTag || mobileFriendlyWebAppCapable === "yes"
        ? "Mobil Uyumluluk Var"
        : "Mobil Uyumluluk Yok";

    // ALT etiketi olmayan resimler
    const imagesWithoutAlt = [];
    $("img").each((index, element) => {
      const alt = $(element).attr("alt");
      // Lazyload kullanan resimleri kontrol et
      if (!alt && $(element).hasClass("lazy")) {
        const dataSrc = $(element).attr("data-src") || $(element).attr("src");
        if (dataSrc) {
          const fileName = getFileNameFromUrl(dataSrc);
          imagesWithoutAlt.push(fileName);
        }
      }
    });

    function getFileNameFromUrl(url) {
      const pathname = new URL(url).pathname;
      return pathname.split("/").pop(); // Son kısımdaki dosya adını döndür
    }

    // Title etiketi olmayan linkler
    const linksWithoutTitle = [];
    $("a").each((index, element) => {
      const title = $(element).attr("title");
      if (!title) {
        const url = $(element).attr("href");
        const text = $(element).text().trim(); // Linkin içeriğini al, boşlukları kaldır
        linksWithoutTitle.push({ url, text });
      }
    });

    // Anahtar kelime analizi (basit frekans analizi)
    const textContent = $("body").text().replace(/\s+/g, " ").toLowerCase();
    const words = textContent.match(/\b(\w+)\b/g);
    const wordFreq = {};
    words.forEach((word) => {
      wordFreq[word] = (wordFreq[word] || 0) + 1;
    });

    const analysis = {
      title: title || "Meta Title Etiketi eksik",
      description: description || "Meta Description Etiketi eksik",
      keywords:
        keywords.length > 0 ? keywords : "Meta Keyword Etiketi kullanılmamış",
      author,
      robots,
      publisher,
      charset,
      twitterCard,
      ogTitle,
      canonical,
      language,
      headings,
      externalLinks,
      structuredData,
      notFound,
      fontSizes: [...new Set(fontSizes)],
      iframes,
      tables,
      amp,
      favicon,
      responsive,
      mobileFriendly,
      imagesWithoutAlt,
      linksWithoutTitle,
      wordFreq,
    };

    res.json(analysis);
  } catch (error) {
    res.status(500).json({ error: "Bir hata oluştu" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Sunucu ${PORT} portunda çalışıyor`);
});
