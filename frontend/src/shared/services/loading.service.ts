import { Injectable, computed, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  private readonly _isLoadingSignal = signal<boolean>(false);
  readonly isLoadingSignal = computed(() => this._isLoadingSignal());

  showProcessBar() {
    this._isLoadingSignal.set(true)
  }

  hideProcessBar() {
    this._isLoadingSignal.set(false)
  }
}
