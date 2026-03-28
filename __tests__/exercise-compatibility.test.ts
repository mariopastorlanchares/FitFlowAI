import { getWorkoutSession } from '@features/workout/services/workout-service';
import {
  deriveHomeAvailableCapabilities,
  getAvailableCapabilitiesForWorkoutContext,
  getIncompatibleRequiredCapabilities,
  isExerciseCompatibleWithCapabilities,
} from '@shared/lib/exercise-compatibility';
import { getExerciseCatalogEntry } from '@shared/lib/exercise-catalog';

describe('exercise compatibility domain', () => {
  it('derives home capabilities from persisted equipment plus bodyweight', () => {
    expect(
      deriveHomeAvailableCapabilities({
        dumbbells: { isPair: true, adjustable: true, maxWeightKg: 24 },
        bench: { adjustableIncline: true },
      })
    ).toEqual(['bodyweight', 'dumbbells', 'bench']);
  });

  it('uses context capabilities outside home while keeping bodyweight as implicit', () => {
    expect(
      getAvailableCapabilitiesForWorkoutContext({
        location: 'park',
        homeEquipment: {},
        contextCapabilities: ['pullup_bar', 'parallel_bars'],
      })
    ).toEqual(['bodyweight', 'pullup_bar', 'parallel_bars']);
  });

  it('flags incompatible requirements deterministically', () => {
    expect(
      getIncompatibleRequiredCapabilities('back_squat', ['bodyweight', 'dumbbells'])
    ).toEqual(['barbell']);
  });

  it('accepts an exercise when all its required capabilities are present', () => {
    expect(
      isExerciseCompatibleWithCapabilities('pull_up', ['bodyweight', 'pullup_bar'])
    ).toBe(true);
  });

  it('exposes canonical metadata for each exercise id', () => {
    expect(getExerciseCatalogEntry('dumbbell_bench_press')).toMatchObject({
      id: 'dumbbell_bench_press',
      movementPattern: 'push_horizontal',
      requiredCapabilities: ['dumbbells', 'bench'],
    });
  });
});

describe('workout preview service', () => {
  it('builds the preview session from canonical exercise ids', async () => {
    const session = await getWorkoutSession('1');

    expect(session.exercises[0]?.exerciseId).toBe('back_squat');
    expect(session.exercises[1]?.exerciseId).toBe('leg_press');
    expect(session.exercises[0]?.name).toBeTruthy();
    expect(session.exercises[1]?.description).toBeTruthy();
  });
});
