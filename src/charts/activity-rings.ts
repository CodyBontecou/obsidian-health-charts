import { ActivityData } from '../types';

export class ActivityRingsChart {
	private container: HTMLElement;
	private readonly RING_WIDTH = 20;
	private readonly RING_SPACING = 8;

	// Default goals (Apple Watch style)
	private readonly DEFAULT_GOALS = {
		steps: 10000,
		calories: 500,
		exercise: 30 // minutes
	};

	constructor(container: HTMLElement) {
		this.container = container;
	}

	render(data: ActivityData, options: any = {}): void {
		const goals = {
			steps: options.stepGoal || this.DEFAULT_GOALS.steps,
			calories: options.calorieGoal || this.DEFAULT_GOALS.calories,
			exercise: options.exerciseGoal || this.DEFAULT_GOALS.exercise
		};

		// Calculate percentages
		const movePercent = Math.min((data.activeCalories || 0) / goals.calories * 100, 100);
		const exercisePercent = Math.min((data.exerciseMinutes || 0) / goals.exercise * 100, 100);
		const standPercent = Math.min((data.steps || 0) / goals.steps * 100, 100);

		// Create rings container
		const ringsContainer = this.container.createDiv({ cls: 'activity-rings-container' });

		// SVG canvas
		const size = 280;
		const center = size / 2;
		const svg = this.createSVG(size);

		// Draw rings (from outer to inner: Move, Exercise, Stand)
		const rings = [
			{ percent: movePercent, color: '#FF006E', label: 'Move', value: data.activeCalories || 0, goal: goals.calories, unit: 'CAL', radius: 110 },
			{ percent: exercisePercent, color: '#00F5D4', label: 'Exercise', value: data.exerciseMinutes || 0, goal: goals.exercise, unit: 'MIN', radius: 85 },
			{ percent: standPercent, color: '#3A86FF', label: 'Stand', value: data.steps || 0, goal: goals.steps, unit: 'STEPS', radius: 60 }
		];

		rings.forEach(ring => {
			// Background ring
			this.drawRing(svg, center, center, ring.radius, 360, ring.color, 0.15);
			// Progress ring
			this.drawRing(svg, center, center, ring.radius, ring.percent * 3.6, ring.color, 1);
		});

		ringsContainer.appendChild(svg);

		// Stats below rings
		const statsContainer = ringsContainer.createDiv({ cls: 'activity-rings-stats' });

		rings.forEach(ring => {
			const stat = statsContainer.createDiv({ cls: 'activity-ring-stat' });
			stat.innerHTML = `
				<div class="ring-stat-dot" style="background: ${ring.color}"></div>
				<div class="ring-stat-info">
					<div class="ring-stat-label">${ring.label}</div>
					<div class="ring-stat-value">${Math.round(ring.value)} / ${ring.goal} ${ring.unit}</div>
				</div>
			`;
		});

		// Steps display (prominent)
		if (data.steps) {
			const stepsDisplay = ringsContainer.createDiv({ cls: 'steps-display' });
			stepsDisplay.innerHTML = `
				<div class="steps-count">${data.steps.toLocaleString()}</div>
				<div class="steps-label">steps</div>
			`;
		}
	}

	private createSVG(size: number): SVGElement {
		const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
		svg.setAttribute('width', size.toString());
		svg.setAttribute('height', size.toString());
		svg.setAttribute('viewBox', `0 0 ${size} ${size}`);
		svg.classList.add('activity-rings-svg');
		return svg;
	}

	private drawRing(
		svg: SVGElement,
		centerX: number,
		centerY: number,
		radius: number,
		degrees: number,
		color: string,
		opacity: number
	): void {
		const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');

		// Start at top (12 o'clock)
		const startAngle = -90;
		const endAngle = startAngle + degrees;

		const start = this.polarToCartesian(centerX, centerY, radius, endAngle);
		const end = this.polarToCartesian(centerX, centerY, radius, startAngle);

		const largeArcFlag = degrees > 180 ? 1 : 0;

		const d = [
			'M', start.x, start.y,
			'A', radius, radius, 0, largeArcFlag, 0, end.x, end.y
		].join(' ');

		path.setAttribute('d', d);
		path.setAttribute('stroke', color);
		path.setAttribute('stroke-width', this.RING_WIDTH.toString());
		path.setAttribute('stroke-linecap', 'round');
		path.setAttribute('fill', 'none');
		path.setAttribute('opacity', opacity.toString());

		svg.appendChild(path);
	}

	private polarToCartesian(centerX: number, centerY: number, radius: number, angleInDegrees: number) {
		const angleInRadians = (angleInDegrees * Math.PI) / 180.0;
		return {
			x: centerX + radius * Math.cos(angleInRadians),
			y: centerY + radius * Math.sin(angleInRadians)
		};
	}
}
