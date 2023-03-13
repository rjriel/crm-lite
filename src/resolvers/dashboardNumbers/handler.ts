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
  totalLeads: number
}>;

const getQuarterStrings = (year, month) => {
  let quarterStart
  let quarterEnd
  let quarterEndYear = year
  switch(month) {
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

  return [`${year}-${quarterStart}-01`, `${quarterEndYear}-${quarterEnd}-01`]
}

export default async (
  event: FunctionEvent,
  ctx: FunctionContext,
): DashboardNumbersResult => {
  const year = (new Date()).getFullYear()
  const [quarterStartString, quarterEndString] = getQuarterStrings(year, new Date().getMonth())
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
