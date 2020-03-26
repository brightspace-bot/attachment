export const PendingMixin = superclass => class extends superclass {
	_loaded() {
		if (this._pendingResolve) {
			this._pendingResolve();
			this._pendingReject = null;
			this._pendingResolve = null;
		}
	}

	_errored(e) {
		if (this._pendingReject) {
			this._pendingReject();
			this._pendingReject = null;
			this._pendingResolve = null;
		}
		this.dispatchEvent(
			new CustomEvent('error', {
				composed: true,
				bubbles: true,
				detail: e,
			}),
		);
	}

	firstUpdated() {
		super.firstUpdated();
		this._dispatchPending(this._createPendingPromise());
	}

	_createPendingPromise() {
		return new Promise((resolve, reject) => {
			this._pendingResolve = resolve;
			this._pendingReject = reject;
		});
	}

	_dispatchPending(promise) {
		const pendingEvent = new CustomEvent('pending-state', {
			composed: true,
			bubbles: true,
			detail: { promise },
		});
		this.dispatchEvent(pendingEvent);
	}
};
