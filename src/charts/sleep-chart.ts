import { SleepData } from '../types';

export class SleepChart {
	private container: HTMLElement;

	constructor(container: HTMLElement) {
		this.container = container;
	}

	render(data: SleepData): void {
		// Total sleep time (prominent)
		if (data.totalDurationFormatted) {
			const totalSleep = this.container.createDiv({ cls: 'sleep-total' });
			totalSleep.innerHTML = `
				<div class="sleep-total-value">${data.totalDurationFormatted}</div>
				<div class="sleep-total-label">Total Sleep</div>
			`;
		}

		// Sleep stages breakdown
		const stages = [
			{ label: 'Deep', value: data.deepSleepFormatted, color: '#A78AFA', icon: '🌙' },
			{ label: 'REM', value: data.remSleepFormatted, color: '#60A5FA', icon: '💭' },
			{ label: 'Core', value: data.coreSleepFormatted, color: '#818CF8', icon: '😴' }
		];

		const stagesContainer = this.container.createDiv({ cls: 'sleep-stages' });

		stages.forEach(stage => {
			if (stage.value) {
				const stageEl = stagesContainer.createDiv({ cls: 'sleep-stage' });
				stageEl.innerHTML = `
					<div class="sleep-stage-icon">${stage.icon}</div>
					<div class="sleep-stage-info">
						<div class="sleep-stage-label">${stage.label}</div>
						<div class="sleep-stage-value" style="color: ${stage.color}">${stage.value}</div>
					</div>
				`;
			}
		});

		// Visual sleep bar (if we have all data)
		if (data.deepSleep && data.remSleep && data.coreSleep && data.totalDuration) {
			const barContainer = this.container.createDiv({ cls: 'sleep-bar-container' });
			const bar = barContainer.createDiv({ cls: 'sleep-bar' });

			const deepPercent = (data.deepSleep / data.totalDuration) * 100;
			const remPercent = (data.remSleep / data.totalDuration) * 100;
			const corePercent = (data.coreSleep / data.totalDuration) * 100;

			bar.innerHTML = `
				<div class="sleep-bar-segment" style="width: ${deepPercent}%; background: linear-gradient(135deg, #A78AFA, #9333EA);"></div>
				<div class="sleep-bar-segment" style="width: ${remPercent}%; background: linear-gradient(135deg, #60A5FA, #3B82F6);"></div>
				<div class="sleep-bar-segment" style="width: ${corePercent}%; background: linear-gradient(135deg, #818CF8, #6366F1);"></div>
			`;
		}
	}
}
