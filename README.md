# Tcl/Tk Packages Registry

A web interface to discover and search Tcl/Tk packages.

[![Netlify Status](https://api.netlify.com/api/v1/badges/f5c22882-2780-48b6-8736-053823060d4a/deploy-status)](https://app.netlify.com/projects/tcltkpkgs/deploys)

## Adding a package :

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
```

## Credits

Developed with assistance from [Kimi](https://kimi.moonshot.cn) (Moonshot AI).