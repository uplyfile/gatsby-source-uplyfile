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
            resolve: (source, fieldArgs) => {
                return "https://uplycdn.com/JxXkT0/brwNBf0xNjvb"
            }
        },
        full: {
            type: GraphQLString,
            resolve: (source, fieldArgs) => {
                return "https://uplycdn.com/JxXkT0/brwNBf0xNjvb/bmw-i8-coupe-home-sp-xxl.jpg"
            }
        },
        name: {
            type: GraphQLString,
            resolve: (source, fieldArgs) => {
                return "bmw-i8-coupe-home-sp-xxl.jpg"
            }
        },
        operational: {
            type: GraphQLString,
            resolve: (source, fieldArgs) => {
                return "https://uplycdn.com/JxXkT0/brwNBf0xNjvb/"
            }
        },
    }
});

module.exports = ({ type }) => {
    if (type.name === `ImageUplyfile`) {
        return {
            url: {
                type: UrlType,
                resolve: (url) => {
                    return ''
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
                resolve: (node, fieldArgs, context) => {
                    console.log("typeof node", typeof(node))
                    console.log("NODE", node)

                    return 'lol'
                    // var operation = "resize:"
                    // if (fieldArgs.width != -1 && fieldArgs.height != -1) {
                    //     return image.url.full
                    // }

                    // if (fieldArgs.width != -1) {
                    //     operation += 'h' + fieldArgs.height
                    // } else if (fieldArgs.height != -1) {
                    //     operation += 'w' + fieldArgs.width
                    // } else {
                    //     operation += fieldArgs.width + ':' + fieldArgs.height
                    // }
                    // return `${image.url.base}/${operation}/${image.url.name}`
                }
            }
        }
    }

    // by default return empty object
    return {}
}
