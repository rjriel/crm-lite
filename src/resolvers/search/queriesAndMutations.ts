import gql from 'graphql-tag'

const searchQuery = gql`
query GlobalSearch($search: String) {
  accountsList(filter: {_fullText: $search}) {
    items {
      annualRevenue
      billingAddress {
        city
        country
        state
        street1
        street2
        zip
      }
      industry
      name
      numberOfEmployees
      phone {
        number
      }
      shippingAddress {
        city
        country
        state
        street1
        street2
        zip
      }
      website
      type
      id
      opportunities {
        items {
          name
        }
      }
      contacts {
        items {
          firstName
          id
          lastName
        }
      }
      fax {
        number
      }
      documents {
        items {
          title
          createdAt
          createdBy {
            firstName
            lastName
          }
          file {
            downloadUrl
          }
        }
      }
      notes {
        items {
          createdAt
          createdBy {
            firstName
            lastName
          }
          subject
          content
        }
      }
      owner {
        avatar {
          downloadUrl
        }
        firstName
        lastName
      }
      parent {
        name
        id
      }
    }
  }
  contactsList(filter: {_fullText: $search}) {
    items {
      account {
        name
        id
      }
      documents {
        items {
          createdAt
          createdBy {
            lastName
            firstName
          }
          file {
            downloadUrl
          }
          title
        }
      }
      email
      firstName
      id
      lastName
      mailingAddress {
        city
        country
        state
        street1
        street2
        zip
      }
      mobile {
        number
      }
      notes {
        items {
          content
          createdAt
          createdBy {
            firstName
            lastName
          }
          subject
        }
      }
      owner {
        avatar {
          downloadUrl
        }
        firstName
        lastName
        id
      }
      phone {
        number
      }
      reportsTo {
        firstName
        id
        lastName
      }
      salutation
      title
    }
  }
  notesList(filter: {_fullText: $search}) {
    items {
      id
      accounts {
        id
      }
      contacts {
        id
      }
      leads {
        id
      }
      opportunities {
        id
      }
    }
  }
  documentsList(filter: {_fullText: $search}) {
    items {
      accounts {
        id
      }
      contacts {
        id
      }
      leads {
        id
      }
      opportunities {
        id
      }
      id
    }
  }
  leadsList(filter: {_fullText: $search}) {
    items {
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
          content
          subject
          createdBy {
            firstName
            lastName
          }
          createdAt
        }
      }
      numberOfEmployees
      phone {
        number
      }
      owner {
        firstName
        lastName
        avatar {
          downloadUrl
        }
        id
      }
      rating
      salutation
      status
      title
      website
      documents {
        items {
          file {
            downloadUrl
          }
          createdBy {
            firstName
            lastName
          }
          title
          createdAt
        }
      }
    }
  }
  opportunitiesList(filter: {_fullText: $search}) {
    items {
      account {
        id
        name
      }
      amount
      documents {
        items {
          file {
            downloadUrl
          }
          title
          createdAt
          createdBy {
            lastName
            firstName
          }
        }
      }
      name
      leadSource
      notes {
        items {
          createdAt
          createdBy {
            firstName
            lastName
          }
          subject
          content
        }
      }
      owner {
        avatar {
          downloadUrl
        }
        firstName
        lastName
        id
      }
      probabilityPercentage
      state
      targetCloseDate
      type
      id
    }
  }
}
`

const getAccountByIdQuery = gql`
query getAccountById($id:ID) {
  entity:account(id: $id) {
    annualRevenue
      billingAddress {
        city
        country
        state
        street1
        street2
        zip
      }
      industry
      name
      numberOfEmployees
      phone {
        number
      }
      shippingAddress {
        city
        country
        state
        street1
        street2
        zip
      }
      website
      type
      id
      opportunities {
        items {
          name
        }
      }
      contacts {
        items {
          firstName
          id
          lastName
        }
      }
      fax {
        number
      }
      documents {
        items {
          title
          createdAt
          createdBy {
            firstName
            lastName
          }
          file {
            downloadUrl
          }
        }
      }
      notes {
        items {
          createdAt
          createdBy {
            firstName
            lastName
          }
          subject
          content
        }
      }
      owner {
        avatar {
          downloadUrl
        }
        firstName
        lastName
      }
      parent {
        name
        id
      }
  }
}
`

const getContactByIdQuery = gql`
query getContactById($id:ID) {
  entity:contact(id: $id) {
    account {
        name
        id
      }
      documents {
        items {
          createdAt
          createdBy {
            lastName
            firstName
          }
          file {
            downloadUrl
          }
          title
        }
      }
      email
      firstName
      id
      lastName
      mailingAddress {
        city
        country
        state
        street1
        street2
        zip
      }
      mobile {
        number
      }
      notes {
        items {
          content
          createdAt
          createdBy {
            firstName
            lastName
          }
          subject
        }
      }
      owner {
        avatar {
          downloadUrl
        }
        firstName
        lastName
        id
      }
      phone {
        number
      }
      reportsTo {
        firstName
        id
        lastName
      }
      salutation
      title
  }
}
`

const getLeadByIdQuery = gql`
query getLead($id: ID) {
  entity:lead(id: $id) {
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
        content
        subject
        createdBy {
          firstName
          lastName
        }
        createdAt
      }
    }
    numberOfEmployees
    phone {
      number
    }
    owner {
      firstName
      lastName
      avatar {
        downloadUrl
      }
      id
    }
    rating
    salutation
    status
    title
    website
    documents {
      items {
        file {
          downloadUrl
        }
        createdBy {
          firstName
          lastName
        }
        title
        createdAt
      }
    }
  }
}
`

const getOpportunityByIdQuery = gql`
query getOpportunityById($id:ID) {
  entity:opportunity(id: $id) {
    account {
      id
      name
    }
    amount
    documents {
      items {
        file {
          downloadUrl
        }
        title
        createdAt
        createdBy {
          lastName
          firstName
        }
      }
    }
    name
    leadSource
    notes {
      items {
        createdAt
        createdBy {
          firstName
          lastName
        }
        subject
        content
      }
    }
    owner {
      avatar {
        downloadUrl
      }
      firstName
      lastName
      id
    }
    probabilityPercentage
    state
    targetCloseDate
    type
    id
  }
}
`

export { getAccountByIdQuery, getContactByIdQuery, getLeadByIdQuery, getOpportunityByIdQuery, searchQuery }