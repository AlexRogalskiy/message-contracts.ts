import ResourceWithId from "./resource";

export interface RetentionDefaultConfigurationResource
  extends ResourceWithId<{ Self: string }> {
  RetentionDays?: number;
}

export default RetentionDefaultConfigurationResource;
