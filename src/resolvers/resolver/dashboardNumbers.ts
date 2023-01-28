/**
 * This file was generated using 8base CLI.
 *
 * To learn more about writing custom GraphQL resolver functions, visit
 * the 8base documentation at:
 *
 * https://docs.8base.com/docs/8base-console/custom-functions/resolvers/
 *
 * To update this functions invocation settings, update its configuration block
 * in the projects 8base.yml file:
 *  functions:
 *    resolver:
 *      ...
 *
 * Data that is sent to this function can be accessed on the event argument at:
 *  event.data[KEY_NAME]
 *
 * There are two ways to invoke this function locally:
 *
 *  (1) Explicit file mock file path using '-p' flag:
 *    8base invoke-local resolver -p src/resolvers/resolver/mocks/request.json
 *
 *  (2) Default mock file location using -m flag:
 *    8base invoke-local resolver -m request
 *
 *  Add new mocks to this function to test different input arguments. Mocks can easily be generated
 *  the following generator command:
 *    8base generate mock resolver -m [MOCK_FILE_NAME]
 */

import { FunctionContext, FunctionEvent, FunctionResult } from '8base-cli-types'
import gql from 'graphql-tag'

const YTD_QUERY = gql`
query OpportunitiesList($startDate: Date, $endDate: Date) {
  opportunitiesList(filter: {probabilityPercentage: {equals: 100}, targetCloseDate: {gte: $startDate, lt: $endDate}}) {
    items {
      name
      targetCloseDate
      amount
      owner {
        avatar {
          downloadUrl
        }
      }
    }
  }
}
`

const OPEN_OPPORTUNITIES_QUERY = gql`
query OpportunitiesList {
  opportunitiesList(filter: {probabilityPercentage: {gt: 0, lt: 100}}) {
    count
  }
}
`

const LEADS_COUNT_QUERY = gql`
query LeadsCount {
  leadsList {
    count
  }
}
`


type DashboardNumbersResult = FunctionResult<{
  ytdClosedDeals: number,
  cqClosedDeals: number,
  openDeals: number,
  totalLeads: number,
  newNotes: number
}>;

export default async (
  event: FunctionEvent,
  ctx: FunctionContext,
): DashboardNumbersResult => {
  const year = (new Date()).getFullYear()
  let quarterStart
  let quarterEnd
  let quarterEndYear = year
  switch(new Date().getMonth()) {
    case 0:
    case 1:
    case 2:
      quarterStart = "01"
      quarterEnd = "04"
      break;
    case 3:
    case 4:
    case 5:
      quarterStart = "04"
      quarterEnd = "07"
      break;
    case 6:
    case 7:
    case 8:
      quarterStart = "07"
      quarterEnd = "10"
      break;
    default:
      quarterStart = "10"
      quarterEnd = "01"
      quarterEndYear = year + 1
  }
  const quarterStartString = `${year}-${quarterStart}-01`
  const quarterEndString = `${quarterEndYear}-${quarterEnd}-01`
  const ytdRequest = await ctx.api.gqlRequest<any>(YTD_QUERY, { startDate: `${year}-01-01`, endDate: `${year+1}-01-01` })
  const ytdClose = ytdRequest.opportunitiesList.items.reduce((accumulator, item) => accumulator + (item.amount || 0), 0)
  const quarterRequest = await ctx.api.gqlRequest<any>(YTD_QUERY, { startDate: `${quarterStartString}`, endDate: `${quarterEndString}` })
  const quarterClose = quarterRequest.opportunitiesList.items.reduce((accumulator, item) => accumulator + (item.amount || 0), 0)
  const openOpportunitiesRequest = await ctx.api.gqlRequest<any>(OPEN_OPPORTUNITIES_QUERY)
  const openOpportunities = openOpportunitiesRequest.opportunitiesList.count
  const leadCountRequest = await ctx.api.gqlRequest<any>(LEADS_COUNT_QUERY)
  const leadCount = leadCountRequest.leadsList.count
  return {
    data: {
      ytdClosedDeals: ytdClose,
      cqClosedDeals: quarterClose,
      openDeals: openOpportunities,
      totalLeads: leadCount
    },
  };
};
