const fetch = require("node-fetch")


module.exports = async ({ cache }, pluginOptions) => {
    await cache.set("gatsby-source-uplyfile-public-key", pluginOptions.publicKey)

    var uplyfileSeverListCache = await cache.get("gatsby-source-uplyfile-cache")


    if (uplyfileSeverListCache === undefined) {
        let response = await fetch(
            "https://uplycdn.com/api/v1/files/",
            // "http://localhost:8001/api/v1/files/",
            {
                headers: {
                    "Content-Type": "application/json",
                    "Uply-Public-Key": pluginOptions.publicKey,
                }
            }
        );
        let filesList = await response.json()

        etagToUrls = {}
        for (var i in filesList) {
            let file = filesList[i]
            etagToUrls[file.etag] = file.url
        }

        await cache.set("gatsby-source-uplyfile-cache", etagToUrls)

    }

}
