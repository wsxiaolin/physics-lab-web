<template></template>

<script setup lang="ts">
import { useMessage } from "naive-ui";
import Emitter from "../../services/eventEmitter";

window.$message = useMessage();
Emitter.on("warning", (msg: string, duration: number) => {
  window.$message.warning(msg, { duration: duration * 1000 });
});
Emitter.on("info", (msg: string, duration: number) => {
  window.$message.info(msg, { duration: duration * 1000 });
});
Emitter.on("error", (msg: string, duration: number) => {
  window.$message.error(msg, { duration: duration * 1000 });
});
Emitter.on("success", (msg: string, duration: number) => {
  window.$message.success(msg, { duration: duration * 1000 });
});
Emitter.on("loading", (msg: string, duration: number) => {
  window.$message.loading(msg, { duration: duration * 1000 });
});
</script>
