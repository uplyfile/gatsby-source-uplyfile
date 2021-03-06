const fetch = require("node-fetch")
const FormData = require('form-data');
const fs = require(`fs`)


const extToContentType = {
    bmp: "image/bmp",
    jp2: "image/jp2",
    jpeg: "image/jpeg",
    jpg: "image/jpeg",
    png: "image/png",
    tif: "image/tiff",
    tiff: "image/tiff",
    webp: "image/webp",
}


module.exports = async function onCreateNode({ node, actions, createNodeId, cache}) {
    const { createNode, createParentChildLink} = actions

    if (node.internal.type === 'File') {
        if (!extToContentType[node.extension]) {
            return
        }

        var uplyfileSeverListCache = await cache.get("gatsby-source-uplyfile-cache")

        if (!(node.internal.contentDigest in uplyfileSeverListCache)){

            let publicKey = await cache.get("gatsby-source-uplyfile-public-key")
            let expires = await cache.get("gatsby-source-uplyfile-expires")
            let uplySignature = await cache.get("gatsby-source-uplyfile-uply-signature")

            var file = fs.createReadStream(node.absolutePath);
            const stats = fs.statSync(node.absolutePath);
            const fileSizeInBytes = stats.size;
            const formData = new FormData()

            formData.append('image', file, {
                filename: node.base,
                contentType: extToContentType[node.extension],
                knownLength: fileSizeInBytes
            })

            response = await fetch(
                "https://uplycdn.com/api/v1/upload/",
                // "http://localhost:8001/api/v1/upload/",
                {
                    method: 'POST',
                    headers: {
                        "Uply-Public-Key": publicKey,
                        "Uply-Signature": uplySignature,
                        "Uply-Expires": expires,
                        ...formData.getHeaders(),
                    },
                    body: formData,
                }
            )
            if (response.status != 200) {
                if (response.status == 403) {
                    let error = await response.json()
                    console.log("ERROR:", error)
                    throw `Uplyfile files upload endpoint returned ${response.status}.`

                }
                throw `Uplyfile files upload endpoint returned ${response.status}.`
            }
            fileDetails = await response.json()

            uplyfileSeverListCache[node.internal.contentDigest] = fileDetails[0].url;

            await cache.set("gatsby-source-uplyfile-cache", uplyfileSeverListCache)
            console.log("Uploaded file to upyfile", node.internal.contentDigest)

        }

        const imageNode = {
            id: createNodeId(`${node.id} >> ImageUplyfile`),
            children: [],
            parent: node.id,
            internal: {
                contentDigest: `${node.internal.contentDigest}`,
                type: `ImageUplyfile`,
            },
        }
        createNode(imageNode)
        createParentChildLink({ parent: node, child: imageNode })
    }
}
