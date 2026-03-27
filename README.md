# Local Decap CMS Check

This project uses Decap CMS at `/admin/` with a `news` collection.

## Config consistency

- `backend.name` is `github` with:
  - `repo: noi-tatsuzaki/portfolio`
  - `branch: main`
- `local_backend: true` is enabled.
- With this setup, Decap uses the local proxy server in local testing, and the GitHub backend settings remain ready for production.

## Local test steps (without production GitHub login)

1. Start a static server for this repository root.
   - Example:
     - `python -m http.server 8080`
     - Then open `http://localhost:8080/`
2. Start the Decap local proxy server in another terminal.
   - Example:
     - `npx decap-server`
   - Default proxy endpoint is `http://localhost:8081/api/v1`.
3. Open the CMS UI:
   - `http://localhost:8080/admin/`
4. In Decap CMS, create a new entry in the `News` collection and click **Publish**.

## Where markdown is saved

The `news` collection is configured as:

- `folder: content/news`
- `slug: {{year}}-{{month}}-{{day}}-{{slug}}`

So creating one article saves a markdown file here:

- `content/news/<year>-<month>-<day>-<slug>.md`

Example:

- `content/news/2026-03-26-my-first-post.md`

The file is saved with front matter fields:

- `title`
- `date`
- `category`
- `thumbnail`
- `summary`
- and markdown `body`
