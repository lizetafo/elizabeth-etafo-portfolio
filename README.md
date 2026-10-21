# Elizabeth Etafo | Portfolio site

Plain HTML and CSS. No build step.

Pages: index.html (home), publications.html, experience.html, about.html, contact.html. Shared look lives in styles.css.

## Preview
Open `index.html` in a browser.

## Publish free on GitHub Pages
1. Create a repository named `YOUR-USERNAME.github.io` on GitHub.
2. Upload every file and the `assets` folder (including `.nojekyll`) to the repository root.
3. Repository Settings > Pages > Deploy from branch `main`, folder `/ (root)`.
4. Your site goes live at `https://YOUR-USERNAME.github.io`.

## Add your headshot (optional)
Save a portrait photo as `headshot.jpg` (`.JPG`, `.jpeg`, or `.png` also work) and put it in the `assets` folder. It appears on the right side of the home page automatically. Use a photo roughly 4:5 (portrait), at least 480 x 600 pixels. Until the file exists, nothing shows.

## Add or update your CV
Save your CV as `Elizabeth_Etafo_CV.pdf` (exact name, capital letters matter) and put it in the `assets` folder. The "Download CV" buttons on the Home and Contact pages then work. Until the file exists, the buttons are hidden on the live site.
To update it later, upload a new file with the same name to `assets` and replace the old one.

On GitHub: open the `assets` folder in your repository > Add file > Upload files > drag the file in > Commit changes. The site refreshes in a minute or two (press Ctrl+Shift+R or Cmd+Shift+R if you still see the old version).

## Edit text
Text lives in each .html file. Colors and fonts are variables at the top of `styles.css`.

## Turn on the message form (Contact page)
The "Send a message" box stays hidden until you connect a free Formspree form:
1. Create an account at formspree.io and make a new form. It gives you a form address like `https://formspree.io/f/abcdwxyz`.
2. On GitHub, open `contact.html`, click the pencil icon, and find `YOUR_FORM_ID`. Replace it with the letters after `/f/` in your address (for example `abcdwxyz`). Commit.
3. Send yourself a test message. Formspree may ask you to confirm your email first.
Check Formspree's current free-plan limits.

## Turn on the "Send a message" form (optional)
The form on the Let's connect page stays hidden until you connect it. Your email address is never written on the site.
1. Make a free account at formspree.io using the email where you want messages delivered, then create a new form.
2. Copy the form ID it gives you (the code at the end of the form address, like `abcdwxyz`).
3. On GitHub, open `contact.html`, click the pencil icon, find `YOUR_FORM_ID`, replace it with your code, and commit.
4. Wait a minute, refresh the Let's connect page, and send yourself a test message. Check your spam folder the first time.
Free plans have a monthly message limit, so check Formspree's current terms.

## Page not found
`404.html` is the page visitors see if they type a wrong address. GitHub Pages uses it automatically.

## Light and dark mode
The round button in the top menu switches between light and dark. The site remembers the choice on each visitor's device, and the first visit follows their phone or computer setting.

## Science background
`background.js` draws the drifting molecular network, ring molecules, and DNA helix behind every page. It pauses when the tab is hidden and shows a still image for visitors who prefer reduced motion. To remove it, delete the line that loads `background.js` from each page.

## Photos on the About page
Save up to three photos in the `assets` folder named `about-1.jpg` (the large one, landscape works best), `about-2.jpg`, and `about-3.jpg`. `.JPG`, `.jpeg`, `.png`, and `.webp` also work. They appear next to your text automatically. Any photo that is missing is skipped, and with no photos the text simply fills the page.
To add a caption, open `about.html`, find the matching `<figcaption></figcaption>`, and type between the tags, for example `<figcaption>Presenting at AAPS PharmSci 360, New Orleans</figcaption>`. The caption also becomes the photo's description for screen readers. Tip: resize photos to about 1600 pixels wide so the page loads fast.

## Logo
`assets/logo-mark-light.png` and `assets/logo-mark-dark.png` are the header logos (the site swaps them with light/dark mode). `favicon-32.png` and `apple-touch-icon.png` are the browser-tab and phone home-screen icons, and `preview.png` is the picture shown when your link is shared.
