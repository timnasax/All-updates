# 🤖 ALL-UPDATES WHATSAPP BOT

<p align="center">
  <img src="https://img.shields.io/github/stars/timnasax/All-updates?style=for-the-badge&color=blue" alt="Stars">
  <img src="https://img.shields.io/github/forks/timnasax/All-updates?style=for-the-badge&color=purple" alt="Forks">
  <img src="https://img.shields.io/github/license/timnasax/All-updates?style=for-the-badge&color=green" alt="License">
</p>

---

## 🚀 Kuhusu (About)
**All-updates** ni WhatsApp bot ya kisasa, yenye kasi na nguvu iliyotengenezwa kwa kutumia Node.js na Baileys library. Bot hii imerahisishwa na kufanywa kuwa na muundo wa moja kwa moja (Direct Deployment) ili kurahisisha uwekaji (hosting) wake kwenye seva za wingu kama Heroku bila uhitaji wa hatua ngumu za uhakiki (verification).

---

## 🛠️ Jinsi ya Kudeploy kwenye Heroku (Deployment Guide)

Kuweka bot hii kwenye Heroku ni rahisi sana, bonyeza kitufe kilichopo hapa chini ili kuanza moja kwa moja:

### 1. Direct Deploy (One-Click)
Bonyeza kitufe hiki cha zambarau kudeploy sasa hivi:

[![Deploy to Heroku](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/timnasax/All-updates)

---

### 2. Hatua za Kufuata (Step-by-Step Setup)

Ikiwa unataka kufanya kila kitu kwa mikono yako au kupitia Heroku Dashboard, fuata hatua hizi:

1. **Fork Repository:** Fork repository hii kwenda kwenye akaunti yako ya GitHub.
2. **Tengeneza Session ID:** Hakikisha umepata `SESSION_ID` yako halali (kupitia QR au Pair Code) kabla ya kuanza.
3. **Fungua Heroku:** Nenda kwenye Heroku Dashboard yako na utengeneze App mpya.
4. **Unganisha GitHub:** Unganisha App yako ya Heroku na repository uliyofork ya `All-updates`.
5. **Config Vars (Mazingira/Environment Variables):**
   Nenda kwenye *Settings* -> *Reveal Config Vars* na uongeze variable muhimu zifuatazo:
   * `SESSION_ID` : (Weka session ID uliyopata)
   * `PREFIX` : (Mfano: `.` au `!`)
   * `OWNER_NAME` : `Timothy Timnasa`
6. **Deploy Branch:** Nenda kwenye sehemu ya *Deploy*, chagua branch ya `main` au `master`, kisha bonyeza **Deploy Branch**.
7. **Washa Dynos:** Baada ya build kukamilika, nenda kwenye tab ya *Resources* na uwashe (Turn on) `worker` au `web` dyno.

---

## 🔒 Usalama na Leseni (Security & License)

Kila code katika mfumo huu imelindwa na kufanywa kuwa salama. Mfumo huu umetengenezwa kwa malengo ya kielimu, ufanisi wa kazi, na ulinzi wa faragha.

© 2026 **Timothy Timnasa**. Haki zote zimehifadhiwa.
