# Salma Ben Hassine UGC Client Selector

## Publish the page

Upload the contents of this folder to your static hosting project. The public page is `index.html`.

## Connect Google Sheets

1. Create a new Google Sheet.
2. Go to `Extensions` > `Apps Script`.
3. Paste the contents of `google-apps-script.js`.
4. Optional: set `NOTIFY_EMAIL` to your email address.
5. Click `Deploy` > `New deployment`.
6. Choose type `Web app`.
7. Execute as: `Me`.
8. Who has access: `Anyone`.
9. Copy the Web app URL.
10. In `index.html`, replace:

```js
const SHEET_WEB_APP_URL = "";
```

with:

```js
const SHEET_WEB_APP_URL = "YOUR_WEB_APP_URL";
```

## Edit the prospect list

Inside `index.html`, update the `prospects` array. Each object controls one public card:

```js
{
  id: "unique-id",
  name: "Brand Name",
  category: "beauty",
  city: "Paris",
  format: "Product demo",
  budget: "Medium",
  score: 92,
  fit: "Why this brand is a strong UGC prospect.",
  angle: "Suggested content angle",
  audience: "Target audience",
  image: "https://..."
}
```

Valid categories are `beauty`, `fashion`, `wellness`, `food`, and `home`.
