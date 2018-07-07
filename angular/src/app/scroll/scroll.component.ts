import {Component, HostListener, Inject} from "@angular/core";
import {DOCUMENT} from "@angular/platform-browser";

@Component({
    selector: 'scroll',
    templateUrl: '../angular/src/app/scroll/scroll.component.html'
})

export class ScrollComponent {
    public isHide: boolean = true;
    public status: string = 'top';
    public position: number;

    public constructor(@Inject(DOCUMENT) private document: Document) {
    }

    @HostListener("window:scroll", [])
    public onWindowScroll() {
        if (this.document.body.scrollTop < 200 && this.status === 'top') {
            this.isHide = true;
        }
        if (this.document.body.scrollTop > 200) {
            if (this.document.body.scrollTop < 200 && this.status === 'bottom') {
                this.isHide = false;
            } else {
                this.isHide = false;
                this.status = 'top';
            }
        }
    }

    public toggle() {
        if (this.status === 'top') {
            this.toTop();
        } else if (this.status === 'bottom') {
            this.toBottom();
        }
    }

    public toTop() {
        this.status = 'bottom';
        this.position = this.document.body.scrollTop;
        this.document.body.scrollTop = 0;
    }

    public toBottom() {
        this.status = 'top';
        this.document.body.scrollTop = this.position;
    }
}
