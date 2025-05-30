
/**
 * GraphQL queries for the Tally API
 */

/**
 * GraphQL query to get user's governance data using the accounts query
 */
export const USER_GOVERNANCE_QUERY = `
  query Accounts($addresses: [Address!]) {
    accounts(addresses: $addresses) {
      id
      address
      ens
      twitter
      name
      bio
      picture
      type
      votes
      proposalsCreatedCount
    }
  }
`;

/**
 * GraphQL query to get delegate information for a user
 */
export const USER_DELEGATE_QUERY = `
  query Delegatees($input: DelegationsInput!) {
    delegatees(input: $input) {
      nodes {
        ... on Delegation {
          id
          votes
          delegate {
            id
            address
            name
            bio
            picture
          }
          token {
            id
            name
            symbol
            supply
          }
          organization {
            id
            name
            slug
          }
        }
      }
      pageInfo {
        firstCursor
        lastCursor
        count
      }
    }
  }
`;

/**
 * GraphQL query to get delegates for an organization
 */
export const DELEGATES_QUERY = `
  query Delegates($input: DelegatesInput!) {
    delegates(input: $input) {
      nodes {
        ... on Delegate {
          id
          votesCount
          account {
            id
            address
            name
            bio
            picture
          }
          governor {
            id
            name
            slug
            token {
              id
              name
              symbol
              supply
            }
          }
          organization {
            id
            name
            slug
          }
        }
      }
      pageInfo {
        firstCursor
        lastCursor
        count
      }
    }
  }
`;
