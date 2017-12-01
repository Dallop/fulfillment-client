module.exports = {
  dev: function (data) {
    return `
    <!doctype html>

    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Boostly</title>
      </head>
      <body>
        <div id='root'/>
        <script src="./${data.main}"></script>
      </body>
    </html>
    `
  },
  prod: function (data) {
    return `
    <!doctype html>

    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Boostly</title>
        <link rel="stylesheet" href="./${data.css}" />
      </head>
      <body>
        <div id='root'/>
        <script src="./${data.main}"></script>
      </body>
    </html>
    `
  }
}
