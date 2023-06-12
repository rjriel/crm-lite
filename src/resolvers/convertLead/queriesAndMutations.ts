import gql from 'graphql-tag'

const getLeadQuery = gql`
query getLead($id: ID) {
  lead(id: $id) {
    address {
      city
      country
      state
      street1
      street2
      zip
    }
    annualRevenue
    company
    email
    firstName
    id
    industry
    lastName
    leadSource
    notes {
      items {
        id
      }
    }
    numberOfEmployees
    phone {
      code
      number
    }
    owner {
      id
    }
    salutation
    title
    website
    documents {
      items {
        id
      }
    }
  }
}
`

const createAccountMutation = gql`
mutation CreateAccountMutation($data:AccountCreateInput!) {
  accountCreate(data: $data) {
    id
  }
}
`

const createContactMutation = gql`
mutation CreateContact($data:ContactCreateInput!) {
  contactCreate(data: $data) {
    id
  }
}
`

const createOpportunityMutation = gql`
mutation CreateOpportunityMutation($data: OpportunityCreateInput!) {
  opportunityCreate(data: $data) {
    id
  }
}
`

const deleteLeadMutation = gql`
mutation MyMutation($id: ID!) {
  leadDelete(data: {id: $id}) {
    success
  }
}
`

export {
  getLeadQuery,
  createAccountMutation,
  createContactMutation,
  createOpportunityMutation,
  deleteLeadMutation
}