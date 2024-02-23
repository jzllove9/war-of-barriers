<template></template>

<script setup>
import * as PIXI from 'pixi.js';
import Game from '../game-core/index';

const usePIXI = () => {
    // const app = ref(null);
    const initApp = cb => {
        const app = new PIXI.Application({ resizeTo: window });
        document.body.appendChild(app.view);
        cb(app);
    };

    return { initApp };
};

const { initApp } = usePIXI();

initApp(app => {
    const game = new Game(app);
});
</script>
