import { HealthData, SleepData, ActivityData, VitalsData, BodyData, WorkoutData } from './types';

export class HealthDataParser {
	/**
	 * Parse health data from markdown format
	 */
	parseMarkdown(content: string): HealthData | null {
		// Check if this is a health data file
		if (!content.includes('type: health-data') && !content.includes('# Health Data')) {
			return null;
		}

		const data: HealthData = {
			date: this.extractDate(content)
		};

		// Parse each section
		data.sleep = this.parseSleep(content);
		data.activity = this.parseActivity(content);
		data.vitals = this.parseVitals(content);
		data.body = this.parseBody(content);
		data.workouts = this.parseWorkouts(content);

		return data;
	}

	/**
	 * Parse health data from JSON format
	 */
	parseJSON(content: string): HealthData | null {
		try {
			const data = JSON.parse(content);
			if (data.type === 'health-data' || data.sleep || data.activity) {
				return data as HealthData;
			}
			return null;
		} catch {
			return null;
		}
	}

	private extractDate(content: string): string {
		const dateMatch = content.match(/date:\s*(\d{4}-\d{2}-\d{2})/);
		return dateMatch ? dateMatch[1] : new Date().toISOString().split('T')[0];
	}

	private parseSleep(content: string): SleepData | undefined {
		const sleepSection = this.extractSection(content, '## Sleep');
		if (!sleepSection) return undefined;

		return {
			totalDuration: this.extractDurationSeconds(sleepSection, 'Total'),
			totalDurationFormatted: this.extractValue(sleepSection, 'Total'),
			deepSleep: this.extractDurationSeconds(sleepSection, 'Deep'),
			deepSleepFormatted: this.extractValue(sleepSection, 'Deep'),
			remSleep: this.extractDurationSeconds(sleepSection, 'REM'),
			remSleepFormatted: this.extractValue(sleepSection, 'REM'),
			coreSleep: this.extractDurationSeconds(sleepSection, 'Core'),
			coreSleepFormatted: this.extractValue(sleepSection, 'Core')
		};
	}

	private parseActivity(content: string): ActivityData | undefined {
		const activitySection = this.extractSection(content, '## Activity');
		if (!activitySection) return undefined;

		return {
			steps: this.extractNumber(activitySection, 'Steps'),
			activeCalories: this.extractNumber(activitySection, 'Active Calories'),
			exerciseMinutes: this.extractNumber(activitySection, 'Exercise'),
			flightsClimbed: this.extractNumber(activitySection, 'Flights Climbed'),
			walkingRunningDistanceKm: this.extractNumber(activitySection, 'Distance')
		};
	}

	private parseVitals(content: string): VitalsData | undefined {
		const vitalsSection = this.extractSection(content, '## Vitals');
		if (!vitalsSection) return undefined;

		return {
			restingHeartRate: this.extractNumber(vitalsSection, 'Resting HR'),
			hrv: this.extractNumber(vitalsSection, 'HRV'),
			respiratoryRate: this.extractNumber(vitalsSection, 'Respiratory Rate'),
			bloodOxygenPercent: this.extractNumber(vitalsSection, 'SpO2')
		};
	}

	private parseBody(content: string): BodyData | undefined {
		const bodySection = this.extractSection(content, '## Body');
		if (!bodySection) return undefined;

		return {
			weight: this.extractNumber(bodySection, 'Weight'),
			bodyFatPercent: this.extractNumber(bodySection, 'Body Fat')
		};
	}

	private parseWorkouts(content: string): WorkoutData[] {
		const workoutsSection = this.extractSection(content, '## Workouts');
		if (!workoutsSection) return [];

		const workouts: WorkoutData[] = [];
		const workoutBlocks = workoutsSection.split(/###\s*\d+\.\s*/);

		for (const block of workoutBlocks) {
			if (!block.trim()) continue;

			const typeMatch = block.match(/^([^\n]+)/);
			if (!typeMatch) continue;

			workouts.push({
				type: typeMatch[1].trim(),
				startTime: this.extractValue(block, 'Time') || '',
				duration: this.extractDurationSeconds(block, 'Duration') || 0,
				durationFormatted: this.extractValue(block, 'Duration'),
				distanceKm: this.extractNumber(block, 'Distance'),
				calories: this.extractNumber(block, 'Calories')
			});
		}

		return workouts;
	}

	private extractSection(content: string, header: string): string | null {
		const regex = new RegExp(`${header}[\\s\\S]*?(?=##|$)`, 'i');
		const match = content.match(regex);
		return match ? match[0] : null;
	}

	private extractValue(content: string, label: string): string | undefined {
		const regex = new RegExp(`\\*\\*${label}:?\\*\\*\\s*([^\\n]+)`, 'i');
		const match = content.match(regex);
		return match ? match[1].trim() : undefined;
	}

	private extractNumber(content: string, label: string): number | undefined {
		const value = this.extractValue(content, label);
		if (!value) return undefined;

		const numMatch = value.match(/[\d.]+/);
		return numMatch ? parseFloat(numMatch[0]) : undefined;
	}

	private extractDurationSeconds(content: string, label: string): number | undefined {
		const value = this.extractValue(content, label);
		if (!value) return undefined;

		let totalSeconds = 0;
		const hourMatch = value.match(/(\d+)h/);
		const minMatch = value.match(/(\d+)m/);

		if (hourMatch) totalSeconds += parseInt(hourMatch[1]) * 3600;
		if (minMatch) totalSeconds += parseInt(minMatch[1]) * 60;

		return totalSeconds > 0 ? totalSeconds : undefined;
	}
}
