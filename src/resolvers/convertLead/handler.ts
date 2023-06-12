import { FunctionContext, FunctionEvent, FunctionResult } from "8base-cli-types"
import {
  getLeadQuery,
  createAccountMutation,
  createContactMutation,
  createOpportunityMutation,
  deleteLeadMutation,
} from "./queriesAndMutations"

type resultType = {
  account: string|null,
  contact: string|null,
  opportunity: string|null,
  leadDelete: boolean
}

type ResolverResult = FunctionResult<resultType>

export default async (
  event: FunctionEvent<{ id: string }>,
  ctx: FunctionContext
): ResolverResult => {
  const result:resultType = {
    account: null,
    contact: null,
    opportunity: null,
    leadDelete: false,
  }
  try {
    const leadData = await ctx.api.gqlRequest<any>(getLeadQuery, {
      id: event.data.id,
    })

    // create Account From Lead Data
    const accountData: any = {
      name: leadData.lead.company,
      website: leadData.lead.website,
      numberOfEmployees: leadData.lead.numberOfEmployees,
      annualRevenue: leadData.lead.annualRevenue,
      industry: leadData.lead.industry,
      documents: {
        connect: [] as Object[],
      },
      notes: {
        connect: [] as Object[],
      },
    }
    if (leadData.lead.owner?.id) {
      accountData.owner = { connect: { id: leadData.lead.owner.id } }
    }
    leadData.lead.documents.items.forEach((document) => {
      accountData.documents.connect.push({ id: document.id })
    })
    leadData.lead.notes.items.forEach((note) => {
      accountData.notes.connect.push({ id: note.id })
    })
    const accountResult = await ctx.api.gqlRequest<any>(createAccountMutation, {
      data: accountData,
    })

    if (accountResult.accountCreate?.id) {
      result.account = accountResult.accountCreate.id
      // create Contact From Lead Data
      const contactData: any = {
        salutation: leadData.lead.salutation,
        firstName: leadData.lead.firstName,
        lastName: leadData.lead.lastName,
        email: leadData.lead.email,
        phone: {
          code: leadData.lead.phone?.code,
          number: leadData.lead.phone?.number,
        },
        title: leadData.lead.title,
        mailingAddress: {
          street1: leadData.lead.address?.street1,
          street2: leadData.lead.address?.street2,
          city: leadData.lead.address?.city,
          state: leadData.lead.address?.state,
          zip: leadData.lead.address?.zip,
          country: leadData.lead.address?.country,
        },
        account: {
          connect: { id: accountResult.accountCreate.id },
        },
        documents: {
          connect: [] as Object[],
        },
        notes: {
          connect: [] as Object[],
        },
      }
      if (leadData.lead.owner?.id) {
        contactData.owner = { connect: { id: leadData.lead.owner.id } }
      }
      leadData.lead.documents.items.forEach((document) => {
        contactData.documents.connect.push({ id: document.id })
      })
      leadData.lead.notes.items.forEach((note) => {
        contactData.notes.connect.push({ id: note.id })
      })
      const contactResult = await ctx.api.gqlRequest<any>(
        createContactMutation,
        { data: contactData }
      )
      if (contactResult.contactCreate?.id) {
        result.contact = accountResult.accountCreate.id
      }

      // create Opportunity From Lead Data
      const opportunityData: any = {
        leadSource: leadData.lead.leadSource,
        name: `${leadData.lead.company} Opportunity`,
        account: {
          connect: { id: accountResult.accountCreate.id },
        },
        documents: {
          connect: [] as Object[],
        },
        notes: {
          connect: [] as Object[],
        },
      }
      if (leadData.lead.owner?.id) {
        opportunityData.owner = { connect: { id: leadData.lead.owner.id } }
      }
      leadData.lead.documents.items.forEach((document) => {
        opportunityData.documents.connect.push({ id: document.id })
      })
      leadData.lead.notes.items.forEach((note) => {
        opportunityData.notes.connect.push({ id: note.id })
      })
      const opportunityResult = await ctx.api.gqlRequest<any>(
        createOpportunityMutation,
        { data: opportunityData }
      )
      if (opportunityResult.opportunityCreate?.id) {
        result.opportunity = opportunityResult.opportunityCreate.id
      }
    }
    if(result.account && result.contact && result.opportunity) {
      const leadDeleteResult = await ctx.api.gqlRequest<any>(
        deleteLeadMutation,
        { id: leadData.lead.id }
      )
      result.leadDelete = leadDeleteResult.leadDelete.success
    }
  } catch (e) {
    console.error(e)
  }
  return {
    data: result,
  }
}
