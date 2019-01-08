const supportedExtensions = {
    bmp: true,
    jp2: true,
    jpeg: true,
    jpg: true,
    png: true,
    tif: true,
    tiff: true,
    webp: true,
}

module.exports = async function onCreateNode({ node, actions, createNodeId }) {
    const { createNode, createParentChildLink} = actions

    if (node.internal.type === 'File') {
        if (!supportedExtensions[node.extension]) {
            return
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
