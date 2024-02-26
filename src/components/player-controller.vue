<template>
    <div class="wrap">
        <div class="block">
            <div class="row">
                <div class="label">玩家：</div>
                <div class="value">{{ currentInfo?.name }}</div>
            </div>
            <div class="row">
                <div class="label">剩余阻挡块数量：</div>
                <div class="value">{{ currentInfo?.blocks?.remain }}</div>
            </div>
            <div class="row">
                <div class="label">是否开启辅助线：</div>
                <Toggle v-model="showAssistLine" @change="onToggleAssistLineChange"></Toggle>
            </div>
        </div>
        <div class="block">
            <div class="row">
                <div class="label">当前操作：</div>
                <div
                    class="btn"
                    :class="{ active: currentMode === RoleMoveModeEnum.Move }"
                    @click="onChangeModeBtnClick(RoleMoveModeEnum.Move)"
                >
                    移动
                </div>
                <div
                    class="btn"
                    :class="{ active: currentMode === RoleMoveModeEnum.Block }"
                    @click="onChangeModeBtnClick(RoleMoveModeEnum.Block)"
                >
                    阻挡
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import Toggle from '@vueform/toggle';
import '@vueform/toggle/themes/default.css';
import { RoleMoveModeEnum } from '../game-core/const-value';
const props = defineProps({
    info: {
        type: Object,
        default: () => ({}),
    },
});
const emits = defineEmits(['change-mode', 'change-assistLine-display']);

const currentInfo = computed(() => {
    return props.info;
});

const currentMode = ref(RoleMoveModeEnum.Move);
const showAssistLine = ref(false);

const onChangeModeBtnClick = mode => {
    currentMode.value = mode;
    emits('change-mode', mode);
};

const onToggleAssistLineChange = value => {
    emits('change-assistLine-display', value);
};

defineExpose({
    onChangeModeBtnClick,
});
</script>

<style lang="less" scoped>
.wrap {
    padding: 10px;
    color: white;
    display: flex;

    .block {
        flex: 1;
        .row {
            display: flex;
            line-height: 30px;
            align-items: center;
            .label {
            }
            .value {
            }

            .btn {
                cursor: pointer;
                padding: 0 10px;
                border: 1px solid #fff;

                &.active {
                    background-color: #fff;
                    color: #000;
                }

                &:last-child {
                    margin-left: 5px;
                }
            }
        }
    }
}
</style>
