/* eslint-disable @typescript-eslint/no-non-null-assertion */
import * as _ from "lodash";
import type ActionInputs from "./actionInputs";
import type ActionProperties from "./actionProperties";
import type { DeploymentActionContainer } from "./deploymentActionContainer";
import type FeedResource from "./feedResource";
import { FeedType } from "./feedType";
import { PackageAcquisitionLocation } from "./packageAcquisitionLocation";
import type { PackageReference } from "./packageReference";
import { PackageSelectionMode } from "./packageReference";
import type { ResourceWithId } from "./resource";
import type { RunConditionForAction } from "./runConditionForAction";

export type NameOrIdKey = "Name" | "Id";

function parseCSV(val: string): string[] {
  if (!val || val === "") {
    return [];
  }
  return val.split(",");
}

export interface DeploymentActionResource extends ResourceWithId {
  Id: string;
  Name: string;
  Notes: string | null;
  ActionType: string;
  WorkerPoolId: string | null;
  WorkerPoolVariable: string | null;
  Container: DeploymentActionContainer;
  IsDisabled: boolean;
  CanBeUsedForProjectVersioning: boolean;
  Environments: string[];
  ExcludedEnvironments: string[];
  Channels: string[];
  TenantTags: string[];
  Packages: PackageReference[];
  Properties: ActionProperties;
  Inputs?: ActionInputs;
  StepPackageVersion?: string;
  IsRequired: boolean;
  Condition?: RunConditionForAction;
}

export default DeploymentActionResource;

export function IsDeployReleaseAction(action: DeploymentActionResource) {
  return !!action.Properties["Octopus.Action.DeployRelease.ProjectId"];
}

export function IsPrimaryPackageReference(pkg: PackageReference<any>): boolean {
  return !pkg.Name;
}

export function RemovePrimaryPackageReference(
  packages: Array<PackageReference<any>>
): Array<PackageReference<any>> {
  return _.filter(packages, (pkg) => !IsPrimaryPackageReference(pkg));
}

// Returns true if the names match, where null and empty string are equivalent
export function PackageReferenceNamesMatch(
  nameA: string | undefined,
  nameB: string | undefined
): boolean {
  if (!nameA) {
    return !nameB;
  }

  return nameA === nameB;
}

export function HasManualInterventionResponsibleTeams(
  action: DeploymentActionResource
) {
  return _.some(
    parseCSV(
      action.Properties["Octopus.Action.Manual.ResponsibleTeamIds"] as string
    )
  );
}

export function GetPrimaryPackageReference(
  packages: undefined | Array<PackageReference<any>>
): PackageReference<any> {
  return packages?.find((pkg) => IsPrimaryPackageReference(pkg))!;
}

export function IsNamedPackageReference(pkg: PackageReference): boolean {
  return !!pkg.Name;
}

export function GetNamedPackageReferences(
  packages: Array<PackageReference<any>>
): Array<PackageReference<any>> {
  return RemovePrimaryPackageReference(packages);
}

export function SetNamedPackageReference(
  name: string,
  updated: Partial<PackageReference<any>>,
  packages: Array<PackageReference<any>>
): Array<PackageReference<any>> {
  return _.map(packages, (pkg) => {
    if (!PackageReferenceNamesMatch(name, pkg.Name!)) {
      return pkg;
    }
    return { ...pkg, ...updated };
  });
}

export function SetPrimaryPackageReference(
  updated: Partial<PackageReference<any>>,
  packages: Array<PackageReference<any>>
): Array<PackageReference<any>> {
  return _.map(packages, (pkg) => {
    if (!IsPrimaryPackageReference(pkg)) {
      return pkg;
    }
    return { ...pkg, ...updated };
  });
}

export function InitialisePrimaryPackageReference(
  packages: Array<PackageReference<any>>,
  feeds: FeedResource[],
  itemsKeyedBy: NameOrIdKey
): Array<PackageReference<any>> {
  const primaryPackage = GetPrimaryPackageReference(packages);

  if (primaryPackage) {
    if (!primaryPackage.Properties.SelectionMode) {
      primaryPackage.Properties.SelectionMode = PackageSelectionMode.Immediate;
    }
    return [...packages];
  }

  const packagesWithoutDefault = RemovePrimaryPackageReference(packages);
  const builtInFeed: FeedResource | undefined = feeds.find(
    (f) => f.FeedType === FeedType.BuiltIn
  );
  const builtInFeedIdOrName: string | undefined =
    builtInFeed && builtInFeed[itemsKeyedBy];

  return [
    {
      Id: null!,
      PackageId: null!,
      FeedId: builtInFeedIdOrName!,
      AcquisitionLocation: PackageAcquisitionLocation.Server,
      Properties: {
        SelectionMode: PackageSelectionMode.Immediate,
      },
    },
    ...packagesWithoutDefault,
  ];
}
