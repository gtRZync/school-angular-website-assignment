import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class StorageService{

    setItem(key: string, item: any): void {
        localStorage.setItem(key, JSON.stringify(item));
    }

    getItem<T>(key: string): T | null {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) as T : null;
    }

    removeItem(key: string): void {
        localStorage.removeItem(key);
    }

    clear(): void {
        localStorage.clear();
    }
}