const fetch = require("node-fetch")
const createSignature = require("./create-signature")


module.exports = async ({ cache }, pluginOptions) => {
    var now = new Date();
    var later = new Date();
    later.setHours(now.getHours() + 2);
    let expires = +later
    let uplySignature = createSignature(pluginOptions.secretKey, expires)

    await cache.set("gatsby-source-uplyfile-expires", expires)
    await cache.set("gatsby-source-uplyfile-uply-signature", uplySignature)
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
                    "Uply-Signature": uplySignature,
                    "Uply-Expires": expires,
                }
            }
        );
        if (response.status != 200) {
            if (response.status == 403) {
                let error = await response.json()
                console.log("ERROR:", error)
                throw `Uplyfile files list endpoint returned ${response.status}.`

            }
            throw `Uplyfile files list endpoint returned ${response.status}.`
        }
        let filesList = await response.json()

        etagToUrls = {}
        for (var i in filesList) {
            let file = filesList[i]
            etagToUrls[file.etag] = file.url
        }

        await cache.set("gatsby-source-uplyfile-cache", etagToUrls)

    }

}
