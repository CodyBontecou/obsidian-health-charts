import { VitalsData } from '../types';

export class VitalsChart {
	private container: HTMLElement;

	constructor(container: HTMLElement) {
		this.container = container;
	}

	render(data: VitalsData): void {
		const vitals = [
			{
				label: 'Resting HR',
				value: data.restingHeartRate,
				unit: 'BPM',
				icon: '❤️',
				color: '#FF6B9D',
				normal: { min: 60, max: 100 }
			},
			{
				label: 'HRV',
				value: data.hrv,
				unit: 'ms',
				icon: '💓',
				color: '#FF8FA3',
				normal: { min: 30, max: 100 }
			},
			{
				label: 'Respiratory',
				value: data.respiratoryRate,
				unit: '/min',
				icon: '🫁',
				color: '#60A5FA',
				normal: { min: 12, max: 20 }
			},
			{
				label: 'SpO₂',
				value: data.bloodOxygenPercent,
				unit: '%',
				icon: '🩸',
				color: '#F472B6',
				normal: { min: 95, max: 100 }
			}
		];

		vitals.forEach(vital => {
			if (vital.value !== undefined && vital.value !== null) {
				const vitalEl = this.container.createDiv({ cls: 'vital-item' });

				// Check if value is in normal range
				const isNormal = vital.value >= vital.normal.min && vital.value <= vital.normal.max;
				const statusClass = isNormal ? 'vital-normal' : 'vital-alert';

				vitalEl.innerHTML = `
					<div class="vital-icon">${vital.icon}</div>
					<div class="vital-info">
						<div class="vital-label">${vital.label}</div>
						<div class="vital-value ${statusClass}">
							<span style="color: ${vital.color}">${vital.value.toFixed(1)}</span>
							<span class="vital-unit">${vital.unit}</span>
						</div>
					</div>
				`;
			}
		});
	}
}
