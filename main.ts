import { Plugin, MarkdownPostProcessorContext } from 'obsidian';
import { HealthDataParser } from './src/parser';
import { HealthChartRenderer } from './src/renderer';

export default class HealthChartsPlugin extends Plugin {
	private processedFiles: Set<string> = new Set();

	async onload() {
		console.log('Loading Health Charts Plugin');

		// Register code block processor for explicit chart rendering
		this.registerMarkdownCodeBlockProcessor('health-chart', (source, el, ctx) => {
			this.renderHealthChart(source, el, ctx);
		});

		// Use a more targeted approach - look for frontmatter section
		this.registerMarkdownPostProcessor((element, context) => {
			// Only process once per file
			const cacheKey = `${context.sourcePath}-${element.className}`;

			// Look for the frontmatter indicator that this is a health data file
			const hasFrontmatter = element.querySelector('div.frontmatter') ||
								   element.textContent?.includes('type: health-data');

			if (hasFrontmatter && !this.processedFiles.has(cacheKey)) {
				this.processedFiles.add(cacheKey);
				this.processHealthData(element, context);
			}
		});
	}

	private processHealthData(element: HTMLElement, context: MarkdownPostProcessorContext) {
		const file = this.app.vault.getAbstractFileByPath(context.sourcePath);
		if (!file) return;

		this.app.vault.cachedRead(file as any).then(content => {
			const parser = new HealthDataParser();
			const healthData = parser.parseMarkdown(content);

			if (healthData) {
				// Insert charts at the top of the document
				const container = createDiv({ cls: 'health-charts-container' });
				const renderer = new HealthChartRenderer(container);
				renderer.render(healthData);

				// Find the best insertion point
				const parent = element.parentElement;
				if (parent) {
					parent.insertBefore(container, parent.firstChild);
				}
			}
		}).catch(error => {
			console.error('Health Charts: Error reading file', error);
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
