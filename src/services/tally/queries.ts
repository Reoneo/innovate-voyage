
/**
 * GraphQL queries for the Tally API
 */

/**
 * GraphQL query to get user's governance data
 */
export const USER_GOVERNANCE_QUERY = `
  query Account($address: Address!) {
    account(address: $address) {
      address
      name
      bio
      picture
      delegatesVotes {
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
      votes(first: 5) {
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
              timestamp
            }
            end {
              timestamp
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
  query Governors($first: Int!, $orderBy: GovernorOrderBy) {
    governors(first: $first, orderBy: $orderBy) {
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
