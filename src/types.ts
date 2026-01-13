export interface HealthData {
	date: string;
	type?: string;
	sleep?: SleepData;
	activity?: ActivityData;
	vitals?: VitalsData;
	body?: BodyData;
	workouts?: WorkoutData[];
}

export interface SleepData {
	totalDuration?: number;
	totalDurationFormatted?: string;
	deepSleep?: number;
	deepSleepFormatted?: string;
	remSleep?: number;
	remSleepFormatted?: string;
	coreSleep?: number;
	coreSleepFormatted?: string;
}

export interface ActivityData {
	steps?: number;
	activeCalories?: number;
	exerciseMinutes?: number;
	flightsClimbed?: number;
	walkingRunningDistance?: number;
	walkingRunningDistanceKm?: number;
}

export interface VitalsData {
	restingHeartRate?: number;
	hrv?: number;
	respiratoryRate?: number;
	bloodOxygen?: number;
	bloodOxygenPercent?: number;
}

export interface BodyData {
	weight?: number;
	bodyFatPercentage?: number;
	bodyFatPercent?: number;
}

export interface WorkoutData {
	type: string;
	startTime: string;
	duration: number;
	durationFormatted?: string;
	distance?: number;
	distanceKm?: number;
	calories?: number;
}

export interface ChartConfig {
	type?: 'overview' | 'activity-rings' | 'sleep' | 'vitals' | 'workouts' | 'trends';
	file?: string;
	options?: {
		showGoals?: boolean;
		stepGoal?: number;
		calorieGoal?: number;
		exerciseGoal?: number;
		theme?: 'light' | 'dark' | 'auto';
	};
}
