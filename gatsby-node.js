const fs = require(`fs-extra`)

exports.onPreBootstrap = require('./on-pre-bootstrap')
exports.onCreateNode = require(`./on-node-create`)
exports.setFieldsOnGraphQLNodeType = require(`./extend-node-type`)


exports.onPreExtractQueries = async ({ store, getNodesByType }) => {
  const program = store.getState().program

  // Check if there are any ImageUplyfile nodes. If so add fragments for ImageUplyfile.
  // The fragment will cause an error if there are no ImageUplyfile nodes.
  if (getNodesByType(`ImageUplyfile`).length == 0) {
    return
  }

  // We have ImageUplyfile nodes so let's add our fragments to .cache/fragments.
  await fs.copy(
    // require.resolve(`gatsby-source-uplyfile/fragments.js`),
    `plugins/gatsby-source-uplyfile/fragments.js`,
    `${program.directory}/.cache/fragments/image-uplyfile-fragments.js`
  )
}
