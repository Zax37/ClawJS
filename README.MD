# ClawJS

Partially or fully reimplemented functionalities from Claw game into node.js server.
Contains modularized features like map loading, game logics etc.
It is also planned that in future it will become a fully working game reimplementation,
served to play in browser on any device, possibly with several multiplayer modes.

## Preparations

### Resources

**Note:** I'm currently working on full pipeline for resources processing.
For now, if you're interested in participating, please contact me first
and I'll help getting them ready.

--- 

First, you need to prepare all your resources to be served. Steps I took:

- get the original Claw resources
- convert pids to pngs with REZExtractor
- create 64x64 all-white image 4008636142.png
- pack each tileset with TexturePacker and tools/json-names-array extension
    - JSON file: resources/tilesets/L1_ACTION.json
    - Algorithm: Basic, uncheck "Detect identical sprites"
    - Trim mode: None, Extrude: 1
    - including extra tile 4008636142.png
- copy wwd files to resources/maps/RETAIL1.WWD ... RETAIL14.WWD
- copy palettes to resources/palettes/LEVEL1.PAL ... LEVEL14.PAL
- run script tools/process-resources.js

### Building and running

Build and run the project in dev environment:

```
npm run dev
```

It restarts automatically after each code change.

See the results locally: http://localhost:8080/

To make a production build:

```
npm run build
```

To serve a ready production build on node server:

```
node .
```

See the results locally: http://localhost:3000/

### Deploying

I'm currently using netlify for hosting the application.
CI/CD is probably not an option until I finish the resources pipeline, so I use
manual deploy, **after doing production build**:

```
netlify deploy -p
```