# 🌌 Noteverse

Welcome to **Noteverse**, a beautifully crafted, dreamy night-themed note-taking web application. Built with a stunning glassmorphism UI, paper-cut landscapes, and smooth interactive animations, it serves as a magical canvas for your memories and thoughts.

## ✨ Features
*   **Dreamy UI**: Beautiful night landscape background built with SVG paper-cut styling and CSS animations.
*   **Glassmorphism Cards**: Premium frosted-glass styling for all UI components.
*   **Typewriter Welcome**: A sleek typewriter effect greets you upon arrival.
*   **Interactive Splash Cursor**: Fluid, colorful cursor trails.
*   **Motivational Quotes**: A rotating centerpiece of inspiring quotes from world leaders.
*   **Fully Functional Notes**:
    *   Add rich text notes and to-do lists.
    *   Pin important notes.
    *   Archive notes you want to save for later.
    *   Smooth carousel navigation.

## 🚀 Getting Started Locally
Since Noteverse is a purely static front-end application (HTML/CSS/JS), getting started is incredibly easy!

1. Clone the repository:
   ```bash
   git clone https://github.com/surbhiprasad555/noteverse.git
   ```
2. Open `index.html` directly in your web browser. 
   *(Alternatively, you can run a local server like `npx serve -l 3000` to serve the files).*

---

## ☁️ Deployment Instructions (AWS & Azure)
Because Noteverse consists solely of static files (`index.html` and `splashCursor.js`), **no code changes or build steps are required** for deployment! You can seamlessly deploy this to any static hosting provider.

### Option 1: Deploying to AWS (Amazon S3)
The easiest way to host a static site on AWS is via S3.
1. Log in to the AWS Console and navigate to **S3**.
2. Click **Create bucket**. Name it (e.g., `noteverse-app`), untick "Block all public access", and acknowledge the warning.
3. Once created, click on your bucket, go to the **Properties** tab, scroll to the bottom, and click **Edit** under **Static website hosting**. Select **Enable** and type `index.html` as the Index document.
4. Go to the **Permissions** tab, edit the **Bucket policy**, and add a public read policy (replace `YOUR_BUCKET_NAME` with your actual bucket name):
   ```json
   {
       "Version": "2012-10-17",
       "Statement": [
           {
               "Sid": "PublicReadGetObject",
               "Effect": "Allow",
               "Principal": "*",
               "Action": "s3:GetObject",
               "Resource": "arn:aws:s3:::YOUR_BUCKET_NAME/*"
           }
       ]
   }
   ```
5. Go to the **Objects** tab and upload `index.html` and `splashCursor.js`. 
6. Your site is live! You can find the URL in the *Properties* tab under *Static website hosting*. *(Optional: Hook it up to Amazon CloudFront for a custom domain and HTTPS).*

### Option 2: Deploying to Microsoft Azure (Azure Static Web Apps)
Azure Static Web Apps is perfect for this project and offers a free tier.
1. Ensure your latest code is pushed to GitHub.
2. Log in to the Azure Portal and search for **Static Web Apps**.
3. Click **Create**.
4. Fill out the details (Subscription, Resource Group, Name) and select the **Free** plan.
5. Under **Deployment details**, choose **GitHub** and authorize your account.
6. Select your organization, the `noteverse` repository, and the `main` branch.
7. Under **Build Details**, choose **Custom**. Leave the `App location` as `/` (root directory), and clear out the `Api location` and `Output location` (leave them completely blank, since there is no build step).
8. Click **Review + Create**, then **Create**. 
9. Azure will automatically create a GitHub Actions workflow in your repository and deploy the site. You'll get a generated URL once it finishes!
