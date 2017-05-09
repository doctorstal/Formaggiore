import {InjectionToken} from "@angular/core";

export const PLATFORM_READY = new InjectionToken<Promise<void>>('ready');
