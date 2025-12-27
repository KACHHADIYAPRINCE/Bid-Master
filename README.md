# 🚀 How to Publish BidMaster Online

Since you have already uploaded your code to GitHub, follow these steps to make your website live for everyone to see.

---

## Option 1: Using Vercel (Recommended & Easiest)
Vercel is the best platform for React applications. It provides a professional dashboard and makes connecting a custom URL very simple.

1.  **Sign Up**: Go to [Vercel.com](https://vercel.com) and sign up using your GitHub account.
2.  **Import Project**: 
    *   Click "Add New" -> "Project".
    *   Find your `BidMaster` repository and click **Import**.
3.  **Deploy**: 
    *   Leave the default settings as they are.
    *   Click **Deploy**. 
    *   In less than a minute, your site will be live at a URL like `bid-master.vercel.app`.

### 🔗 How to add a Custom URL (e.g., www.yourname.com)
1.  In your Vercel Dashboard, go to your project.
2.  Click **Settings** -> **Domains**.
3.  Type in the domain name you bought (from GoDaddy, Namecheap, etc.).
4.  Vercel will give you "DNS Records" (an A record or CNAME).
5.  Log in to your domain provider, paste those records into your DNS settings, and wait 30 minutes. **Done!**

---

## Option 2: Using GitHub Pages (Free)
If you want to host it directly on GitHub for free:

1.  **Open Repository**: Go to your repository on GitHub.
2.  **Settings**: Click the **Settings** tab at the top.
3.  **Pages**: Click **Pages** on the left sidebar.
4.  **Build and Deployment**: 
    *   Under "Source", ensure "Deploy from a branch" is selected.
    *   Select your `main` branch and the `/ (root)` folder.
    *   Click **Save**.
5.  **View Site**: After 2-3 minutes, GitHub will show a link at the top: `Your site is live at https://username.github.io/repo-name/`.

### 🔗 How to add a Custom URL on GitHub
1.  On the same **Pages** settings screen, scroll down to **Custom domain**.
2.  Type your domain (e.g., `bidmaster.com`) and click **Save**.
3.  GitHub will ask you to create a `CNAME` record at your domain provider.
4.  Follow the instructions GitHub provides to verify the domain.

---

## ⚠️ Important Note on Data
This application currently uses **LocalStorage** as a "Mock MongoDB". 
- **What this means**: When you host the site, the items one user lists will only be stored in *their* browser. 
- **For a real production site**: You would need a real MongoDB backend and a Node.js server. This current setup is perfect for **learning, showing in a portfolio, or a school project**, but it does not share data between different computers yet.

---

## 🛠️ Local Development
If you want to run this project on your own computer:
1.  Clone the repo: `git clone https://github.com/your-username/repo-name.git`
2.  Open the folder in VS Code.
3.  Install the "Live Server" extension.
4.  Right-click `index.html` and select **Open with Live Server**.
