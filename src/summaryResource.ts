import type { CommunicationStyle } from "./communicationStyle";
import type { MachineModelHealthStatus } from "./machineResource";
import type { Resource } from "./resource";

export interface SummaryResource extends Resource {
  TotalMachines: number;
  TotalDisabledMachines: number;
  MachineHealthStatusSummaries: Record<
    keyof typeof MachineModelHealthStatus,
    number
  >;
  MachineEndpointSummaries: Record<keyof typeof CommunicationStyle, number>;
  TentacleUpgradesRequired: boolean;
  MachineIdsForCalamariUpgrade: string[];
  MachineIdsForTentacleUpgrade: string[];
}

export default SummaryResource;
