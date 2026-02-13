# Tcl/Tk Packages Registry

A web interface to discover and search Tcl/Tk packages.

[![Netlify Status](https://api.netlify.com/api/v1/badges/f5c22882-2780-48b6-8736-053823060d4a/deploy-status)](https://app.netlify.com/projects/tcltkpkgs/deploys)

## Adding a package :

Submit a PR with your package information. Simply add an entry to the `packages.json` file following this format:

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
> [!NOTE]  
> `method` can be `git`, or `fossil` for now. The `web` field is optional and points to documentation if different from the repository `URL`.

## Credits

Developed with assistance from [Kimi](https://kimi.moonshot.cn) (Moonshot AI).