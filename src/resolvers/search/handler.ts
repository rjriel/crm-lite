import { FunctionContext, FunctionEvent, FunctionResult } from "8base-cli-types"
import { getAccountByIdQuery, getContactByIdQuery, getLeadByIdQuery, getOpportunityByIdQuery, searchQuery } from "./queriesAndMutations"
import * as clone from "clone"

type responseType = {
  accounts: any[]
  contacts: any[]
  leads: any[]
  opportunities: any[]
}

type ResolverResult = FunctionResult<responseType>

let response: responseType = {
  accounts: [],
  contacts: [],
  leads: [],
  opportunities: [],
}

const getAccounts = async (ctx: FunctionContext, accountList: any[]) => {
  if (!accountList.length) {
    accountList = [accountList]
  }
  for (let i = 0; i < accountList.length; i++) {
    const account = accountList[i]
    const foundAccount = response.accounts.find(
      (existingAccount) => account.id == existingAccount.id
    )
    if (!foundAccount) {
      const accountLookup = await ctx.api.gqlRequest<any>(getAccountByIdQuery, {
        id: account.id,
      })
      if (accountLookup.account) {
        response.accounts.push(clone(accountLookup.account))
      }
    }
  }
  return true
}

const getContacts = async (ctx: FunctionContext, contactList: any[]) => {
  if (!contactList.length) {
    contactList = [contactList]
  }
  for (let i = 0; i < contactList.length; i++) {
    const contact = contactList[i]
    const foundContact = response.contacts.find(
      (existingContact) => contact.id == existingContact.id
    )
    if (!foundContact) {
      const contactLookup = await ctx.api.gqlRequest<any>(getContactByIdQuery, {
        id: contact.id,
      })
      if (contactLookup.contact) {
        response.contacts.push(clone(contactLookup.contact))
      }
    }
  }
  return true
}

const getLeads = async (ctx: FunctionContext, leadList: any[]) => {
  if (!leadList.length) {
    leadList = [leadList]
  }
  for (let i = 0; i < leadList.length; i++) {
    const lead = leadList[i]
    const foundLead = response.leads.find(
      (existingLead) => lead.id == existingLead.id
    )
    if (!foundLead) {
      const leadLookup = await ctx.api.gqlRequest<any>(getLeadByIdQuery, {
        id: lead.id,
      })
      if (leadLookup.lead) {
        response.leads.push(clone(leadLookup.lead))
      }
    }
  }
  return true
}

const getOpportunities = async (ctx: FunctionContext, opportunityList: any[]) => {
  if (!opportunityList.length) {
    opportunityList = [opportunityList]
  }
  for (let i = 0; i < opportunityList.length; i++) {
    const opportunity = opportunityList[i]
    const foundOpportunity = response.opportunities.find(
      (existingOpportunity) => opportunity.id == existingOpportunity.id
    )
    if (!foundOpportunity) {
      const opportunityLookup = await ctx.api.gqlRequest<any>(getOpportunityByIdQuery, {
        id: opportunity.id,
      })
      if (opportunityLookup.opportunity) {
        response.opportunities.push(clone(opportunityLookup.opportunity))
      }
    }
  }
  return true
}

const getEntities = async (ctx: FunctionContext, idList: any[], existingList: any[], query:any) => {
  // handle a null value
  if(!idList)
    return false

  // if we're dealing with an object, make it an array
  if (!idList.length) {
    idList = [idList]
  }

  for (let i = 0; i < idList.length; i++) {
    const entity = idList[i]
    const foundEntity = existingList.find(
      (existingEntity) => entity.id == existingEntity.id
    )
    if (!foundEntity) {
      const entityLookup = await ctx.api.gqlRequest<any>(query, {
        id: entity.id,
      })
      if (entityLookup.entity) {
        existingList.push(clone(entityLookup.entity))
      }
    }
  }
  return true
}

export default async (
  event: FunctionEvent<{ search: string }>,
  ctx: FunctionContext
): ResolverResult => {
  const results = await ctx.api.gqlRequest<any>(searchQuery, {
    search: event.data.search,
  })
  response = {
    accounts: results.accountsList.items,
    contacts: results.contactsList.items,
    leads: results.leadsList.items,
    opportunities: results.opportunitiesList.items,
  }
  for (let i = 0; i < results.documentsList.items.length; i++) {
    await getEntities(ctx, results.documentsList.items[i].accounts, response.accounts, getAccountByIdQuery)
    await getEntities(ctx, results.documentsList.items[i].contacts, response.contacts, getContactByIdQuery)
    await getEntities(ctx, results.documentsList.items[i].leads, response.leads, getLeadByIdQuery)
    await getEntities(ctx, results.documentsList.items[i].opportunities, response.opportunities, getOpportunityByIdQuery)
  }
  for (let i = 0; i < results.notesList.items.length; i++) {
    await getEntities(ctx, results.notesList.items[i].accounts, response.accounts, getAccountByIdQuery)
    await getEntities(ctx, results.notesList.items[i].contacts, response.contacts, getContactByIdQuery)
    await getEntities(ctx, results.notesList.items[i].leads, response.leads, getLeadByIdQuery)
    await getEntities(ctx, results.notesList.items[i].opportunities, response.opportunities, getOpportunityByIdQuery)
  }
  return {
    data: response,
  }
}
