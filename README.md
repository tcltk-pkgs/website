# Tcl/Tk Packages Registry

A web interface to discover and search Tcl/Tk packages.

## Deploy

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/tcltk-pkgs/registry)

## Structure

- `index.html` + `style.css` + `script.js` - Web interface
- `packages.json` - Database of packages

## Adding a Package

Edit `packages.json`:

```json
{
  "name": "monpackage",
  "sources": [
    {
      "url": "https://github.com/user/monpackage",
      "method": "git",
      "web": "https://github.com/user/monpackage",
      "author": "user",
      "license": "MIT"
    }
  ],
  "tags": ["tcllib", "module", "category"],
  "description": "Description here"
}