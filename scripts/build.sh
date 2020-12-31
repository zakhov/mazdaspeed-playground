#!/bin/bash
touch game/index.html

cat > game/index.html << EOF

<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <title>Panda Engine</title>
        <!-- build:js -->
        <script type="text/javascript" src="src/engine/core.js"></script>
        <script type="text/javascript" src="src/game/config.js"></script>
        <script type="text/javascript" src="src/game/main.js"></script>
        <!-- endbuild -->
        <link rel="apple-touch-icon" sizes="180x180" href="media/favicons/apple-touch-icon.png">
        <link rel="icon" type="image/png" sizes="32x32" href="media/favicons/favicon-32x32.png">
        <link rel="icon" type="image/png" sizes="16x16" href="media/favicons/favicon-16x16.png">
        <link rel="manifest" href="media/favicons/site.webmanifest">
    </head>
    <body></body>
</html>

EOF