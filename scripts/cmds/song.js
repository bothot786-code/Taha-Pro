const axios = require("axios");
const fs = require("fs");
const path = require("path");

// ===== OWNER NAME =====
const ownerName = "𝐓𝐀𝐇𝐀 𝐊𝐇𝐀𝐍";

module.exports = {
  config: {
    name: "song",
    version: "3.0",
    author: "𝐓𝐀𝐇𝐀 𝐊𝐇𝐀𝐍",
    countDown: 10,
    role: 0,
    shortDescription: "YouTube song audio ya video download karein",
    longDescription: "Song ka naam likhein, MP3 ya MP4 download karein",
    category: "media",
    guide: {
      en: "{pn} <song name>  - Audio (MP3)\n{pn} video <song name> - Video (MP4)"
    }
  },

  onStart: async function ({ message, args, event, api }) {
    let type = "audio";
    let query = args.join(" ");

    // Check: Kya user ne "video" likha hai?
    if (args[0] && args[0].toLowerCase() === "video") {
      type = "video";
      query = args.slice(1).join(" ");
    }

    // 👑 Owner Tag
    const ownerTag = `╔══════════════════╗\n   👑 𝐎𝐖𝐍𝐄𝐑: 𝐓𝐀𝐇𝐀 𝐊𝐇𝐀𝐍 👑\n╚══════════════════╝\n━━━━━━━━━━━━━━━━━━━━`;

    if (!query) {
      return message.reply(
        `${ownerTag}\n❌ Naam likhein!\n\n📌 Audio: !song Tum Hi Ho\n📌 Video: !song video Tum Hi Ho`
      );
    }

    const waitMsg = await message.reply(`${ownerTag}\n⏳ 𝐃𝐡𝐨𝐨𝐧𝐝 𝐑𝐚𝐡𝐚 𝐇𝐨𝐨𝐧... 𝐓𝐡𝐨𝐝𝐚 𝐈𝐧𝐭𝐞𝐳𝐚𝐫 🎧`);

    try {
      let videoUrl = query;
      let videoData = null;

      // 1. YouTube Search (Agar URL nahi hai)
      if (!query.startsWith("http")) {
        console.log("Searching YouTube for:", query);
        const searchRes = await axios.get(
          `https://uzairrajputapis.qzz.io/api/search/youtube?q=${encodeURIComponent(query)}`
        );
        
        const results = searchRes.data?.result || searchRes.data;
        if (!results || results.length === 0) {
          return message.reply(`${ownerTag}\n❌ YouTube par kuch nahi mila.`);
        }
        
        const first = results[0];
        const videoId = first.videoId || first.id;
        videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
        videoData = first;
      }

      console.log("Video URL:", videoUrl);

      // 2. Video Info lo
      if (!videoData) {
        const videoRes = await axios.post(
          `https://uzairrajputapis.qzz.io/api/downloader/youtube`,
          { url: videoUrl },
          { timeout: 15000 }
        );
        videoData = videoRes.data;
      }

      if (!videoData || videoData.error) {
        return message.reply(`${ownerTag}\n❌ Video ki maloomat nahi mil sakin.`);
      }

      let downloadUrl, fileExt, fileType;

      // 3. Download Link lo (Audio ya Video)
      if (type === "video") {
        console.log("Fetching VIDEO link...");
        const vidRes = await axios.post(
          `https://uzairrajputapis.qzz.io/api/downloader/youtube`,
          { url: videoUrl },
          { timeout: 20000 }
        );
        
        const vidData = vidRes.data;
        console.log("Video API Response:", JSON.stringify(vidData).slice(0, 200));
        
        downloadUrl = vidData?.video || vidData?.downloadUrl || vidData?.url || vidData?.link || vidData?.result?.video_url || vidData?.result?.url || vidData?.result?.download_url;
        fileExt = ".mp4";
        fileType = "video";
      } else {
        console.log("Fetching AUDIO link...");
        const mp3Res = await axios.post(
          `https://uzairrajputapis.qzz.io/api/downloader/ytmp3`,
          { url: videoUrl },
          { timeout: 20000 }
        );
        
        const mp3Data = mp3Res.data;
        downloadUrl = mp3Data?.audio || mp3Data?.downloadUrl || mp3Data?.url || mp3Data?.link || mp3Data?.result?.download_url || mp3Data?.result?.url;
        fileExt = ".mp3";
        fileType = "audio";
      }

      if (!downloadUrl) {
        return message.reply(`${ownerTag}\n❌ Download link nahi mila. API Response check karein.`);
      }

      console.log("Download URL:", downloadUrl);

      // 4. File Download karo
      const cacheDir = path.join(__dirname, "cache");
      if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir, { recursive: true });

      const filePath = path.join(cacheDir, `taha_${type}_${Date.now()}${fileExt}`);

      const response = await axios({
        method: "GET",
        url: downloadUrl,
        responseType: "stream",
        headers: { "User-Agent": "Mozilla/5.0" },
        timeout: 120000 // 2 minutes
      });

      const writer = fs.createWriteStream(filePath);
      response.data.pipe(writer);

      await new Promise((resolve, reject) => {
        writer.on("finish", resolve);
        writer.on("error", reject);
      });

      // 5. Size Check
      const stats = fs.statSync(filePath);
      const fileSizeInMB = stats.size / (1024 * 1024);

      if (fileSizeInMB > 25) {
        fs.unlinkSync(filePath);
        return message.reply(
          `${ownerTag}\n⚠️ File 25MB se zyada hai (${fileSizeInMB.toFixed(2)}MB).\n\n📥 𝐋𝐢𝐧𝐤:\n${downloadUrl}`
        );
      }

      // 6. File Bhejo
      const title = videoData.title || videoData.result?.title || "Unknown Title";
      const channel = videoData.channel || videoData.author || videoData.result?.channel || "N/A";

      let caption = `${ownerTag}\n\n🎵 ${title}\n\n`;
      caption += `┌─────────────────\n`;
      caption += `│ 👤 Channel: ${channel}\n`;
      caption += `│ 📁 Type: ${fileType.toUpperCase()}\n`;
      caption += `└─────────────────\n\n`;
      caption += `📥 𝐘𝐞𝐡 𝐋𝐨 𝐀𝐩𝐤𝐚 ${fileType === "video" ? "𝐕𝐢𝐝𝐞𝐨" : "𝐒𝐨𝐧𝐠"} 🎧\n\n`;
      caption += `━━━━━━━━━━━━━━━━━━━━\n👑 𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲: 𝐓𝐀𝐇𝐀 𝐊𝐇𝐀𝐍`;

      await message.reply({
        body: caption,
        attachment: fs.createReadStream(filePath)
      });

      // 7. Delete
      setTimeout(() => {
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      }, 5000);

    } catch (error) {
      console.error("❌ TAHA KHAN Song Error:", error.message);
      return message.reply(
        `${ownerTag}\n⚠️ Error aya hai: ${error.message}\n\nBaraye meharbani bot ke terminal mein check karein.`
      );
    }
  }
};
