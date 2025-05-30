
/**
 * GraphQL queries for the Tally API
 */

/**
 * GraphQL query to get user's governance data
 */
export const USER_GOVERNANCE_QUERY = `
  query UserGovernance($address: Address!) {
    user(address: $address) {
      address
      name
      bio
      picture
      governorDelegates {
        governor {
          id
          name
          slug
          timelockId
          tokens {
            id
            name
            symbol
            supply
          }
        }
        delegate {
          account {
            address
            name
          }
          votesCount
        }
        token {
          id
          name
          symbol
        }
      }
      votes(pagination: { limit: 5, offset: 0 }) {
        nodes {
          id
          support
          weight
          reason
          proposal {
            id
            title
            description
            status
            start {
              ... on Block {
                number
                timestamp
              }
            }
            end {
              ... on Block {
                number
                timestamp
              }
            }
          }
        }
      }
    }
  }
`;

/**
 * GraphQL query to get popular governors/DAOs
 */
export const GOVERNORS_QUERY = `
  query Governors($input: GovernorsInput!) {
    governors(input: $input) {
      nodes {
        id
        name
        slug
        tokens {
          id
          name
          symbol
          supply
        }
        delegatesVotesCount
        proposalsCount
        quorum
        timelockId
      }
    }
  }
`;
