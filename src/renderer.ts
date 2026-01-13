import { HealthData } from './types';
import { ActivityRingsChart } from './charts/activity-rings';
import { SleepChart } from './charts/sleep-chart';
import { VitalsChart } from './charts/vitals-chart';
import { WorkoutsChart } from './charts/workouts-chart';
import { StatsCard } from './components/stats-card';

export class HealthChartRenderer {
	private container: HTMLElement;

	constructor(container: HTMLElement) {
		this.container = container;
	}

	/**
	 * Render complete health dashboard
	 */
	render(data: HealthData): void {
		// Clear container
		this.container.empty();

		// Create main container with Apple Health styling
		const dashboard = this.container.createDiv({ cls: 'health-dashboard' });

		// Date header
		const header = dashboard.createDiv({ cls: 'health-header' });
		header.createEl('h2', { text: this.formatDate(data.date), cls: 'health-date' });

		// Activity rings (hero section)
		if (data.activity) {
			const ringsSection = dashboard.createDiv({ cls: 'health-section health-rings-section' });
			const rings = new ActivityRingsChart(ringsSection);
			rings.render(data.activity);
		}

		// Stats grid
		const statsGrid = dashboard.createDiv({ cls: 'health-stats-grid' });

		// Sleep card
		if (data.sleep) {
			const sleepCard = new StatsCard(statsGrid, 'Sleep', '😴', '#A78AFA');
			sleepCard.render();
			const sleepChart = new SleepChart(sleepCard.getContent());
			sleepChart.render(data.sleep);
		}

		// Vitals card
		if (data.vitals) {
			const vitalsCard = new StatsCard(statsGrid, 'Vitals', '❤️', '#FF6B9D');
			vitalsCard.render();
			const vitalsChart = new VitalsChart(vitalsCard.getContent());
			vitalsChart.render(data.vitals);
		}

		// Body metrics card
		if (data.body) {
			const bodyCard = new StatsCard(statsGrid, 'Body', '⚖️', '#34D399');
			bodyCard.render();
			const content = bodyCard.getContent();

			if (data.body.weight) {
				content.createDiv({ cls: 'stat-item' }).innerHTML = `
					<span class="stat-label">Weight</span>
					<span class="stat-value">${data.body.weight.toFixed(1)} kg</span>
				`;
			}
			if (data.body.bodyFatPercent) {
				content.createDiv({ cls: 'stat-item' }).innerHTML = `
					<span class="stat-label">Body Fat</span>
					<span class="stat-value">${data.body.bodyFatPercent.toFixed(1)}%</span>
				`;
			}
		}

		// Workouts section
		if (data.workouts && data.workouts.length > 0) {
			const workoutsSection = dashboard.createDiv({ cls: 'health-section' });
			workoutsSection.createEl('h3', { text: 'Workouts', cls: 'section-title' });
			const workoutsChart = new WorkoutsChart(workoutsSection);
			workoutsChart.render(data.workouts);
		}
	}

	/**
	 * Render specific chart type
	 */
	renderSpecific(data: HealthData, type: string, options: any): void {
		this.container.empty();

		switch (type) {
			case 'activity-rings':
				if (data.activity) {
					const rings = new ActivityRingsChart(this.container);
					rings.render(data.activity, options);
				}
				break;
			case 'sleep':
				if (data.sleep) {
					const sleep = new SleepChart(this.container);
					sleep.render(data.sleep);
				}
				break;
			case 'vitals':
				if (data.vitals) {
					const vitals = new VitalsChart(this.container);
					vitals.render(data.vitals);
				}
				break;
			case 'workouts':
				if (data.workouts) {
					const workouts = new WorkoutsChart(this.container);
					workouts.render(data.workouts);
				}
				break;
		}
	}

	private formatDate(dateStr: string): string {
		const date = new Date(dateStr);
		const today = new Date();
		const yesterday = new Date(today);
		yesterday.setDate(yesterday.getDate() - 1);

		if (date.toDateString() === today.toDateString()) {
			return 'Today';
		} else if (date.toDateString() === yesterday.toDateString()) {
			return 'Yesterday';
		}

		return date.toLocaleDateString('en-US', {
			weekday: 'long',
			month: 'long',
			day: 'numeric'
		});
	}
}
