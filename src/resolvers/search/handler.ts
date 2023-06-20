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
