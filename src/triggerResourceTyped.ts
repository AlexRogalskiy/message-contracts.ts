import type { NewTriggerResource, TriggerResource } from "./triggerResource";
import type { TriggerActionResource } from "./triggerActionResource";
import type { TriggerFilterResource } from "./triggerFilterResource";

export interface TriggerResourceTyped<
  F extends TriggerFilterResource,
  A extends TriggerActionResource
> extends TriggerResource {
  Filter: F;
  Action: A;
}

export interface NewTriggerResourceTyped<
  F extends TriggerFilterResource,
  A extends TriggerActionResource
> extends NewTriggerResource {
  Filter: F;
  Action: A;
}
