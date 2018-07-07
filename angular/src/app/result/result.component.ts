import {Component, HostListener, Inject, OnChanges, OnDestroy, OnInit} from "@angular/core";
import {Bookmark} from "../entities/bookmark";
import {UpdateService} from "../services/update.service";
import {Subscription} from "rxjs/Subscription";
import {BookmarksService} from "../http-services/bookmarks.service";
import {UserService} from "../http-services/user.service";
import {ProjectsService} from "../http-services/projects.service";
import {LoaderService} from "../services/loader.service";
import {BookmarkModel} from "../models/bookmark.model";
import {Project} from "../entities/project";
import {User} from "../entities/user";
import {AudioService} from "../services/audio.service";
import {DOCUMENT} from '@angular/platform-browser';
import {TimerObservable} from "rxjs/observable/TimerObservable";
import {SettingsService} from "../http-services/settings.service";

@Component({
    selector: 'app-result',
    templateUrl: '../angular/src/app/result/result.component.html'
})

export class ResultComponent implements OnInit, OnDestroy, OnChanges {
    public loaded: boolean = false;
    public loadOldProjects = false;
    public hideBookmarks: boolean = true;
    public bookmarksEmptyMessage: boolean = false;
    public projectsEmptyMessage: boolean = false;
    public errorMessage: string;
    public bookmarksErrorMessage: string;
    public projectsErrorMessage: string;

    public user: User;
    public bookmarks: Bookmark[] = [];
    public projects: Project[] = [];
    public newProjects: Project[] = [];

    private newProjectsCount: number = 0;
    private showLimit: number = 5;
    private lastProjectId: number;
    private firstProjectId: number;

    private subscription: Subscription;
    private timerSubscription: Subscription;

    public constructor(
        private bookmarksService: BookmarksService,
        private updateService: UpdateService,
        private userService: UserService,
        private settingsService: SettingsService,
        private projectsService: ProjectsService,
        private loaderService: LoaderService,
        @Inject(DOCUMENT) private document: Document
    ) {
        this.subscription = updateService.settingsObserver$.subscribe(
            id => {
                if (id === '1') {
                    this.ngOnDestroy();
                    this.ngOnChanges();
                }
            }
        );
    }

    @HostListener("window:scroll", [])
    public onWindowScroll() {
        if (this.loadOldProjects === false) {
            if (this.document.body.scrollHeight - this.document.body.scrollTop - window.screen.availHeight < 200) {
                this.loadOldProjects = true;
                this.addPrev();
            }
        }
    }

    public ngOnInit() {
        this.userService.get().then(
            result => {
                this.user = result;
                this.bookmarks = this.user.bookmarks;
                if (this.bookmarks.length === 0) {
                    this.bookmarksEmptyMessage = true;
                }
                this.projectsService.get().then(
                    result => {
                        if (result.length > 0) {
                            this.projects = result;
                            this.lastProjectId = result.slice(-1).pop().id;
                            this.firstProjectId = result[0].id;
                        } else {
                            this.projectsEmptyMessage = true;
                        }
                        if (this.user.settings.showDescription === 1) {
                            this.projects.forEach(function (element, index, array) {
                                array[index].hideDescription = false;
                            });
                        }

                        let timer = TimerObservable.create(5000, 10000);
                        this.timerSubscription = timer.subscribe(result => this.addNext());

                        this.loaded = true;
                        this.loaderService.displayLoader(false);
                    },
                    error => {
                        this.projectsErrorMessage = error;
                        this.loaderService.displayLoader(false);
                    }
                );
            },
            error => {
                this.errorMessage = error;
                this.loaderService.displayLoader(false);
            }
        );
    }

