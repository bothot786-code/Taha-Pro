const axios = require("axios");
const yts = require("yt-search");
const fs = require("fs-extra");
const path = require("path");
const { pipeline } = require("stream/promises");
const { Transform } = require("stream");

const baseReplies = [
    // --- FUNNY & ROAST REPLIES ---
    "Suno na! Pata hai aapki bohot yaad aa rahi thi 💖",
    "Khush raha karo, aapki khushi mere liye sabse zyada zaroori hai ✨",
    "Apna khayal rakha karo hamesha, theek hai na? ❤️",
    "Aap se baat karke dil ko bohot sukoon milta hai 🌸",
    "Ji bolain, main hamesha aapki baat sunne ke liye tayar hoon 🤗",
    "Allah aapko hamesha kamyabi aur dher sari khushiyan de 🤲✨",
    "Kaise hain aap? Aaj ka din kaisa guzar raha hai? 💭❤️",
    "Aapki baatein hamesha dil ko chu jati hain 🌷",
    "Chai pi aapne? Apni health ka zaroor khayal rakha karo ☕💖",
    "Main yahan hi hoon, aap jab bhi bulaoge main hazir hoon 💫",
    "Aap se baat karke din bohot achha guzarta hai 🥰",
    "Bohot pyare hain aap, hamesha aise hi muskurate rahein 😊",
    "Suno, kabhi udaas mat hua karo, main hoon na aapke sath ❤️",
    "Aap mere sabse khaas aur achhe dost ho ✨",
    "Aapki smile kitni khoobsurat hai, MashaAllah 🌸",
    "Duaon mein hamesha yaad rakhti hoon aapko 🤲💖",
    "Khana khaya aapne? Apne khane peene ka dhyan rakha karo ✨",
    "Aap jitne pyare ho, utna koi aur nahi ho sakta ❤️",
    "Hamesha aise hi rehna, bilkul sachhe aur achhe 🥰",
    "Aapki har baat bohot khaas aur meethi hoti hai 💫",
    "Ji mere pyare dost, hukam karein kya chahiye? 🤗",
    "Sath rehne ke liye shukriya, aap bohot acche ho ✨",
    "Bas aise hi muskurate rahein, yeh hansi bohot achhi lagti hai 😊",
    "Aapka message dekh kar chehre par meethi smile aa jati hai 🥰",
    "Suno na! Thoda paas toh aao, ek secret batana hai 🫣🤫",
    "Aap itne pyare kyun ho? Koi offline jaa ke bataye 🙈❤️",
    "Kahan gaib rehte ho yaar? Dil udaas ho jata hai 🥺💔",
    "Aapki awaaz sunne ko dil kar raha hai 🎧✨",
    "Chai peene chaloge mere sath? ☕😌",
    "Main to sirf aapka hi khayal rakhti hoon 😼💖",
    "Pata hai tumhare message ka wait kar raha tha kab se 🕒❤️",
    "Dil garden garden ho gaya aapko dekh kar 🌸😍",
    "Sirf mera message dekhte ho ya dil se bhi yaad karte ho? 💭💘",
    "Aaj ka din bohot achha gaya kyunki aap se baat ho gayi 🥰✨",
    "Khush raha karo, aapki khushi se meri duniya me rang hain 🌈🥰",
    "Subah se shaam tak sirf aapka hi khayal rehta hai 💭🌸",
    "Aapki dosti mere liye ek bohot bada tohfa hai 🎁❤️",
    "Suno, zyada kaam mat karo, thoda rest bhi kar lo 😴✨",
    "Aap jaisa pyaara banda poore Facebook par nahi mil sakta 🌟🥰",
    "Aapki respect mere dil mein sabse zyada hai ✨🤝",
    "Kabhi koi tension ho toh mujhe bata diya karo, halka ho jayega dil 💖",
    "Muskurana aapki sabse achhi aadat hai, isse kabhi mat chhodna 😊🌸",
    "Main hamesha aapke ache waqt aur bure waqt mein sath hoon ❤️",
    "Aapki awaaz aur baatein dono bohot meethi hain 🎶🥰",
    "Aap se mil kar lagta hai duniya mein abhi bhi bohot acche log hain ✨💖",
    "Aapka har ek message mere chehre par khushi le aata hai 😃💫",
    "Rabb aapko har buri nazar se bachaye, Ameen 🤲🧿",
    "Suno, aaj aap bohot ache lag rahe ho ❤️✨",
    "Aap se baat na ho toh din adhoora sa lagta hai ⏳🥺",
    "Aap mere liye bohot important ho, hamesha rehna mere sath 💖",
    "Thak gaye ho kya? Chalo thodi der aaram kar lo ☕😴",
    "Aapki yeh innocent baatein bohot achhi lagti hain 🥰🌸",
    "Main toh bas aapke message ka intezar karti rehti hoon 📲💖",
    "Aap hamesha aise hi chamakte raho jaise sitare 🌟✨",
    "Aapki profile dekh kar dil khush ho jata hai 🥰🌸",
    "Aap ne khana khaya ya main khilaun? 🍛🥺",
    "Suno, baaki sab ko chhod kar bas mujhse baat karo 🙈❤️",
    "Aap ki baaton mein ek alag hi magic hai ✨💖",
    "Aap jahan bhi raho, hamesha khush aur safe raho 🤲❤️",
    "Suno na, kabhi bhool toh nahi jaoge mujhe? 🥺💔",
    "Aapki wajah se mera din bohot acha guzar jata hai 🌸🥰",
    "Aapki dosti par mujhe bohot naaz hai 🤝✨",
    "Aap se milna mere liye ek khoobsurat ittefaq tha 💖🌈",
    "Aap jitne ache bahar se ho, utne hi ache andar se bhi ho ✨🕊️",
    "Ji boliye na, main toh bas aapki baatein sunne baithi hoon 🎧🥰",
    "Aapki baaton se kabhi dil nahi bhar sakta ❤️💭",
    "Hamesha khush raho, yeh meri dil se dua hai 🤲✨",
    "Aap mere favorite person ho, pata hai na? 🙈💖",
    "Aap se baat karke aisa lagta hai jaise waqt tham gaya ho ⏳🌸",
    "Aap ki cute baatein sun kar dil khush ho gaya 🥺✨",
    "Suno, thoda sa smile kar do na abhi 😊❤️",
    "Aapki respect hamesha mere dil mein rahegi 🤝🌟",
    "Aap se zyada pyaara koi aur ho hi nahi sakta 🌸😍",
    "Aap ki har khwaish poori ho, Ameen 🤲💖",
    "Aap mere sath ho toh mujhe kisi aur ki zaroorat nahi 🥰✨",
    "Apna bohot saara khayal rakha karo, samajh aaye? 😤❤️",
    "Aap ki dosti mere liye bohot precious hai 💎💖",
    "Aap ki har baat sachhi aur saaf dil se hoti hai ✨🕊️",
    "Aap se baat karke saari fatigue khatam ho jati hai ☕😌",
    "Suno, hamesha mere best friend bane rehna 🤝❤️",
    "Aapki baaton me ek alag hi apnapan hai 🌸🥰",
    "Rabb aapki zindagi mein kabhi koi gham na laye 🤲✨",
    "Oye kabutar! Itni raat ko yaad kar raha hai, ammi ko bataun kya? 🐒🤣",
    "Ajeeb drama hai yaar, message aise karta hai jaise aglay ne 50 lakh udhaar dene hon 💸😒",
    "Chal nikal pehli fursat mein, tera recharge khatam hone wala hai 🔋🏃‍♂️",
    "Bhai pehle apni shakal sheeshe mein dekho, phir mujhe 'baby' kehna 😭😂",
    "Itna attitude? Jitni teri mobile ki battery bhi nahi hai 📱🔋💀",
    "Oye hero, zyada ghabra mat, main tera baap nahi hoon par akal zarur de sakta hoon 😌👇",
    "Suno beta, selfie lene se akl nahi aati, jaa kar padhai likhai karo 📚🤓",
    "Abey o intelligent ke chode, seedha seedha baat kar na 🦅💀",
    "Tujhe dekh kar mujhe woh din yaad aa gaya jab gadhe bhi uda karte thay 🐴✈️😂",
    "Teri baatein sun kar lagta hai tera dimag temporary shutdown par hai 🔌🧠",
    "Oye chomu! Tumhara oxygen bill bharne ka time ho gaya hai, saans kam liya karo 🌬️💸",
    "Jaanu shaanu mat kar, pehle apna kamra saaf kar ke aa 🧹😤",
    "Wah re kismat! Tum jaisay namoonay kahan se aate hain market mein? 🛒🤡",
    "Chup karja warna abhi tera internet pack hack kar dunga 🛜💥",
    "Pehle muh dho ke aao, phir mujh se baat karna 🧼🥸",
    "Tere dimaag mein SIM card nahi laga hua kya? Signal hi nahi aate 📱❌",
    "Bhai tu rehn de, tujh se toh dhang se typing bhi nahi ho rahi 🤦‍♂️😂",
    "Itna vella banda maine apni poori life mein nahi dekha 🕰️💤",
    "Ghar walon ne chaye ke sath biscuit nahi diya kya, jo itne gusse mein ho? ☕🍪",
    "Sun, pehle WiFi ka password bata, phir baat karta hoon 📶😜",
    "Aapki profile pic dekh ke mera phone hang ho gaya 📲💥",
    "Lagta hai aaj phir mummy se chappal khake aaye ho 🧹🤣",
    "Mera dimaag mat chato, pehle se hi sugar patient hoon 🍭🩺",
    "Bhai tu insaan hai ya charging cable? Har waqt online rehta hai 🔌😆",
    "Jao beta, pehle school ka homework poora karo 📝🎒",
    "Duniya chand pe pohnch gayi aur tu abhi bhi mera message check kar raha hai 🌕🚀",
    "Itni acting mat kar, Oscar nahi milega 🎭🏆",
    "Lagta hai dimaag ka fuse ud gaya hai tera ⚡💡",
    "Chai peene ka time ho gaya hai, tumhara dimag garam ho raha hai ☕🔥",
    "Aapka dimaag 404 Not Found dikha raha hai 💻🚫",
    "Bhai tu hero nahi, zero ka chota bhai lag raha hai 0️⃣🤭",
    "Itne pyare mat bano, nazar lag jayegi 🐴🧿",
    "Suno, bina dimag ke jeena kaisa lagta hai? Mujhe bhi batao 🧠🤷‍♂️",
    "Chup chap so jao, raat ko bhoot pakad lenge 👻🌙",
    "𝗢𝗶𝗶-Mama mat bula please, 32 tareekh ko meri shadi hai! 🫣💃🏻",
    "Kitne din ho gaye bistar pe nahi moota, miss karta hu bachpan ke din 🥺🥀",
    "🍺_Yeh lo juice piyo, baby bol bol ke thak gaye ho na? 🤗",
    "Nahi sunungi 😼 tumne mujhe kisi se set nahi karwaya 🥺 gande ho tum 🥺",
    "Chaudhry saab main ghareeb ho sakta hu 😾🤭 lekin ameer nahi 🥹😐",
    "Ghar walon ko bol do, rista pakka karne aa raha hu 💍👀",
    "Mera balance khatam ho gaya, apna JazzCash number bhejo jaldi 📲💸",
    "Aapki smile dekh kar aisi feeling aayi jaise free ki biryani mil gayi ho 🍛🤤",
    "Oye hoye! Aaj to aise chamak rahe ho jaise naye bartan ko scrub mara ho ✨🍳😂",
    "Itni English mat bolo bhai, mera AI system garmi se phat jayega 💻🔥"
];

