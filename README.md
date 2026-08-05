<div align="center">

# ⚡ CLOVOLT

**FASHION IS YOUR EVERYDAY ENERGY**

A responsive fashion editorial website built with HTML, CSS and JavaScript.

</div>

## About the Project

Clovolt is a modern front-end fashion blog created to bring fashion stories, practical styling guidance and curated outfits together in one accessible experience. Users can explore articles, discover complete looks, follow product hotspots and save their favorite content for later.

The project was developed as part of a front-end internship and focuses on responsive design, reusable components, dynamic content and clear user interaction without using a JavaScript framework.

## Main Features

- Responsive layout for desktop, tablet and mobile screens
- Reusable header and footer loaded dynamically across all pages
- Accessible navigation menu with keyboard support and active-page indication
- Automatic and manually controlled homepage carousel
- Daily rotating featured article and curated look
- Dynamic article and look cards loaded from JSON data
- Real-time search combined with category or style filters
- Load More and Show Less functionality for filtered results
- Individual article pages generated from URL parameters
- Detailed look pages with numbered product hotspots and external product links
- Separate article and look favorites stored in `localStorage`
- Favorites dashboard with collection totals and tab navigation
- Contact form with client-side validation and accessible error messages
- Loading, empty and error states for dynamically rendered content

## Pages

| Page | Description |
| --- | --- |
| **Home** | Introduces Clovolt through a hero carousel, latest stories, categories, a daily article and a featured look. |
| **Explore** | Displays all fashion articles with live search, category filters and expandable results. |
| **Article** | Renders the selected article, its metadata, complete content, favorite control and related stories. |
| **Shop the Look** | Presents curated outfits with live search, style filters, favorite controls and expandable results. |
| **Look Details** | Shows one complete outfit with interactive hotspots and links to its individual products. |
| **Favorites** | Organizes saved articles and looks in separate accessible tabs. |
| **About & Contact** | Explains the Clovolt concept and includes a validated contact form. |

## Technologies Used

- HTML5
- CSS3
- Vanilla JavaScript
- ES Modules
- Fetch API
- Web Storage API (`localStorage`)
- JSON
- Google Fonts
- Font Awesome

## Project Structure

```text
clovoltBlog/
├── components/          # Shared header and footer
├── css/                 # Global responsive stylesheet
├── data/                # Article and look data in JSON format
├── images/              # Hero, article, category, look and page images
├── js/                  # Page logic, rendering and shared favorites functions
├── index.html           # Home page
├── explore.html         # Article listing
├── article.html         # Article details
├── shop-the-look.html   # Look listing
├── look.html            # Look details
├── favorites.html       # Saved content
├── about-contact.html   # About and contact page
└── README.md
```

## Running the Project Locally

Because the project loads shared HTML components and JSON files with the Fetch API, it should be opened through a local web server.

1. Clone the repository:

   ```bash
   git clone https://github.com/EvaAleksi/clovoltBlog.git
   ```

2. Open the project folder:

   ```bash
   cd clovoltBlog
   ```

3. Start a local server. For example:

   ```bash
   python -m http.server 5500
   ```

4. Open `http://localhost:5500` in a browser.

You can also use the **Live Server** extension in Visual Studio Code.

## Data and Browser Storage

Article content is stored in `data/articles.json`, while outfits, products and hotspot positions are stored in `data/looks.json`. JavaScript loads these files and renders the interface dynamically.

Favorites are stored locally in the browser under separate keys for articles and looks. They remain available after a page refresh, but they are specific to the browser and device being used.

## Contact Form

The contact form demonstrates front-end validation and user feedback. It does not send messages to a server because the project does not include a back-end service.

## Accessibility and Responsive Design

Clovolt uses semantic HTML, descriptive alternative text, ARIA attributes, visible keyboard focus, accessible form feedback and keyboard-friendly navigation. Responsive breakpoints adapt the layout for desktop, tablet and mobile screens.

## Author

**Eva Aleksi**

Front-end internship project, 2026.