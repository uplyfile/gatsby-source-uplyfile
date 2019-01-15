const fetch = require("node-fetch")

const {
    GraphQLBoolean,
    GraphQLFloat,
    GraphQLInt,
    GraphQLObjectType,
    GraphQLString,
} = require(`gatsby/graphql`)

function toArray(buf) {
    var arr = new Array(buf.length)

    for (var i = 0; i < buf.length; i++) {
        arr[i] = buf[i]
    }

    return arr
}


var UrlType = new GraphQLObjectType({
    name: 'url',
    fields: {
        base: {
            type: GraphQLString,
        },
        full: {
            type: GraphQLString,
        },
        name: {
            type: GraphQLString,
        },
        operational: {
            type: GraphQLString,
        },
    }
});

module.exports = ({ type, cache }) => {
    if (type.name === `ImageUplyfile`) {
        return {
            url: {
                type: UrlType,
                resolve: async (url) => {
                    var uplyfileSeverListCache = await cache.get("gatsby-source-uplyfile-cache")
                    return uplyfileSeverListCache[url.internal.contentDigest];
                }
            },
            operations: {
                type: GraphQLString,
                args: {
                    value: {
                        type: GraphQLString,
                        defaultValue: null
                    }
                },
                resolve: async (node, fieldArgs, context) => {
                    var uplyfileSeverListCache = await cache.get("gatsby-source-uplyfile-cache")
                    let url = uplyfileSeverListCache[node.internal.contentDigest];
                    fieldArgs.value === null

                    if (fieldArgs.value === null){
                        return url.full
                    }

                    return `${url.base}/${fieldArgs.value}/${url.name}`
                }
            },
            fixed: {
                type: new GraphQLObjectType({
                    name: "ImageUplyfileFixed",
                    fields: {
                        aspectRatio: { type: GraphQLFloat },
                        width: { type: GraphQLFloat },
                        height: { type: GraphQLFloat },
                        src: { type: GraphQLString },
                        srcSet: { type: GraphQLString },
                        srcWebp: { type: GraphQLString },
                        srcSetWebp: { type: GraphQLString },
                        originalName: { type: GraphQLString },
                    }
                }),
                args: {
                    width: {
                        type: GraphQLInt,
                    },
                    height: {
                        type: GraphQLInt,
                    },
                    jpegProgressive: {
                        type: GraphQLBoolean,
                        defaultValue: true,
                    },
                    grayscale: {
                        type: GraphQLBoolean,
                        defaultValue: false,
                    },
                    quality: {
                        type: GraphQLInt,
                        defaultValue: null,
                    },
                    rotate: {
                        type: GraphQLInt,
                        defaultValue: 0,
                    },
                },
                resolve: async (node, fieldArgs, context) => {
                    var uplyfileSeverListCache = await cache.get("gatsby-source-uplyfile-cache")
                    let url = uplyfileSeverListCache[node.internal.contentDigest];

                    var width = fieldArgs.width
                    var height = fieldArgs.height

                    var splited = url.name.split('.')
                    var basename = splited[0]
                    var extension = splited[1].toLowerCase()

                    var aspectRatio = width / height

                    var operations = ''
                    if (fieldArgs.jpegProgressive && (extension == 'jpeg' || extension == 'jpg')) {
                        operations += ',progressive'
                    }
                    if (fieldArgs.grayscale) {
                        operations += ',bw'
                    }
                    if (fieldArgs.quality) {
                        var quality = fieldArgs.quality
                        if (quality <= 0){
                            quality = 1
                        }
                        else if (quality > 100) {
                            quality = 100
                        }
                        operations += `,quality:${quality}`
                    }
                    if (fieldArgs.rotate) {
                        operations += `,rotate:${fieldArgs.rotate}`
                    }

                    if (operations != '') {
                        var srcWebp = `${url.base}/${operations.slice(1)}/${basename}.webp`
                        var src = `${url.base}/${operations.slice(1)}/${url.name}`
                    } else {
                        var srcWebp = `${url.base}/${basename}.webp`
                        var src = `${url.base}/${url.name}`
                    }
                    var srcSet = `${url.base}/resize:w${width}${operations}/${url.name}, ${url.base}/resize:w${Math.round(width * 1.5)}${operations}/${url.name} 1.5x, ${url.base}/resize:w${Math.round(width * 2)}${operations}/${url.name} 2x`
                    var srcSetWebp = `${url.base}/resize:w${width}${operations}/${basename}.webp, ${url.base}/resize:w${Math.round(width * 1.5)}${operations}/${basename}.webp 1.5x, ${url.base}/resize:w${Math.round(width * 2)}${operations}/${basename}.webp 2x`
                    var originalName = url.name

                    return {
                        aspectRatio,
                        width,
                        height,
                        src,
                        srcSet,
                        srcWebp,
                        srcSetWebp,
                        originalName,
                    }
                }
            },
            resize: {
                type: GraphQLString,
                args: {
                    width: {
                        type: GraphQLInt,
                        defaultValue: -1,
                    },
                    height: {
                        type: GraphQLInt,
                        defaultValue: -1,
                    },
                },
                resolve: async (node, fieldArgs, context) => {
                    var uplyfileSeverListCache = await cache.get("gatsby-source-uplyfile-cache")
                    let url = uplyfileSeverListCache[node.internal.contentDigest];

                    var operation = "resize:"
                    if (fieldArgs.width == -1 && fieldArgs.height == -1) {
                        return url.full
                    }

                    if (fieldArgs.width != -1 && fieldArgs.height == -1) {
                        operation += 'h' + fieldArgs.height
                    } else if (fieldArgs.height != -1 && fieldArgs.width == -1) {
                        operation += 'w' + fieldArgs.width
                    } else {
                        operation += fieldArgs.width + ':' + fieldArgs.height
                    }
                    return `${url.base}/${operation}/${url.name}`
                }
            },
            blur: {
                type: GraphQLString,
                args: {
                    value: {
                        type: GraphQLInt,
                        defaultValue: -1,
                    },
                },
                resolve: async (node, fieldArgs, context) => {
                    var uplyfileSeverListCache = await cache.get("gatsby-source-uplyfile-cache")
                    let url = uplyfileSeverListCache[node.internal.contentDigest];

                    var operation = "blur"
                    if (fieldArgs.value != -1) {
                        operation += ':' + fieldArgs.value
                    }
                    return `${url.base}/${operation}/${url.name}`
                }
            }
        }
    }

    return {}
}
