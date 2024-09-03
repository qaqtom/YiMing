import { defineStore } from 'pinia';
import type { Viewer } from 'cesium';

interface ViewerState {
    viewer: Viewer | null;
}

export const useViewerStore = defineStore('viewer', {
    state: (): ViewerState => ({
        viewer: null, 
    }),
    actions: {
        initViewer(viewer: Viewer) {
            this.viewer = viewer;
        },
    },
});


