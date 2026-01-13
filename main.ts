import { Plugin, MarkdownPostProcessorContext } from 'obsidian';
import { HealthDataParser } from './src/parser';
import { HealthChartRenderer } from './src/renderer';

export default class HealthChartsPlugin extends Plugin {
	private processedFiles: Set<string> = new Set();

	async onload() {
		console.log('Loading Health Charts Plugin');

		// Clear cache when switching files to allow re-rendering
		this.registerEvent(
			this.app.workspace.on('active-leaf-change', () => {
				console.log('Health Charts: Active leaf changed, clearing cache');
				this.processedFiles.clear();
			})
		);

		// Register code block processor for explicit chart rendering
		this.registerMarkdownCodeBlockProcessor('health-chart', (source, el, ctx) => {
			this.renderHealthChart(source, el, ctx);
		});

		// Use a more targeted approach - check file content directly
		this.registerMarkdownPostProcessor(async (element, context) => {
			// Only process once per file - mark immediately to prevent race conditions
			const cacheKey = context.sourcePath;

			console.log('Health Charts: Post-processor called for:', context.sourcePath);
			console.log('Health Charts: Cache key:', cacheKey, 'Already processed:', this.processedFiles.has(cacheKey));

			// Skip if already processed
			if (this.processedFiles.has(cacheKey)) {
				console.log('Health Charts: Skipping, already processed');
				return;
			}

			// Mark as processed immediately to prevent duplicate processing
			this.processedFiles.add(cacheKey);

			// Check if this is a health data file by reading the file content
			const file = this.app.vault.getAbstractFileByPath(context.sourcePath);
			if (!file) {
				console.log('Health Charts: File not found');
				this.processedFiles.delete(cacheKey); // Remove from cache if file not found
				return;
			}

			try {
				const content = await this.app.vault.cachedRead(file as any);
				const isHealthData = content.includes('type: health-data');

				console.log('Health Charts: Is health data file:', isHealthData);

				if (isHealthData) {
					console.log('Health Charts: Processing health data for:', context.sourcePath);
					this.processHealthData(element, context);
				} else {
					// Not a health data file, remove from cache
					this.processedFiles.delete(cacheKey);
				}
			} catch (error) {
				console.error('Health Charts: Error checking file type:', error);
				this.processedFiles.delete(cacheKey); // Remove from cache on error
			}
		});
	}

	private processHealthData(element: HTMLElement, context: MarkdownPostProcessorContext) {
		console.log('Health Charts: processHealthData called for:', context.sourcePath);
		const file = this.app.vault.getAbstractFileByPath(context.sourcePath);
		if (!file) {
			console.log('Health Charts: File not found:', context.sourcePath);
			return;
		}

		console.log('Health Charts: Reading file:', context.sourcePath);
		this.app.vault.cachedRead(file as any).then(content => {
			const parser = new HealthDataParser();
			const healthData = parser.parseMarkdown(content);

			console.log('Health Charts: Parsed health data:', healthData ? 'success' : 'failed');

			if (healthData) {
				// Insert charts at the top of the element
				const container = createDiv({ cls: 'health-charts-container' });
				const renderer = new HealthChartRenderer(container);
				renderer.render(healthData);

				console.log('Health Charts: Rendered charts, inserting into DOM');

				// Insert at the beginning of the element itself
				element.insertBefore(container, element.firstChild);

				console.log('Health Charts: Charts inserted successfully');
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
		this.processedFiles.clear();
	}
}
