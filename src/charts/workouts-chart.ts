import { WorkoutData } from '../types';

export class WorkoutsChart {
	private container: HTMLElement;

	// Workout type to minimal icon mapping (Teenage Engineering style)
	private readonly WORKOUT_ICONS: { [key: string]: string } = {
		'Running': '▸',
		'Walking': '·',
		'Cycling': '○',
		'Swimming': '~',
		'Yoga': '◇',
		'HIIT': '▲',
		'Strength': '◼',
		'Dance': '♪',
		'Hiking': '△',
		'Rowing': '≈',
		'Elliptical': '◯',
		'Stair Climbing': '▴',
		'Tennis': '●',
		'Basketball': '●',
		'Soccer': '●',
		'Golf': '○',
		'Boxing': '■',
		'Martial Arts': '◆'
	};

	constructor(container: HTMLElement) {
		this.container = container;
	}

	render(workouts: WorkoutData[]): void {
		const workoutsContainer = this.container.createDiv({ cls: 'workouts-container' });

		workouts.forEach((workout, index) => {
			const workoutCard = workoutsContainer.createDiv({ cls: 'workout-card' });

			// Get icon for workout type
			const icon = this.WORKOUT_ICONS[workout.type] || '▸';

			// Workout header
			const header = workoutCard.createDiv({ cls: 'workout-header' });
			header.innerHTML = `
				<div class="workout-icon">${icon}</div>
				<div class="workout-title">
					<div class="workout-type">${workout.type}</div>
					<div class="workout-time">${workout.startTime}</div>
				</div>
			`;

			// Workout stats
			const stats = workoutCard.createDiv({ cls: 'workout-stats' });

			// Duration
			stats.innerHTML += `
				<div class="workout-stat">
					<div class="workout-stat-label">Duration</div>
					<div class="workout-stat-value">${workout.durationFormatted || this.formatDuration(workout.duration)}</div>
				</div>
			`;

			// Distance (if available)
			if (workout.distanceKm) {
				stats.innerHTML += `
					<div class="workout-stat">
						<div class="workout-stat-label">Distance</div>
						<div class="workout-stat-value">${workout.distanceKm.toFixed(2)} km</div>
					</div>
				`;
			}

			// Calories
			if (workout.calories) {
				stats.innerHTML += `
					<div class="workout-stat">
						<div class="workout-stat-label">Calories</div>
						<div class="workout-stat-value">${workout.calories} kcal</div>
					</div>
				`;
			}

			// Add gradient accent based on workout type
			const color = this.getWorkoutColor(workout.type);
			workoutCard.style.setProperty('--workout-accent', color);
		});
	}

	private formatDuration(seconds: number): string {
		const hours = Math.floor(seconds / 3600);
		const minutes = Math.floor((seconds % 3600) / 60);

		if (hours > 0) {
			return `${hours}h ${minutes}m`;
		}
		return `${minutes}m`;
	}

	private getWorkoutColor(type: string): string {
		// Single accent color for all workouts
		return '#a78bfa';
	}
}