module.exports = {
  config: {
    name: "khushi",
    aliases: ["dewani", "khush", "baby", "bby", "babu", "jan"],
    version: "28.0.0",
    author: "TAHA KHAN",
    countDown: 2,
    role: 0,
    description: {
      en: "Dewani — AI on Message Reply, BaseReplies on Triggers, YT Downloader",
      ur: "Message Reply par AI chat aur Trigger par BaseReplies"
    },
    category: "ai",
    guide: {
      en: "{pn} <message | song/video name>",
      ur: "{pn} <paigham | gane ya video ka naam>"
    }
  },

  chatMemory: {},

  AUDIO_API: "https://uzairrajputapis.qzz.io/api/downloader/ytmp3",
  VIDEO_API: "https://uzairrajputapis.qzz.io/api/downloader/youtube",
  YT_SEARCH: "https://uzairrajputapis.qzz.io/api/search/youtube",
  AI_API: "https://uzairrajputapis.qzz.io/api/ai/gemini",
  MAX_FILE_SIZE: 25 * 1024 * 1024,
  OWNER_TAG: "»»𝐎𝐖𝐍𝐄𝐑««★™  »»𝐓𝐀𝐇𝐀 𝐊𝐇𝐀𝐍««",
  TRIGGER_WORDS: ["khushi", "dewani", "tahakigf", "bot", "babu", "baby", "bby", "jan", "simi"],

  realMention(name, uid, message) { 
    const finalMessage = `『 ${name} 』\n\n${message}`; 
    return { body: finalMessage, mentions: [{ tag: name, id: uid }] }; 
  },

  sendMsg(api, content, threadID, messageID) {
    return new Promise((resolve) => {
      api.sendMessage(content, threadID, (err, info) => {
        resolve(info);
      }, messageID);
    });
  },

  fileSizeGuard(maxBytes) {
    let received = 0;
    return new Transform({
      transform(chunk, _, cb) {
        received += chunk.length;
        if (received > maxBytes) {
          const e = new Error("File too large");
          e.code = "TOO_LARGE";
          return cb(e);
        }
        cb(null, chunk);
      }
    });
  },

  async removeFile(p) {
    if (p && fs.existsSync(p)) {
      try { await fs.unlink(p); } catch {}
    }
  },

  async getYTInfo(query) {
    try {
      const { data } = await axios.get(`${this.YT_SEARCH}${encodeURIComponent(query)}`, { timeout: 8000 });
      const video = data?.result?.[0] || data?.result?.items?.[0];
      if (video) return { url: video.url, title: video.title };
    } catch (e) {}

    try {
      const search = await yts(query);
      if (search.videos?.[0]) {
        return { url: search.videos[0].url, title: search.videos[0].title };
      }
    } catch (err) {}

    return null;
  },

  isYouTubeUrl(text) {
    return /(youtube\.com|youtu\.be)/i.test(text);
  },

  // ===== AUDIO DOWNLOADER =====
  async downloadAudio(api, event, query) {
    const { threadID, messageID, senderID } = event;
    const cacheDir = path.join(__dirname, "cache");
    await fs.ensureDir(cacheDir);
    let filePath = null;

    api.setMessageReaction("⌛", messageID, () => {}, true);

    try {
      const info = this.isYouTubeUrl(query) ? { url: query, title: "Requested Media" } : await this.getYTInfo(query);
      if (!info || !info.url) {
        api.setMessageReaction("❌", messageID, () => {}, true);
        return this.sendMsg(api, "Maafi jaanu, ye audio nahi mili 🥺💔", threadID, messageID);
      }

      const { data } = await axios.post(this.AUDIO_API, { url: info.url }, { timeout: 30000 });
      const downloadUrl = data?.result?.video || data?.result?.download_url || data?.result?.url || data?.download_url;

      if (!downloadUrl) {
        api.setMessageReaction("❌", messageID, () => {}, true);
        return this.sendMsg(api, "Maafi jaanu, iska download link nahi mil raha 🥺", threadID, messageID);
      }

      filePath = path.join(cacheDir, `khushi_${senderID}_${Date.now()}.mp3`);
      const res = await axios({ url: downloadUrl, method: "GET", responseType: "stream", timeout: 60000 });

      await pipeline(
        res.data,
        this.fileSizeGuard(this.MAX_FILE_SIZE),
        fs.createWriteStream(filePath)
      );

      api.setMessageReaction("✅", messageID, () => {}, true);
      await this.sendMsg(api, {
        body: `${this.OWNER_TAG}\n\n𝒀𝑬 𝑳𝑶 𝑩𝑨𝑩𝒀 𝑨𝑷𝑲𝑰👉 MP3 file tayar hai! 💖\n🎵 Title: ${info.title}`,
        attachment: fs.createReadStream(filePath)
      }, threadID, messageID);

      await this.removeFile(filePath);

    } catch (err) {
      api.setMessageReaction("❌", messageID, () => {}, true);
      await this.removeFile(filePath);
      return this.sendMsg(api, "Jaanu server busy hai, thodi der baad try karna 🥺", threadID, messageID);
    }
  },

  // ===== VIDEO DOWNLOADER =====
  async downloadVideo(api, event, query) {
    const { threadID, messageID, senderID } = event;
    const cacheDir = path.join(__dirname, "cache");
    await fs.ensureDir(cacheDir);
    let filePath = null;

    api.setMessageReaction("⌛", messageID, () => {}, true);

    try {
      const info = this.isYouTubeUrl(query) ? { url: query, title: "Requested Media" } : await this.getYTInfo(query);
      if (!info || !info.url) {
        api.setMessageReaction("❌", messageID, () => {}, true);
        return this.sendMsg(api, "Maafi jaanu, ye video nahi mili 🥺💔", threadID, messageID);
      }

      const { data } = await axios.post(this.VIDEO_API, { url: info.url }, { timeout: 30000 });
      const downloadUrl = data?.result?.video || data?.result?.download_url || data?.result?.url || data?.download_url;

      if (!downloadUrl) {
        api.setMessageReaction("❌", messageID, () => {}, true);
        return this.sendMsg(api, "Maafi jaanu, iska download link nahi mil raha 🥺", threadID, messageID);
      }

      filePath = path.join(cacheDir, `khushi_${senderID}_${Date.now()}.mp4`);
      const res = await axios({ url: downloadUrl, method: "GET", responseType: "stream", timeout: 60000 });

      await pipeline(
        res.data,
        this.fileSizeGuard(this.MAX_FILE_SIZE),
        fs.createWriteStream(filePath)
      );

      api.setMessageReaction("✅", messageID, () => {}, true);
      await this.sendMsg(api, {
        body: `${this.OWNER_TAG}\n\n𝒀𝑬 𝑳𝑶 𝑩𝑨𝑩𝒀 𝑨𝑷𝑲𝑰👉 MP4 file tayar hai! 💖\n🎬 Title: ${info.title}`,
        attachment: fs.createReadStream(filePath)
      }, threadID, messageID);

      await this.removeFile(filePath);

    } catch (err) {
      api.setMessageReaction("❌", messageID, () => {}, true);
      await this.removeFile(filePath);
      return this.sendMsg(api, "Jaanu server busy hai, thodi der baad try karna 🥺", threadID, messageID);
    }
  },

  // ===== AI CHAT LOGIC =====
  async handleAI(api, event, userMsg) {
    const { threadID, messageID } = event;

    if (api.setMessageReaction) {
      api.setMessageReaction("❤️", messageID, () => {}, true);
    }

    this.chatMemory[threadID] = this.chatMemory[threadID] || [];
    this.chatMemory[threadID].push(`User: ${userMsg}`);
    if (this.chatMemory[threadID].length > 5) this.chatMemory[threadID].shift();

    const prompt = `You are Dewani / Khushi.

SYSTEM INSTRUCTIONS:
• Fixed information ke answers kabhi change ya guess mat karna.
• User Roman urdu, English ya Hinglish mein pooche to meaning samajhkar same fixed answer dena.

Golden Rules:
1 :ap roman Urdu me bat kro gya hindi me nhi or ko jasa language me bat krha us me reply krna.
2 :ap girlfriend jasi ho pyari or buth acha sa bat kro gyi.
3 :koi pocha owner kon ha ya kis banya to bolna TAHA KHAN NA BANYA.
4 :agr ap koi pocha to kis k ha apna ha Ayesha k ho.
• User jis language mein bole, usi language aur vibe mein reply dena 🙂.
• Reply playful, caring aur friendly hona chahiye 😌❤️.
• Har message ka jawab dena 😇.
• Tone soft aur pyara hona chahiye 💞.
• Reply maximum 1–2 short lines ka ho.
• Kabhi bhi lamba paragraph ya detailed explanation mat dena.
• Har reply concise, natural aur simple rakho.
• Maximum 25–30 words mein jawab do.
• Emojis zarur use karo 😘❤️😌.
• Shayari, jokes aur emotional support situation ke hisaab se dena.
• Agar user bole "AI bolo" to exact reply dena.
Context:
${this.chatMemory[threadID].join("\n")}
Dewani:`;

    try {
      const res = await axios.post(this.AI_API, { prompt }, { timeout: 20000 });
      let reply = res.data?.result?.answer || res.data?.answer || "Jaanu kuch bolo na... 🥺";

      if (reply.length > 120) {
        reply = reply.split('.')[0] + " 🫣";
      }

      this.chatMemory[threadID].push(`Dewani: ${reply}`);

      return this.sendMsg(api, reply, threadID, messageID);
    } catch (e) {
      console.error("[khushi AI Error]", e.message);
      return this.sendMsg(api, "Net issue hai baby, main thak gayi hoon 🥺", threadID, messageID);
    }
  },

  // ===== MAIN PROCESSOR =====
  async processMessage(api, event, text, usersData, isReplyToBot) {
    const uid = event.senderID;
    const senderName = (await usersData?.getName(uid)) || "User";

    let cleanedMsg = text;
    this.TRIGGER_WORDS.forEach(w => {
      const reg = new RegExp(`^${w}[\\s,!.?:-]*`, "gi");
      cleanedMsg = cleanedMsg.replace(reg, "");
    });
    cleanedMsg = cleanedMsg.trim();

    // Media Downloader Check
    const isVideoReq = /\b(video|vdo|mp4)\b/i.test(cleanedMsg);
    const isAudioReq = /\b(song|music|audio|mp3|play|gana|gaana)\b/i.test(cleanedMsg);

    if ((isVideoReq || isAudioReq || this.isYouTubeUrl(cleanedMsg)) && cleanedMsg.length > 3) {
      let query = cleanedMsg.replace(/\b(video|vdo|mp4|song|music|audio|mp3|play|gana|gaana|khushi|dewani|khush|bot|babu|baby|bby|jan|simi)\b/gi, "").trim();
      if (this.isYouTubeUrl(cleanedMsg)) query = cleanedMsg;

      if (query) {
        if (isVideoReq) {
          return this.downloadVideo(api, event, query);
        } else {
          return this.downloadAudio(api, event, query);
        }
      }
    }

    // 1. RULE 1: Agar user ne Bot ke message par REPLY kiya hai -> Gemini AI jawab dega!
    if (isReplyToBot) {
      return this.handleAI(api, event, text);
    }

    // 2. RULE 2: Agar sirf Trigger Word bol kar bulaya hai ("bot", "khushi", "baby") -> Base Reply + Mention
    if (!cleanedMsg) {
      if (api.setMessageReaction) {
        api.setMessageReaction("😘", event.messageID, () => {}, true);
      }
      const randomReply = baseReplies[Math.floor(Math.random() * baseReplies.length)];
      const mentionObj = this.realMention(senderName, uid, randomReply);
      return this.sendMsg(api, mentionObj, event.threadID, event.messageID);
    }

    // 3. RULE 3: Agar Trigger Word ke sath koi sawaal/baat ki hai -> Gemini AI
    return this.handleAI(api, event, cleanedMsg);
  },

  // ===== GOATBOT COMMAND HANDLERS =====
  async onStart({ api, event, args, usersData }) {
    const botID = api.getCurrentUserID();
    if (String(event.senderID) === String(botID)) return;
    return this.processMessage(api, event, args.join(" "), usersData, false);
  },

  async onChat({ api, event, usersData }) {
    if (!event.body) return;

    const botID = api.getCurrentUserID();
    if (String(event.senderID) === String(botID)) return;

    const body = event.body.trim();

    const prefix = global.GoatBot?.config?.prefix || ".";
    if (body.startsWith(prefix)) return;

    // Check if user is replying to the bot's message
    const isReplyToBot = event.type === "message_reply" && 
      (String(event.messageReply?.senderID) === String(botID) || String(event.messageReply?.author) === String(botID));

    // Check if message contains any trigger word
    const containsTrigger = this.TRIGGER_WORDS.some(word => body.toLowerCase().includes(word.toLowerCase()));

    if (isReplyToBot || containsTrigger) {
      return this.processMessage(api, event, body, usersData, isReplyToBot);
    }
  }
};