    public ngOnChanges() {
        this.settingsService.get().then(
            result => {
                this.user.settings = result;
                this.projectsService.get().then(
                    result => {
                        this.projects = result;

                        if (result.length > 0) {
                            this.lastProjectId = result.slice(-1).pop().id;
                            this.firstProjectId = result[0].id;

                            if (this.user.settings.showDescription === 1) {
                                this.projects.forEach(function (element, index, array) {
                                    array[index].hideDescription = false;
                                });
                            }
                            let timer = TimerObservable.create(5000, 10000);
                            this.timerSubscription = timer.subscribe(result => this.addNext());

                        } else {
                            this.projectsEmptyMessage = true;
                        }

                        this.loaded = true;
                        this.loaderService.displayLoader(false);
                    },
                    error => this.projectsErrorMessage = error
                );
            },
            error => this.errorMessage = error
        );
    }

    public ngOnDestroy() {
        this.timerSubscription.unsubscribe();
        this.projectsEmptyMessage = false;
        this.projectsErrorMessage = null;
        this.errorMessage = null;
        this.newProjects = [];
        this.newProjectsCount = 0;
    }

    public removeBookmark(projectId: number) {
        this.bookmarksErrorMessage = null;
        this.bookmarksService.remove(projectId).then(
            result => {
                if (result === 1) {
                    this.bookmarks = this.bookmarks.filter(item => item.project.id !== projectId);
                    let project = this.projects.find(item => item.id === projectId);
                    if (project) {
                        project.isBookmark = false;
                    }
                    if (this.bookmarks.length === 0) {
                        this.bookmarksEmptyMessage = true;
                    }
                }
            },
            error => this.bookmarksErrorMessage = error
        );
    }

    private addBookmark(project: Project) {
        if (project.isBookmark === false) {
            this.bookmarksErrorMessage = null;
            this.bookmarksService.add(new BookmarkModel(project.id)).then(
                result => {
                    project.isBookmark = true;
                    this.bookmarks.push(result);
                    if (this.bookmarks.length > 0) {
                        this.bookmarksEmptyMessage = false;
                    }
                },
                error => this.bookmarksErrorMessage = error
            );
        } else {
            this.removeBookmark(project.id);
        }
    }

    public concatProjects(): void {
        if (this.newProjects.length > 0) {
            let newItems = this.newProjects.slice(0, this.showLimit);
            this.projects = newItems.reverse().concat(this.projects);
            this.newProjects = this.newProjects.filter(
                firstItem => !newItems.some(
                    secondItem => firstItem.id === secondItem.id
                )
            );
            this.newProjectsCount -= newItems.length;
        }
    }

    public addNext(): void {
        this.projectsErrorMessage = null;
        this.projectsService.getNext(this.firstProjectId).then(
            result => {
                if (result.length > 0) {
                    if (this.user.settings.showDescription === 1) {
                        result.forEach(function (element, index, array) {
                            array[index].hideDescription = false;
                        });
                    }
                    if (this.newProjects.length > 0) {
                        this.newProjects = this.newProjects.concat(result);
                    } else {
                        this.newProjects = result;
                    }
                    this.firstProjectId = result.slice(-1).pop().id;
                    this.newProjectsCount += result.length;
                    if (this.user.settings.soundNotification) {
                        AudioService.play();
                    }
                }
            },
            error => this.projectsErrorMessage = error
        );
    }

    public addPrev(): void {
        this.projectsErrorMessage = null;
        this.projectsService.getPrev(this.lastProjectId).then(
            result => {
                if (this.user.settings.showDescription === 1) {
                    result.forEach(function (element, index, array) {
                        array[index].hideDescription = false;
                    });
                }
                this.projects = this.projects.concat(result);
                if (result.length > 0) {
                    this.lastProjectId = result.slice(-1).pop().id;
                } else {
                    this.projectsEmptyMessage = true;
                }
                this.loadOldProjects = false;
            },
            error => this.projectsErrorMessage = error
        );
    }

    public toggleBookmarks() {
        this.hideBookmarks = !this.hideBookmarks;
    }

    public toggleBookmarkDescription(project: Project): void {
        project.hideDescription = project.hideDescription !== true;
    }

    public toggleProjectDescription(bookmark: Bookmark): void {
        bookmark.hideDescription = bookmark.hideDescription !== true;
    }
}
