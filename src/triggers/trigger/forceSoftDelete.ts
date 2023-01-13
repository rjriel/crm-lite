import { FunctionContext, FunctionEvent, FunctionResult } from '8base-cli-types';


type TriggerResult = FunctionResult<{
  },
  {},
  {},
  Array<object>
>;

export default async (
  event: any,
  ctx: FunctionContext,
): TriggerResult => {
   if (event.destroyDeleted) {
     throw new Error(`System only allows soft deletes.`);
   }
  return {
    data: {
      ...event.data
    },
    errors: [],
  };
};
