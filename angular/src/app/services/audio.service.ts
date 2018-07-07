import {Injectable} from '@angular/core';

@Injectable()
export class AudioService {
    public static play() {
        var audio = new Audio();
        audio.src = "../sound.wav";
        audio.load();
        audio.play();
    }
}