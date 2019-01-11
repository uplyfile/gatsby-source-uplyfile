const {
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
