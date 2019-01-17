/* eslint-disable */
import { graphql } from "gatsby"

export const gatsbyImageUplyfileFixedPreferWebpNoBase64 = graphql`
  fragment GatsbyImageUplyfileFixed_withWebp_noBase64 on ImageUplyfileFixed {
    width
    height
    src
    srcSet
    srcWebp
    srcSetWebp
  }
`

export const gatsbyImageUplyfileFluidPreferWebpNoBase64 = graphql`
  fragment GatsbyImageUplyfileFluid_withWebp_noBase64 on ImageUplyfileFluid {
    width
    height
    src
    srcSet
    srcWebp
    srcSetWebp
  }
`
