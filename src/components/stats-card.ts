export class StatsCard {
	private container: HTMLElement;
	private title: string;
	private icon: string;
	private color: string;
	private cardElement: HTMLElement;
	private contentElement: HTMLElement;

	constructor(container: HTMLElement, title: string, icon: string, color: string) {
		this.container = container;
		this.title = title;
		this.icon = icon;
		this.color = color;
	}

	render(): void {
		this.cardElement = this.container.createDiv({ cls: 'health-card' });

		// Card header
		const header = this.cardElement.createDiv({ cls: 'health-card-header' });
		header.createSpan({ text: this.icon, cls: 'health-card-icon' });
		header.createSpan({ text: this.title, cls: 'health-card-title' });

		// Card content
		this.contentElement = this.cardElement.createDiv({ cls: 'health-card-content' });

		// Set accent color
		this.cardElement.style.setProperty('--card-accent', this.color);
	}

	getContent(): HTMLElement {
		return this.contentElement;
	}

	getCard(): HTMLElement {
		return this.cardElement;
	}
}
