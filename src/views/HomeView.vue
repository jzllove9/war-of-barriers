<template></template>

<script setup>
import * as PIXI from 'pixi.js';
import { createBoard } from '../game-core/board';

const usePIXI = () => {
    const app = ref(null);

    const initApp = cb => {
        const app = new PIXI.Application({ resizeTo: window });
        document.body.appendChild(app.view);
        cb(app);
    };

    return { initApp, app };
};

const { initApp } = usePIXI();

initApp(app => {
    createBoard(app);
});
</script>
