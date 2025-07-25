const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();

// Set folder
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

// Halaman utama
app.get("/", (req, res) => {
  res.render("index", {
    videoUrl: null,
    musicUrl: null,
    thumbnail: null,
    error: null,
  });
});

// Proses download
app.post("/download", async (req, res) => {
  const { url } = req.body;

  try {
    const apiUrl = `https://tikwm.com/api/?url=${encodeURIComponent(url)}`;
    const response = await axios.get(apiUrl);
    const data = response.data;

    if (data && data.data && data.data.play) {
      const videoUrl = data.data.play;
      const musicUrl = data.data.music;
      const thumbnail = data.data.cover;

      res.render("index", {
        videoUrl,
        musicUrl,
        thumbnail,
        error: null,
      });
    } else {
      res.render("index", {
        videoUrl: null,
        musicUrl: null,
        thumbnail: null,
        error: "❌ Video tidak ditemukan. Periksa link TikTok Anda.",
      });
    }
  } catch (err) {
    console.error(err.message);
    res.render("index", {
      videoUrl: null,
      musicUrl: null,
      thumbnail: null,
      error: "❌ Terjadi kesalahan saat menghubungi server atau API limit.",
    });
  }
});

// Jalankan server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`✅ Server berjalan di http://localhost:${PORT}`);
});
