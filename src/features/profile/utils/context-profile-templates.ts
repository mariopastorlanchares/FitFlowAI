import {
  ContextCapabilityId,
  ContextProfile,
  ContextProfileLocation,
  ContextProfileTemplateId,
  UserProfile,
} from '@shared/types/user-profile';

export const EDITABLE_CONTEXT_PROFILE_LOCATIONS = ['park', 'gym'] as const;

export type EditableContextProfileLocation =
  (typeof EDITABLE_CONTEXT_PROFILE_LOCATIONS)[number];

type ContextProfileDraft = Omit<ContextProfile, 'updatedAt'>;

interface ContextProfileTemplateDefinition {
  templateId: ContextProfileTemplateId;
  capabilityIds: ContextCapabilityId[];
}

const CONTEXT_PROFILE_TEMPLATE_DEFINITIONS: Record<
  EditableContextProfileLocation,
  ContextProfileTemplateDefinition
> = {
  park: {
    templateId: 'park_v1',
    capabilityIds: ['pullup_bar', 'parallel_bars', 'rings_anchor'],
  },
  gym: {
    templateId: 'gym_v1',
    capabilityIds: ['dumbbells', 'barbell', 'bench', 'bands', 'kettlebell', 'machine_access'],
  },
};

export const FUTURE_CONTEXT_PROFILE_LOCATIONS: ContextProfileLocation[] = ['street'];

export function getContextProfileTemplateDefinition(location: EditableContextProfileLocation) {
  return CONTEXT_PROFILE_TEMPLATE_DEFINITIONS[location];
}

export function createContextProfileTemplate(
  location: EditableContextProfileLocation
): ContextProfileDraft {
  const definition = getContextProfileTemplateDefinition(location);

  return {
    templateId: definition.templateId,
    enabledCapabilities: [...definition.capabilityIds],
  };
}

export function normalizeContextCapabilitiesOrder(
  location: EditableContextProfileLocation,
  capabilities: ContextCapabilityId[]
) {
  const orderedCapabilities = getContextProfileTemplateDefinition(location).capabilityIds;

  return orderedCapabilities.filter((capability) => capabilities.includes(capability));
}

export function getEffectiveContextProfile(
  userProfile: UserProfile | null,
  location: EditableContextProfileLocation
): ContextProfileDraft {
  const persistedProfile = userProfile?.contextProfiles[location];

  if (!persistedProfile) {
    return createContextProfileTemplate(location);
  }

  return {
    templateId: persistedProfile.templateId,
    enabledCapabilities: normalizeContextCapabilitiesOrder(
      location,
      persistedProfile.enabledCapabilities
    ),
  };
}

export function haveSameCapabilities(
  left: ContextCapabilityId[],
  right: ContextCapabilityId[]
) {
  if (left.length !== right.length) {
    return false;
  }

  return left.every((capability, index) => capability === right[index]);
}

export function isContextProfileDirty(
  userProfile: UserProfile | null,
  location: EditableContextProfileLocation,
  draft: ContextProfileDraft
) {
  const baseline = getEffectiveContextProfile(userProfile, location);

  return (
    draft.templateId !== baseline.templateId ||
    !haveSameCapabilities(draft.enabledCapabilities, baseline.enabledCapabilities)
  );
}
