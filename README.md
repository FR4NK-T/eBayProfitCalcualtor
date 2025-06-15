# eBay Profit Calculator Chrome Extension

📊 **Live Preview**: [ebaycalculator.netlify.app](https://ebaycalculator.netlify.app)  
💻 **Full Source Code**: [GitHub Repository](https://github.com/FR4NK-T/eBayProfitCalcualtor)

---

This is an open-source Chrome Extension built for eBay sellers who want to **quickly calculate net profit, ROI, and margin** with full visibility into fees and costs. The code is publicly available for anyone to use, learn from, or improve.

> 💡 Feel free to fork, clone, or build on this project — it's meant to help sellers grow smarter and faster.

## 💰 What It Does – Your Profit Powerhouse

This isn't just a calculator — it's a smart, intuitive Chrome extension designed to give eBay sellers a clear financial snapshot of their listings. It helps eliminate guesswork and make pricing decisions with confidence.

### ✨ Key Features
- 🔢 **Effortless Input**: Enter your Cost, Sale Price, Shipping Charged, Estimated Shipping Cost, and Ad/Promoted Listing Fee %. Your preferred ad fee is remembered across sessions.
- ⚡ **Real-Time Profit Metrics**: As you type, see live updates including:
  - **Net Profit**: What you actually take home
  - **ROI**: Return on investment relative to item cost
  - **Profit Margin**: Profit as % of sale price
- 📊 **Comprehensive Cost Breakdown**: Expandable "Total Cost" panel shows:
  - Item cost
  - Shipping cost
  - eBay Final Value Fee (FVF)
  - Fixed transaction fee
  - Ad fee
- 🌙 **Dark Mode**: Automatically adapts for comfortable night use
- ⚙️ **Customizable FVF Rate**: Edit eBay’s Final Value Fee % to reflect category-specific rates or promotions

---

## 🧠 How It Works – The Tech Behind the Tool

Built for speed, reliability, and precision using a modern tech stack:

- ⚛️ **React** – Dynamic UI with instant feedback
- 🟦 **TypeScript** – Strong typing for accuracy and reliability
- 🎨 **Tailwind CSS** – Fast, clean styling
- ⚡ **Vite** – Ultra-fast build tool for optimized performance
- 🧩 **Lucide React** – Crisp icons for clean visual cues
- 🧠 **Chrome Extension APIs** – Saves your ad fee % across sessions via `chrome.storage`

---

## 🎯 Accuracy: Built for Real-World Use

This calculator mirrors eBay's real fee structure:

- ✅ **Final Value Fee (FVF)**: % of (Sale Price + Shipping Charged)
- ✅ **Fixed Fee**: Flat $0.30 transaction fee (or category-specific)
- ✅ **Ad/Promoted Listing Fee**: % of (Sale Price + Shipping Charged), deducted post-sale

> 💡 *Note:* “Shipping Charged” is **revenue**, not a cost — but it's correctly included in the fee base calculation for FVF and Ad Fee.

---

## 🚀 Why It Matters

This tool empowers sellers to:
- Accurately forecast profits before listing
- Avoid surprise eBay deductions
- Optimize pricing and ad spend
- Confidently scale their business with better visibility

---

## 📸 Screenshots
<img width="399" alt="Screenshot 2025-06-15 at 4 28 30 AM" src="https://github.com/user-attachments/assets/6bda2162-f4b6-43f5-afa2-639fd4d48fc3" />
<img width="398" alt="Screenshot 2025-06-15 at 4 29 14 AM" src="https://github.com/user-attachments/assets/6e1b8f58-2bec-47b0-a09a-f3573cae16b5" />

---

👨‍💻 **Built by**: https://github.com/FR4NK-T  
