import { Plugin, MarkdownPostProcessorContext } from 'obsidian';
import { HealthDataParser } from './src/parser';
import { HealthChartRenderer } from './src/renderer';

export default class HealthChartsPlugin extends Plugin {
	async onload() {
		console.log('Loading Health Charts Plugin');

		// Register markdown post processor to detect health data
		this.registerMarkdownPostProcessor((element, context) => {
			this.processHealthData(element, context);
		});

		// Register code block processor for explicit chart rendering
		this.registerMarkdownCodeBlockProcessor('health-chart', (source, el, ctx) => {
			this.renderHealthChart(source, el, ctx);
		});
	}

	private processHealthData(element: HTMLElement, context: MarkdownPostProcessorContext) {
		// Check if this markdown file contains health data
		const file = this.app.vault.getAbstractFileByPath(context.sourcePath);
		if (!file) return;

		this.app.vault.cachedRead(file as any).then(content => {
			const parser = new HealthDataParser();
			const healthData = parser.parseMarkdown(content);

			if (healthData) {
				// Found health data - render charts
				const renderer = new HealthChartRenderer(element);
				renderer.render(healthData);
			}
		});
	}

	private renderHealthChart(source: string, el: HTMLElement, ctx: MarkdownPostProcessorContext) {
		try {
			const config = JSON.parse(source);
			const parser = new HealthDataParser();

			// Get data from specified file or current file
			const filePath = config.file || ctx.sourcePath;
			const file = this.app.vault.getAbstractFileByPath(filePath);

			if (!file) {
				el.createEl('div', { text: 'Health data file not found', cls: 'health-chart-error' });
				return;
			}

			this.app.vault.cachedRead(file as any).then(content => {
				const healthData = parser.parseMarkdown(content);

				if (!healthData) {
					el.createEl('div', { text: 'No health data found in file', cls: 'health-chart-error' });
					return;
				}

				const renderer = new HealthChartRenderer(el);

				// Render specific chart type if specified
				if (config.type) {
					renderer.renderSpecific(healthData, config.type, config.options || {});
				} else {
					renderer.render(healthData);
				}
			});
		} catch (error) {
			el.createEl('div', { text: `Error rendering health chart: ${error.message}`, cls: 'health-chart-error' });
		}
	}

	onunload() {
		console.log('Unloading Health Charts Plugin');
	}
}
