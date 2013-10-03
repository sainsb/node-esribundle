node-esribundle
===============

a node module for reading/serving ESRI bundled (compact) cache map services.

With the release of ArcGIS Server 10.0, ESRI released a new cache format, the [compact cache] (http://blogs.esri.com/esri/arcgis/2010/05/27/introducing-the-compact-cache-storage-format/ "compact cache blog post").
This new format makes it easier to transfer your caches around the network.

If you wish to use ArcGIS Server to cache map tiles in the compact format but wish to serve these tiles with something far, far simpler and probably more performant, here is a solution.

[Geodatabase Geek's demystification of the compact cache] (http://gdbgeek.wordpress.com/2012/08/09/demystifying-the-esri-compact-cache/) and the 'magic numbers' involved was obviously paramount to this mod.